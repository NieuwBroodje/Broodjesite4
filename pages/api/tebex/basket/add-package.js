// pages/api/tebex/basket/add-package.js
// Adds a package to the Tebex basket using the Headless API

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { basketIdent, packageId, quantity = 1 } = req.body;
  if (!basketIdent) return res.status(400).json({ error: 'basketIdent is verplicht' });
  if (!packageId) return res.status(400).json({ error: 'packageId is verplicht' });

  const key = process.env.TEBEX_SECRET_KEY || process.env.TEBEX_API_KEY;
  if (!key) return res.status(500).json({ error: 'TEBEX_SECRET_KEY ontbreekt in environment variables' });

  try {
    const url = `https://headless.tebex.io/api/baskets/${basketIdent}/packages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Tebex-Secret': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_id: packageId,
        quantity: quantity,
      }),
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
