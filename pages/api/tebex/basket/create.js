// pages/api/tebex/basket/create.js
// Creates a new Tebex basket via the Headless API

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.TEBEX_SECRET_KEY || process.env.TEBEX_API_KEY;
  if (!key) return res.status(500).json({ error: 'TEBEX_SECRET_KEY ontbreekt in environment variables' });

  try {
    const { username } = req.body || {};
    const host = req.headers.origin || req.headers.host || 'http://localhost:3000';
    const baseUrl = host.startsWith('http') ? host : `https://${host}`;

    const body = {
      complete_url: `${baseUrl}/store?status=complete`,
      cancel_url: `${baseUrl}/store?status=cancelled`,
    };
    if (username) body.username = username;

    const response = await fetch(`https://headless.tebex.io/api/accounts/${key}/baskets`, {
      method: 'POST',
      headers: {
        'X-Tebex-Secret': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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
