# Cost of a Like — Demo App

A tiny one-day demo for your talk:
- Full-screen heart button with a TikTok/IG-like burst animation
- Serverless counter tracked in Upstash Redis
- `/admin.html` password-protected stats with Refresh + optional Reset

## Quick Deploy (Vercel)

1) **Create an Upstash Redis database (free)**
   - Go to https://upstash.com/ -> Redis -> Create database (choose a region near you).
   - Open the database and copy:
     - `REST URL`
     - `REST TOKEN`

2) **Import this project into Vercel**
   - Push these files to a new GitHub repo (or upload via Vercel's "Import Project" from your local folder).
   - In Vercel project settings -> **Environment Variables**, add:
     - `UPSTASH_REDIS_REST_URL` = (paste Upstash REST URL)
     - `UPSTASH_REDIS_REST_TOKEN` = (paste Upstash REST TOKEN)
     - `ADMIN_KEY` = (pick a strong password for admin)

3) **Deploy**
   - After deploy finishes, visit your domain:
     - `/` — main heart page
     - `/admin.html` — stats page (enter your `ADMIN_KEY` to refresh/reset)

> Tip: You can share the public page QR during the presentation. Keep `/admin.html` private.

## Local dev

- This is a static site, functions live under `/api`.
- Use `vercel dev` if you have the Vercel CLI installed, or just deploy directly.
