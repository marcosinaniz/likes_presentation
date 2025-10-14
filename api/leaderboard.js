export default async function handler(req, res) {
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  const r = await fetch(`${url}/zrevrange/user_likes/0/9/withscores`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const out = await r.json();

  const pairs = [];
  for (let i = 0; i < out.result.length; i += 2) {
    pairs.push({ name: out.result[i], likes: parseInt(out.result[i+1], 10) });
  }

  res.status(200).json({ leaderboard: pairs });
}