export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'Redis not configured' });

  const bucketSize = 10 * 1000; // 10 seconds
  const totalDuration = 5 * 60 * 1000; // 5 minutes
  const bucketCount = totalDuration / bucketSize;

  const r = await fetch(`${url}/hgetall/likes_timeseries`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  });
  const out = await r.json();
  const entries = out.result || [];

  const map = new Map();
  for (let i = 0; i < entries.length; i += 2) {
    const k = entries[i];
    const v = parseInt(entries[i+1], 10) || 0;
    map.set(k, v);
  }

  const now = Date.now();
  const points = [];
  for (let i = bucketCount - 1; i >= 0; i--) {
    const t = new Date(Math.floor((now - i * bucketSize) / bucketSize) * bucketSize);
    const y = t.getUTCFullYear();
    const m = String(t.getUTCMonth() + 1).padStart(2, '0');
    const d = String(t.getUTCDate()).padStart(2, '0');
    const hh = String(t.getUTCHours()).padStart(2, '0');
    const mm = String(t.getUTCMinutes()).padStart(2, '0');
    const ss = String(t.getUTCSeconds()).padStart(2, '0');
    const key = `${y}${m}${d}${hh}${mm}${ss}`;
    const count = map.get(key) || 0;
    points.push({ t: t.toISOString(), count });
  }

  res.status(200).json({ points });
}