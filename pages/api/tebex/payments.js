export default async function handler(req, res) {
  const secretKey = process.env.TEBEX_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'TEBEX_SECRET_KEY not set. Add your Private Key as TEBEX_SECRET_KEY in Vercel environment variables.' });
  try {
    const r = await fetch('https://plugin.tebex.io/payments', {
      headers: { 'X-Tebex-Secret': secretKey.trim(), Accept: 'application/json' },
    });
    const text = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: `Tebex ${r.status}`, detail: text });
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
