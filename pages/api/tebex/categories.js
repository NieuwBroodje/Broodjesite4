// Tebex Headless API — gebruik je PUBLIC TOKEN als TEBEX_API_KEY
export default async function handler(req, res) {
  const token = process.env.TEBEX_API_KEY;

  if (!token) {
    return res.status(500).json({ error: 'TEBEX_API_KEY niet ingesteld in Vercel environment variables' });
  }

  try {
    const url = `https://headless.tebex.io/api/accounts/${token.trim()}/categories?includePackages=1`;
    const r = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    const text = await r.text();

    if (!r.ok) {
      return res.status(r.status).json({
        error: `Tebex API gaf ${r.status} terug`,
        detail: text,
        urlUsed: url,
      });
    }

    const data = JSON.parse(text);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
