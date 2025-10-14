export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  const r = await fetch(`${url}/zscore/user_likes/${encodeURIComponent(name)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const out = await r.json();
  const value = out.result ? parseInt(out.result, 10) : 0;
  res.status(200).json({ count: isNaN(value) ? 0 : value });
}