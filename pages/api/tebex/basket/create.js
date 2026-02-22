// pages/api/tebex/basket/create.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const privateKey = process.env.TEBEX_PRIVATE_KEY;
  if (!privateKey) return res.status(500).json({ error: 'TEBEX_PRIVATE_KEY ontbreekt in Vercel environment variables' });

  try {
    const host = req.headers.origin || `https://${req.headers.host}`;

    const response = await fetch('https://headless.tebex.io/api/baskets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Tebex-Secret': privateKey,
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
      console.error(`Tebex basket create mislukt [${response.status}]:`, text);
      return res.status(response.status).json({ error: data?.message || data?.error || text });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
