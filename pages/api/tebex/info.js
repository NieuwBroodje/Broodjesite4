export default async function handler(req, res) {
  const token = process.env.TEBEX_API_KEY;
  if (!token) return res.status(500).json({ error: 'TEBEX_API_KEY niet ingesteld' });

  try {
    const r = await fetch(`https://headless.tebex.io/api/accounts/${token.trim()}`, {
      headers: { 'Accept': 'application/json' },
    });
    const text = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: `Tebex gaf ${r.status}`, detail: text });
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
