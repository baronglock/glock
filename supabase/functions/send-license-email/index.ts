const RESEND_KEY = Deno.env.get("RESEND_API_KEY") || ""

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { to, name, key, plan, expires_at } = await req.json()

    if (!to || !key) {
      return new Response(JSON.stringify({ error: "to and key required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const planNames: Record<string, string> = { S: "Limpeza (1 dia)", M: "Premium Mensal", A: "Premium Anual" }
    const planName = planNames[plan] || plan || "KillSpy"
    const expiresFormatted = expires_at ? new Date(expires_at).toLocaleDateString("pt-BR") : "—"

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:500px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:20px;font-weight:700;color:#fff;letter-spacing:0.1em;">STAUF<span style="color:#2dd4bf;">.</span></span>
      <span style="color:#555;margin:0 8px;">›</span>
      <span style="color:#2dd4bf;font-size:14px;font-weight:600;">KillSpy</span>
    </div>

    <div style="background:#0f1018;border:1px solid rgba(45,212,191,0.1);border-radius:16px;padding:32px;margin-bottom:24px;">
      <h1 style="color:#e8e8e8;font-size:22px;font-weight:700;margin:0 0 8px;">Sua chave está pronta! 🔐</h1>
      <p style="color:#888;font-size:14px;margin:0 0 28px;">Olá${name ? " " + name : ""}, sua licença KillSpy foi ativada.</p>

      <div style="background:#0a0a0f;border:1px solid rgba(45,212,191,0.15);border-radius:10px;padding:18px;margin-bottom:20px;text-align:center;">
        <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Sua chave de licença</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:18px;color:#2dd4bf;letter-spacing:0.05em;word-break:break-all;">${key}</div>
      </div>

      <div style="display:flex;justify-content:space-between;margin-bottom:24px;font-size:13px;">
        <div><span style="color:#888;">Plano:</span> <span style="color:#e8e8e8;font-weight:600;">${planName}</span></div>
        <div><span style="color:#888;">Validade:</span> <span style="color:#22c55e;font-weight:600;">${expiresFormatted}</span></div>
      </div>

      <div style="background:rgba(45,212,191,0.06);border:1px solid rgba(45,212,191,0.1);border-radius:8px;padding:14px;margin-bottom:24px;">
        <div style="font-size:11px;color:#888;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Como ativar:</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#2dd4bf;line-height:2;">
          1. Abra o app KillSpy<br>
          2. Vá em Licença<br>
          3. Cole a chave acima<br>
          4. Proteção ativada!
        </div>
      </div>

      <a href="https://stauf.com.br/conta/dashboard" style="display:block;text-align:center;padding:14px;background:#2dd4bf;color:#0a0a0f;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">Ver no dashboard</a>
    </div>

    <p style="text-align:center;color:#555;font-size:11px;">
      Stauf. — We make stuff. | stauf.com.br
    </p>
  </div>
</body>
</html>`

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "KillSpy <onboarding@resend.dev>",
        to: [to],
        subject: `🔐 Sua chave KillSpy está pronta — ${planName}`,
        html,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    })
  }
})
