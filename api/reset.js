// /api/reset.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

    // 1) Reset total counter
    await fetch(`${url}/set/like_count/0`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2) Clear leaderboard (sorted set)
    await fetch(`${url}/del/user_likes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // 3) Clear timeseries (hash)
    await fetch(`${url}/del/likes_timeseries`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.status(200).json({ ok: true, count: 0 });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
