// pages/api/tebex/basket/create.js
// {token} = publieke webstore identifier (TEBEX_PUBLIC)
// Geen Authorization header nodig voor Headless API
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.TEBEX_API_KEY;
  if (!token) return res.status(500).json({ error: 'TEBEX_PUBLIC ontbreekt in Vercel environment variables' });

  try {
    const host = req.headers.origin || `https://${req.headers.host}`;

    const response = await fetch(`https://headless.tebex.io/api/accounts/${token}/baskets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        complete_url: `${host}/store?status=complete`,
        cancel_url: `${host}/store?status=cancelled`,
        complete_auto_redirect: true,
      }),
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text }; }

    if (!response.ok) {
      console.error(`Basket create failed [${response.status}]:`, text);
      return res.status(response.status).json({ error: data?.message || data?.error || text });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
