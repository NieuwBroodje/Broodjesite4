export default async function handler(req, res) {
  const token = process.env.TEBEX_API_KEY;

  const result = {
    keyPresent: !!token,
    keyLength: token?.length || 0,
    keyPreview: token ? `${token.substring(0, 6)}...${token.substring(token.length - 4)}` : null,
    tests: {},
  };

  if (token) {
    const t = token.trim();

    // Test categories
    try {
      const r = await fetch(`https://headless.tebex.io/api/accounts/${t}/categories?includePackages=1`, {
        headers: { 'Accept': 'application/json' },
      });
      const text = await r.text();
      result.tests.categories = { status: r.status, ok: r.ok, response: text.substring(0, 600) };
    } catch (e) {
      result.tests.categories = { error: e.message };
    }

    // Test packages
    try {
      const r = await fetch(`https://headless.tebex.io/api/accounts/${t}/packages`, {
        headers: { 'Accept': 'application/json' },
      });
      const text = await r.text();
      result.tests.packages = { status: r.status, ok: r.ok, response: text.substring(0, 600) };
    } catch (e) {
      result.tests.packages = { error: e.message };
    }
  }

  return res.status(200).json(result);
}
