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

  // increment total
  await fetch(`${url}/incr/like_count`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  // increment per user
  const userInc = await fetch(`${url}/zincrby/user_likes/1/${encodeURIComponent(cleanName)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const userOut = await userInc.json();

  // round down to nearest 10 seconds (UTC)
  const now = new Date();
  const rounded = new Date(Math.floor(now.getTime() / 10000) * 10000);
  const y = rounded.getUTCFullYear();
  const m = String(rounded.getUTCMonth() + 1).padStart(2, '0');
  const d = String(rounded.getUTCDate()).padStart(2, '0');
  const hh = String(rounded.getUTCHours()).padStart(2, '0');
  const mm = String(rounded.getUTCMinutes()).padStart(2, '0');
  const ss = String(rounded.getUTCSeconds()).padStart(2, '0');
  const bucket = `${y}${m}${d}${hh}${mm}${ss}`;

  await fetch(`${url}/hincrby/likes_timeseries/${bucket}/1`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.status(200).json({ count: userOut.result ?? 0 });
}