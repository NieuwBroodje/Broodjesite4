export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { basketIdent, packageId, quantity = 1 } = req.body;
  if (!basketIdent || !packageId) return res.status(400).json({ error: 'basketIdent and packageId required' });
  try {
    const r = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ package_id: packageId, quantity }),
    });
    const text = await r.text();
    if (!r.ok) return res.status(r.status).json({ error: `Tebex ${r.status}`, detail: text });
    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
