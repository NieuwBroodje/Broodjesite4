// pages/api/tebex/basket/remove-package.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { basketIdent, rowId } = req.body;
  if (!basketIdent) return res.status(400).json({ error: 'basketIdent is verplicht' });
  if (rowId === undefined || rowId === null) return res.status(400).json({ error: 'rowId is verplicht' });

  const key = process.env.TEBEX_SECRET_KEY || process.env.TEBEX_API_KEY;
  if (!key) return res.status(500).json({ error: 'TEBEX_SECRET_KEY ontbreekt' });

  try {
    const response = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages/${rowId}`, {
      method: 'DELETE',
      headers: {
        'X-Tebex-Secret': key,
        'Accept': 'application/json',
      },
    });

    if (response.status === 204 || response.status === 200) {
      // Success — refresh basket to get updated state
      const basketRes = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}`, {
        headers: { 'X-Tebex-Secret': key, 'Accept': 'application/json' },
      });
      const basketText = await basketRes.text();
      try { return res.status(200).json(JSON.parse(basketText)); }
      catch { return res.status(200).json({ success: true }); }
    }

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text }; }
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
