export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const key = req.headers['x-admin-key'];
  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    // Set to 0
    const r = await fetch(`${url}/set/like_count/0`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const out = await r.json();
    return res.status(200).json({ count: 0, ok: true });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
