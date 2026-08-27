# Muhammad Areeb Khan — Portfolio

Premium dark-themed portfolio website built with Next.js, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **Lucide React Icons**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.tsx       # Root layout + SEO metadata
  page.tsx         # Home page composing all sections
  globals.css      # Theme, glassmorphism, animations
  robots.ts
  sitemap.ts
components/
  Navbar.tsx
  Hero.tsx
  About.tsx
  Skills.tsx
  Projects.tsx
  Education.tsx
  Contact.tsx
  Footer.tsx
data/
  skills.ts
  projects.ts
public/
  images/
    profile.svg
```

## Features

- Dark professional glassmorphism theme
- Sticky blurred navbar with active link highlight
- Typing animation hero
- Floating profile image with glow
- Animated skill cards
- Premium project cards
- Contact form
- Fully responsive
- SEO metadata, Open Graph, robots, sitemap
- **Hidden Admin Panel** — manage projects & skills without public login/signup

## Admin Panel

Public site has **no** login or signup. Only you access admin:

1. Copy `.env.example` → `.env.local` and set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SECRET`
2. `npm run dev`
3. Open **http://localhost:3000/admin/login** (not linked in navbar)

From the dashboard you can:
- Add / edit / delete **projects**
- Upload project **poster images**
- Add / edit / delete **skills**
- Toggle **featured** projects

See `ADMIN.md` for full details and production notes (Vercel vs VPS).

## Customization

Replace `/public/images/profile.svg` with your photo (`profile.png`) and update the path in `components/Hero.tsx`.
