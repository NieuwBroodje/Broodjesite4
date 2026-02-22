// pages/api/tebex/basket/remove-package.js
// Removes an item from the Tebex basket using the Headless API

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { basketIdent, rowId } = req.body;
  if (!basketIdent) return res.status(400).json({ error: 'basketIdent is verplicht' });
  if (!rowId && rowId !== 0) return res.status(400).json({ error: 'rowId is verplicht' });

  const key = process.env.TEBEX_SECRET_KEY || process.env.TEBEX_API_KEY;
  if (!key) return res.status(500).json({ error: 'TEBEX_SECRET_KEY ontbreekt in environment variables' });

  try {
    // Tebex Headless API: DELETE /baskets/{ident}/packages/{rows.id}
    const url = `https://headless.tebex.io/api/baskets/${basketIdent}/packages/${rowId}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'X-Tebex-Secret': key,
        'Content-Type': 'application/json',
      },
    });

    // Tebex returns 200 with updated basket on success
    if (response.ok) {
      const text = await response.text();
      try {
        return res.status(200).json(JSON.parse(text));
      } catch {
        return res.status(200).json({ success: true });
      }
    }

    const errText = await response.text();
    let errJson;
    try { errJson = JSON.parse(errText); } catch { errJson = { error: errText }; }
    return res.status(response.status).json(errJson);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
