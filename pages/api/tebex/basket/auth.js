export default async function handler(req, res) {
  const token = process.env.TEBEX_API_KEY;
  const { ident, returnUrl } = req.query;
  if (!ident || !returnUrl) return res.status(400).json({ error: 'ident and returnUrl required' });
  try {
    const r = await fetch(
      `https://headless.tebex.io/api/accounts/${token.trim()}/baskets/${ident}/auth?returnUrl=${encodeURIComponent(returnUrl)}`,
      { headers: { Accept: 'application/json' } }
    );
    const text = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: `Tebex ${r.status}`, detail: text });
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
