// pages/api/tebex/basket/remove-package.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { basketIdent, rowId } = req.body;
  if (!basketIdent) return res.status(400).json({ error: 'basketIdent is verplicht' });
  if (rowId === undefined || rowId === null) return res.status(400).json({ error: 'rowId is verplicht' });
  const token = process.env.TEBEX_API_KEY;
  try {
    // Headless API: POST /baskets/{ident}/packages/remove
    const response = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ package_id: rowId }),
    });
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
    if (!response.ok) return res.status(response.status).json(data);
    // Haal bijgewerkte basket op
    const basketRes = await fetch(`https://headless.tebex.io/api/accounts/${token}/baskets/${basketIdent}`, {
      headers: { 'Accept': 'application/json' },
    });
    const basketText = await basketRes.text();
    try { return res.status(200).json(JSON.parse(basketText)); }
    catch { return res.status(200).json({ success: true }); }
  } catch (err) { return res.status(500).json({ error: err.message }); }
}
