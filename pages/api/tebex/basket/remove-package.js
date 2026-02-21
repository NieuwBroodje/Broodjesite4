export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { basketIdent, rowId } = req.body;
  if (!basketIdent || !rowId) return res.status(400).json({ error: 'basketIdent and rowId required' });
  try {
    const r = await fetch(`https://checkout.tebex.io/api/baskets/${basketIdent}/packages/${rowId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    });
    if (r.status === 204 || r.ok) return res.status(200).json({ success: true });
    const text = await r.text();
    return res.status(r.status).json({ error: `Tebex ${r.status}`, detail: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
