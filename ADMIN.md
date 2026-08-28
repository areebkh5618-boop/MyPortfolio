# Admin Panel Guide

## Setup

1. Copy `.env.example` → `.env.local` and fill values (see below).
2. `npm install && npm run dev`
3. Open **http://localhost:3000/admin/login** (not linked on the public site)

Public visitors never see login/signup. Robots.txt blocks `/admin`.

---

## Recommended production stack

| What | Where |
|------|--------|
| Projects + Skills data | **MongoDB Atlas** (free) |
| Project poster images | **Cloudinary** (free CDN) |
| Admin login | Env vars `ADMIN_*` |

Without `MONGODB_URI`, the app falls back to `data/store.json` (fine for local only).

---

## 1) MongoDB Atlas (data)

1. Go to https://cloud.mongodb.com → sign up (free **M0** cluster)
2. Create database user (username + password)
3. Network Access → **Allow Access from Anywhere** (`0.0.0.0/0`) — needed for Vercel
4. Connect → Drivers → copy connection string

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

Password mein special characters hon to URL-encode karo (e.g. `@` → `%40`).

**First API call** pe seed data (current projects/skills) automatically MongoDB mein insert ho jayegi.

### Vercel
Project → Settings → Environment Variables → `MONGODB_URI` add → **Redeploy**.

---

## 2) Cloudinary (images)

1. https://cloudinary.com → free account
2. Dashboard → API Keys copy:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Vercel pe bhi yeh 3 variables add karke redeploy.

Local pe Cloudinary ke baghair bhi `public/uploads/` mein save hota hai.

---

## 3) Admin credentials

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password
ADMIN_SECRET=at-least-16-random-characters
```

---

## Features

| Feature | Description |
|---------|-------------|
| Projects CRUD | Add / edit / delete — saved in MongoDB |
| Skills CRUD | Add / edit / delete — saved in MongoDB |
| Image upload | Cloudinary URL stored in DB |
| Featured flag | Per project |
| Session | HTTP-only signed cookie, 7 days |

---

## Local without MongoDB

Agar `MONGODB_URI` set na ho to:
- Data → `data/store.json`
- Images → `public/uploads/`

Yeh local development ke liye theek hai; **Vercel pe persist nahi hoga**.

---

## Security tips

- Never commit `.env.local`
- Strong `ADMIN_PASSWORD` + long `ADMIN_SECRET`
- MongoDB user ko sirf zaroori permissions do
- Optionally restrict `/admin` via Cloudflare Access / IP allowlist
