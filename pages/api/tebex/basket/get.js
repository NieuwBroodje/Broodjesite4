// pages/api/tebex/basket/get.js
// Fetches current basket contents from Tebex Headless API

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { ident } = req.query;
  if (!ident) return res.status(400).json({ error: 'ident is verplicht' });

  const key = process.env.TEBEX_SECRET_KEY || process.env.TEBEX_API_KEY;
  if (!key) return res.status(500).json({ error: 'TEBEX_SECRET_KEY ontbreekt in environment variables' });

  try {
    const response = await fetch(`https://headless.tebex.io/api/accounts/${key}/baskets/${ident}`, {
      headers: {
        'X-Tebex-Secret': key,
        'Content-Type': 'application/json',
      },
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text }; }

    if (response.ok) return res.status(200).json(data);
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
