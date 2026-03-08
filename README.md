# Get AI Native

A landing site and blog built with Astro, hosted on Cloudflare Pages.

**Primary site:** https://getainative.com

## Homepage Source Of Truth

- The homepage at `/` must stay aligned with [`landing/index.html`](./landing/index.html).
- Do not reimplement the homepage in Astro components or restyle it "close enough" unless explicitly asked.
- [`src/pages/index.astro`](./src/pages/index.astro) is intentionally a passthrough that serves the exact landing HTML.
- If you need to change the homepage, edit [`landing/index.html`](./landing/index.html).
- The blog listing lives at `/blog`, not `/`.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:4321

## Deployment

This repo should deploy as a single Cloudflare Pages project that serves:

- `/` as the landing page
- `/blog` as the blog index
- blog posts from the same site build

**Auto-deploy:** Push to `main` if Git integration is configured for the project.

```bash
git add .
git commit -m "Your message"
git push
```

**Manual deploy (if needed):**

```bash
npm run build
npx wrangler pages deploy dist --project-name=getainative-landing
```

Use the same build for landing, blog listing, and posts.
Until Cloudflare is renamed or cleaned up, `getainative-landing` is the one project to deploy for `getainative.com`.
Do not deploy this repo to a separate blog Pages project.

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
