export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name required' });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  const cleanName = name.trim().substring(0, 50);

  await fetch(`${url}/incr/like_count`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const r = await fetch(`${url}/zincrby/user_likes/1/${encodeURIComponent(cleanName)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const out = await r.json();

  return res.status(200).json({ count: out.result ?? 0 });
}