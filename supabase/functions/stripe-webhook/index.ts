import Stripe from "https://esm.sh/stripe@14.14.0?target=deno"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" })
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

// Plan type → days
const PLAN_DAYS: Record<string, number> = { S: 1, M: 30, A: 365 }

// Plan type → prices for commission calculation
const PLAN_PRICES: Record<string, number> = { S: 19.90, M: 39.90, A: 399.99 }

function generateKey(planType: string, expiresDate: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const rand = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  const dateStr = expiresDate.replace(/-/g, "").slice(0, 8)
  // Simple checksum
  const base = `KILL-${rand}-${planType}-${dateStr}`
  const hash = Array.from(base).reduce((s, c) => s + c.charCodeAt(0), 0)
  const check = (hash % 65536).toString(16).toUpperCase().padStart(4, "0")
  return `${base}-${check}`
}

Deno.serve(async (req) => {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message)
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 })
  }

  console.log(`Stripe event: ${event.type}`)

  // Handle checkout.session.completed (one-time payments + first subscription payment)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.client_reference_id || session.metadata?.user_id
    const planType = session.metadata?.plan_type || "S"
    const referredBy = session.metadata?.referred_by || ""
    const amount = (session.amount_total || 0) / 100

    if (!userId) {
      console.error("No user_id in session")
      return new Response("ok", { status: 200 })
    }

    console.log(`Payment confirmed: user=${userId}, plan=${planType}, amount=R$${amount}`)

    // 1. Generate license key
    const days = PLAN_DAYS[planType] || 1
    const expiresAt = new Date(Date.now() + days * 86400000)
    const key = generateKey(planType, expiresAt.toISOString())

    const { error: licError } = await supabase.from("licenses").insert({
      user_id: userId,
      key,
      plan_type: planType,
      expires_at: expiresAt.toISOString(),
    })
    if (licError) console.error("License insert error:", licError)
    else console.log(`License created: ${key}, expires ${expiresAt.toISOString()}`)

    // 2. Record payment
    const { error: payError } = await supabase.from("payments").insert({
      user_id: userId,
      stripe_payment_id: session.payment_intent || session.subscription || session.id,
      amount,
      plan_type: planType,
      referred_by: referredBy,
      commission_amount: referredBy ? PLAN_PRICES[planType] * 0.30 : 0,
    })
    if (payError) console.error("Payment insert error:", payError)

    // 3. Handle referral commission
    if (referredBy) {
      // Find the referrer by ref_code
      const { data: referrer } = await supabase
        .from("profiles")
        .select("id")
        .eq("ref_code", referredBy)
        .limit(1)

      if (referrer && referrer.length > 0) {
        const commission = PLAN_PRICES[planType] * 0.30

        // Get the payment id we just inserted
        const { data: paymentRecord } = await supabase
          .from("payments")
          .select("id")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)

        if (paymentRecord && paymentRecord.length > 0) {
          const { error: refError } = await supabase.from("referrals").insert({
            referrer_user_id: referrer[0].id,
            referred_user_id: userId,
            payment_id: paymentRecord[0].id,
            commission_amount: commission,
          })
          if (refError) console.error("Referral insert error:", refError)
          else console.log(`Referral commission: R$${commission} to ${referredBy}`)
        }
      }
    }
  }

  // Handle invoice.paid (subscription renewals — NOT first payment, that's checkout.session.completed)
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice

    // Skip if it's the first invoice (already handled by checkout.session.completed)
    if (invoice.billing_reason === "subscription_create") {
      return new Response("ok", { status: 200 })
    }

    const customerId = invoice.customer as string
    const amount = (invoice.amount_paid || 0) / 100

    // Find user by stripe customer — look up in payments table
    const { data: prevPayment } = await supabase
      .from("payments")
      .select("user_id, plan_type")
      .eq("stripe_payment_id", invoice.subscription)
      .limit(1)

    if (prevPayment && prevPayment.length > 0) {
      const userId = prevPayment[0].user_id
      const planType = prevPayment[0].plan_type
      const days = PLAN_DAYS[planType] || 30

      // Extend existing active license instead of creating new one
      const { data: existingLicense } = await supabase
        .from("licenses")
        .select("id, expires_at")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("expires_at", { ascending: false })
        .limit(1)

      if (existingLicense && existingLicense.length > 0) {
        // Extend from current expiry (or now if already expired)
        const currentExpiry = new Date(existingLicense[0].expires_at)
        const baseDate = currentExpiry > new Date() ? currentExpiry : new Date()
        const newExpiry = new Date(baseDate.getTime() + days * 86400000)

        await supabase.from("licenses").update({
          expires_at: newExpiry.toISOString(),
        }).eq("id", existingLicense[0].id)

        console.log(`Renewal: extended license for user=${userId}, new expiry=${newExpiry.toISOString()}`)
      } else {
        // No active license found, create new one
        const expiresAt = new Date(Date.now() + days * 86400000)
        const key = generateKey(planType, expiresAt.toISOString())
        await supabase.from("licenses").insert({
          user_id: userId, key, plan_type: planType, expires_at: expiresAt.toISOString(),
        })
        console.log(`Renewal: created new license for user=${userId}, key=${key}`)
      }

      // Record renewal payment (NO commission on renewals)
      await supabase.from("payments").insert({
        user_id: userId,
        stripe_payment_id: invoice.id,
        amount,
        plan_type: planType,
        commission_amount: 0,
      })
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
