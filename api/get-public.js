export default async function handler(req, res) {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    const r = await fetch(`${url}/get/like_count`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    const out = await r.json();
    const value = out.result ? parseInt(out.result, 10) : 0;
    return res.status(200).json({ count: isNaN(value) ? 0 : value });
  } catch (e) {
    return res.status(200).json({ count: 0 });
  }
}
