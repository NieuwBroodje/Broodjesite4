// pages/api/tebex/payments.js
// Fetches payment history from Tebex to power the leaderboard
// Tries both TEBEX_SECRET_KEY and TEBEX_API_KEY env variable names

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.TEBEX_SECRET_KEY || process.env.TEBEX_API_KEY;

  if (!key) {
    return res.status(500).json({
      error: 'API key ontbreekt. Voeg TEBEX_SECRET_KEY toe aan je Vercel environment variables.',
    });
  }

  try {
    // Tebex Headless API: GET /payments returns paginated list
    // We fetch multiple pages to get enough data for the leaderboard
    const allPayments = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && page <= 5) {
      const response = await fetch(
        `https://plugin.tebex.io/payments?paged=${page}`,
        {
          headers: {
            'X-Tebex-Secret': key,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errBody = await response.text();
        return res.status(response.status).json({
          error: `Tebex ${response.status}: ${errBody.slice(0, 200)}`,
        });
      }

      const data = await response.json();
      const pageData = Array.isArray(data) ? data : (data.data || data.payments || []);

      if (pageData.length === 0) {
        hasMore = false;
      } else {
        allPayments.push(...pageData);
        page++;
        // If fewer than 100 results, no more pages
        if (pageData.length < 100) hasMore = false;
      }
    }

    return res.status(200).json(allPayments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
