// pages/api/tebex/basket/get.js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { ident } = req.query;
  if (!ident) return res.status(400).json({ error: 'ident is verplicht' });
  const token = process.env.TEBEX_API_KEY;
  if (!token) return res.status(500).json({ error: 'TEBEX_PUBLIC ontbreekt' });
  try {
    const response = await fetch(`https://headless.tebex.io/api/accounts/${token}/baskets/${ident}`, {
      headers: { 'Accept': 'application/json' },
    });
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
    return res.status(response.status).json(data);
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
