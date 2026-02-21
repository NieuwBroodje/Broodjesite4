export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const token = process.env.TEBEX_API_KEY;
  if (!token) return res.status(500).json({ error: 'TEBEX_API_KEY not set' });
  const { username } = req.body || {};
  try {
    const host = req.headers.host;
    const proto = host?.includes('localhost') ? 'http' : 'https';
    const origin = `${proto}://${host}`;
    const body = {
      complete_url: `${origin}/store?status=complete`,
      cancel_url: `${origin}/store?status=cancelled`,
      complete_auto_redirect: true,
    };
    if (username) body.username = username;
    const r = await fetch(`https://headless.tebex.io/api/accounts/${token.trim()}/baskets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: `Tebex ${r.status}`, detail: text });
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
