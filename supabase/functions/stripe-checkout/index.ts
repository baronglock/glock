import "https://deno.land/x/xhr@0.1.0/mod.ts"
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2023-10-16" })

// Preços: PIX/boleto (pagamento único) e Cartão (assinatura recorrente)
const PRICES = {
  S: { once: "price_1TFFURCgEZHBzNmw6mjAONmL" },  // Varredura sempre único
  M: { once: "price_1TFGcWCgEZHBzNmwQhlDHUJo", recurring: "price_1TFFURCgEZHBzNmwTfzT23oH" },
  A: { once: "price_1TFGcXCgEZHBzNmwMsA2t6gS", recurring: "price_1TFFUSCgEZHBzNmw4fdD0ts5" },
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // payment_mode: "once" (PIX/boleto/cartão único) ou "recurring" (cartão recorrente)
    const { plan_type, payment_mode, user_id, user_email, referred_by } = await req.json()

    if (!plan_type || !PRICES[plan_type as keyof typeof PRICES]) {
      return new Response(JSON.stringify({ error: "Invalid plan_type. Use S, M, or A." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const planPrices = PRICES[plan_type as keyof typeof PRICES]
    const useRecurring = payment_mode === "recurring" && "recurring" in planPrices
    const priceId = useRecurring ? planPrices.recurring! : planPrices.once
    const mode = useRecurring ? "subscription" : "payment"

    const baseUrl = Deno.env.get("SITE_URL") || "https://stauf.com.br"

    const sessionParams: any = {
      line_items: [{ price: priceId, quantity: 1 }],
      mode,
      success_url: `${baseUrl}/conta/dashboard?payment=success&plan=${plan_type}`,
      cancel_url: `${baseUrl}/killspy#planos`,
      client_reference_id: user_id,
      metadata: { user_id, plan_type, referred_by: referred_by || "", payment_mode: payment_mode || "once" },
    }

    // PIX + boleto + cartão pra pagamento único / só cartão pra recorrente
    if (!useRecurring) {
      sessionParams.payment_method_types = ["card", "pix", "boleto"]
    }

    if (user_email) sessionParams.customer_email = user_email

    const session = await stripe.checkout.sessions.create(sessionParams)

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
