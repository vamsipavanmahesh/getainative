# Get AI Native Blog

A developer blog built with Astro, hosted on Cloudflare Pages.

**Live site:** https://blog.getainative.com

## Development

```bash
npm install
npm run dev
```

Open http://localhost:4321

## Deployment

**Auto-deploy:** Push to `main` branch - Cloudflare Pages deploys automatically.

```bash
git add .
git commit -m "Your message"
git push
```

**Manual deploy (if needed):**

```bash
npm run build
npx wrangler pages deploy dist --project-name=getainative-blog
```

## Adding Blog Posts

Create a new `.mdx` file in `src/content/posts/`:

```mdx
---
title: "Your Post Title"
description: "A short description"
pubDate: 2026-02-01
tags: ["tag1", "tag2"]
image: "/your-og-image.png"  # optional
---

Your content here...
```

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Giscus](https://giscus.app) - Comments (GitHub Discussions)
- [Cloudflare Pages](https://pages.cloudflare.com) - Hosting
