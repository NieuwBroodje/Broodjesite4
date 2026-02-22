// pages/api/tebex/basket/add-package.js
// POST https://headless.tebex.io/api/accounts/{token}/baskets/{ident}/packages
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { basketIdent, packageId, quantity = 1 } = req.body;
  if (!basketIdent) return res.status(400).json({ error: 'basketIdent is verplicht' });
  if (!packageId) return res.status(400).json({ error: 'packageId is verplicht' });

  const key = process.env.TEBEX_SECRET_KEY || process.env.TEBEX_API_KEY;
  if (!key) return res.status(500).json({ error: 'TEBEX_SECRET_KEY ontbreekt' });

  try {
    const response = await fetch(`https://headless.tebex.io/api/accounts/${key}/baskets/${basketIdent}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ package_id: packageId, quantity }),
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
