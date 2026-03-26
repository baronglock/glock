/* Stauf Account API — Supabase client (singleton) */
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vjcskrsbsxcsnxhrxwyi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqY3NrcnNic3hjc254aHJ4d3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0ODM2NjUsImV4cCI6MjA5MDA1OTY2NX0.JjkeUwGdezMLUCXql4-Z5ZEfi-j3NvPcWpiXeflkn6U';

// Singleton — prevent multiple GoTrueClient instances
const GLOBAL_KEY = '__supabase_stauf';
function getSupabase(): SupabaseClient {
  if (!(window as any)[GLOBAL_KEY]) {
    (window as any)[GLOBAL_KEY] = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return (window as any)[GLOBAL_KEY];
}
export const supabase = getSupabase();

/* ── Auth ── */
export async function register(name: string, email: string, password: string, phone?: string, refCode?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone: phone || null, referred_by: refCode || null },
    },
  });
  if (error) throw new Error(error.message);

  // Update profile with phone and referred_by if provided
  if (data.user && (phone || refCode)) {
    await supabase.from('profiles').update({
      phone: phone || null,
      referred_by: refCode || null,
    }).eq('id', data.user.id);
  }

  return data;
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Email ou senha incorretos' : error.message);
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/conta/login';
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/* ── Profile ── */
export async function getProfile() {
  const user = await getUser();
  if (!user) return null;

  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).limit(1);
  return data && data.length > 0 ? data[0] : null;
}

export async function updateProfile(updates: { phone?: string; pix_key?: string }) {
  const user = await getUser();
  if (!user) throw new Error('Not logged in');

  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
  if (error) throw new Error(error.message);
}

/* ── Licenses ── */
export async function getLicenses() {
  const user = await getUser();
  if (!user) return [];

  const { data } = await supabase.from('licenses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getActiveLicense() {
  const user = await getUser();
  if (!user) return null;

  const { data } = await supabase.from('licenses')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .gte('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1);
  return data && data.length > 0 ? data[0] : null;
}

/* ── Referrals ── */
export async function getReferrals() {
  const user = await getUser();
  if (!user) return { referrals: [], total_earned: 0, balance: 0 };

  const { data: profile } = await supabase.from('profiles').select('ref_code').eq('id', user.id).single();
  const { data: referrals } = await supabase.from('referrals')
    .select('*, profiles!referrals_referred_user_id_fkey(name), payments!inner(plan_type, amount, created_at)')
    .eq('referrer_user_id', user.id)
    .order('commission_amount', { ascending: false });

  const items = referrals || [];
  const total_earned = items.reduce((s: number, r: any) => s + parseFloat(r.commission_amount), 0);
  const total_paid = items.filter((r: any) => r.commission_paid).reduce((s: number, r: any) => s + parseFloat(r.commission_amount), 0);

  return {
    referrals: items,
    ref_code: profile?.ref_code || '',
    total_earned,
    total_paid,
    balance: total_earned - total_paid,
  };
}

/* ── Withdrawals ── */
export async function requestWithdrawal(pixKey: string) {
  const user = await getUser();
  if (!user) throw new Error('Not logged in');

  // Get balance
  const { balance } = await getReferrals();
  if (balance < 20) throw new Error(`Saldo mínimo para saque é R$20. Seu saldo: R$${balance.toFixed(2)}`);

  // Check pending
  const { data: pending } = await supabase.from('withdrawals')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .limit(1);
  if (pending && pending.length > 0) throw new Error('Você já tem um saque pendente');

  // Update pix key
  await supabase.from('profiles').update({ pix_key: pixKey }).eq('id', user.id);

  // Create withdrawal
  const { data, error } = await supabase.from('withdrawals').insert({
    user_id: user.id,
    amount: balance,
    pix_key: pixKey,
  }).select().single();

  if (error) throw new Error(error.message);
  return data;
}

/* ── Payments ── */
export async function getPayments() {
  const user = await getUser();
  if (!user) return [];

  const { data } = await supabase.from('payments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return data || [];
}

/* ── Stripe Checkout via Supabase Edge Function ── */
// payment_mode: "once" = PIX/boleto/cartão único | "recurring" = cartão recorrente
export async function createCheckout(planType: 'S' | 'M' | 'A', paymentMode: 'once' | 'recurring' = 'once') {
  const user = await getUser();
  if (!user) throw new Error('Login necessário');

  const profile = await getProfile();
  const refCode = profile?.referred_by || localStorage.getItem('killspy_ref') || '';

  const { data, error } = await supabase.functions.invoke('stripe-checkout', {
    body: {
      plan_type: planType,
      payment_mode: paymentMode,
      user_id: user.id,
      user_email: user.email,
      referred_by: refCode,
    },
  });

  if (error) throw new Error(error.message || 'Erro ao criar checkout');
  if (data?.error) throw new Error(data.error);
  if (!data?.url) throw new Error('URL de pagamento não recebida');

  window.location.href = data.url;
}

/* ── Wake up (for Supabase, instant — no cold start) ── */
export async function wakeUp() {
  await supabase.auth.getSession();
}
