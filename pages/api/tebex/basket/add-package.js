// pages/api/tebex/basket/add-package.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { basketIdent, packageId, quantity = 1 } = req.body;
  if (!basketIdent) return res.status(400).json({ error: 'basketIdent is verplicht' });
  if (!packageId) return res.status(400).json({ error: 'packageId is verplicht' });
  try {
    const response = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ package_id: packageId, quantity }),
    });
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
    return res.status(response.status).json(data);
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
