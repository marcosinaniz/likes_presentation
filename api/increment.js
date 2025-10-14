export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      return res.status(500).json({ error: 'Redis not configured' });
    }
    const r = await fetch(`${url}/incr/like_count`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const out = await r.json();
    // Upstash returns { result: number }
    return res.status(200).json({ count: out.result ?? 0 });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
