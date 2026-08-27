# Admin Panel Guide

## Setup

1. Copy `.env.example` → `.env.local` and set your own values:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
ADMIN_SECRET=at-least-16-random-characters
```

2. Run the site:

```bash
npm install
npm run dev
```

3. Open **only** this URL (not linked anywhere on the public site):

```
http://localhost:3000/admin/login
```

Public visitors never see login / signup. Navbar has no admin link. Robots.txt blocks `/admin`.

## Features

| Feature | Description |
|---------|-------------|
| Projects CRUD | Add, edit, delete projects |
| Skills CRUD | Add, edit, delete skills |
| Image upload | Upload poster images (JPEG/PNG/WebP/GIF/SVG, max 5MB) → saved in `/public/uploads` |
| Featured flag | Mark projects as featured |
| Session | HTTP-only signed cookie, 7 days |

## Important notes

### Local / VPS / Docker
File-based store (`data/store.json`) + uploads work perfectly. Changes persist on disk.

### Vercel / serverless
The filesystem is **ephemeral**. Writes to `data/store.json` and `public/uploads` will **not** persist after redeploy / cold start.

For production on Vercel you should:
1. Move store to **MongoDB Atlas** (or similar), or
2. Host on a VPS / Railway / Render with persistent disk, or
3. Use Cloudinary / Vercel Blob for images and a real DB for content.

### Default local credentials (change them!)
- Username: `admin`
- Password: `areebadmin123`

## Security tips
- Use a long random `ADMIN_SECRET`
- Never commit `.env.local`
- Change password after first login
- Optionally put admin behind extra protection (IP allowlist, Cloudflare Access)
