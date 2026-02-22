// pages/api/tebex/basket/auth.js
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { ident, returnUrl } = req.query;
  if (!ident) return res.status(400).json({ error: 'ident is verplicht' });

  const key = process.env.TEBEX_SECRET_KEY || process.env.TEBEX_API_KEY;
  if (!key) return res.status(500).json({ error: 'TEBEX_SECRET_KEY ontbreekt' });

  try {
    const url = new URL(`https://headless.tebex.io/api/baskets/${ident}/auth`);
    if (returnUrl) url.searchParams.set('returnUrl', returnUrl);

    const response = await fetch(url.toString(), {
      headers: {
        'X-Tebex-Secret': key,
        'Accept': 'application/json',
      },
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text }; }

    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
