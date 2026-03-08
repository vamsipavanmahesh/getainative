# DSA Club Blog - Architecture Specification

## Project Overview

Build a developer-focused blog for `blog.dsa.club` using Astro. The design should be clean, minimal, and inspired by [flavienbonvin.com](https://flavienbonvin.com). Focus on readability, beautiful code snippets, and zero bloat.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Astro 5.x |
| Styling | Tailwind CSS 4.x |
| Content | MDX |
| Code Blocks | Expressive Code |
| Comments | Giscus (GitHub Discussions) |
| Hosting | Cloudflare Pages |
| Package Manager | bun |

## URL Structure

```
blog.dsa.club/
├── /                                    # Home - list of all posts
├── /about                               # About page
├── /{series-slug}/{post-slug}           # Individual post
│   Example: /automation-series/automating-myself-out-of-job-pr-creation-workflow
├── /series/{series-slug}                # All posts in a series
│   Example: /series/automation-series
└── /rss.xml                             # RSS feed
```

## Directory Structure

```
dsa-club-blog/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── public/
│   ├── favicon.svg
│   ├── og-default.png                   # Default Open Graph image
│   └── images/                          # Static images
├── src/
│   ├── components/
│   │   ├── BaseHead.astro               # SEO meta tags, OG tags
│   │   ├── Header.astro                 # Navigation
│   │   ├── Footer.astro
│   │   ├── PostCard.astro               # Post preview card for listings
│   │   ├── PostMeta.astro               # Date, reading time, tags
│   │   ├── TableOfContents.astro        # Optional TOC for long posts
│   │   ├── Comments.astro               # Giscus integration
│   │   ├── SeriesBanner.astro           # Shows series info on post pages
│   │   └── VideoEmbed.astro             # YouTube/video embeds
│   ├── layouts/
│   │   ├── BaseLayout.astro             # HTML shell, includes BaseHead
│   │   ├── PostLayout.astro             # Blog post layout
│   │   └── SeriesLayout.astro           # Series listing layout
│   ├── pages/
│   │   ├── index.astro                  # Homepage - all posts
│   │   ├── about.astro                  # About page
│   │   ├── series/
│   │   │   └── [series].astro           # Dynamic series listing
│   │   ├── [...slug].astro              # Dynamic post pages (catches series/post)
│   │   └── rss.xml.ts                   # RSS feed
│   ├── content/
│   │   ├── config.ts                    # Content collection schema
│   │   └── posts/
│   │       └── automation-series/
│   │           ├── _series.json         # Series metadata
│   │           └── automating-myself-out-of-job-pr-creation-workflow.mdx
│   ├── styles/
│   │   └── global.css                   # Global styles, Tailwind imports
│   └── utils/
│       ├── posts.ts                     # Helper functions for posts
│       └── reading-time.ts              # Calculate reading time
└── README.md
```

## Content Schema

### Post Frontmatter (`src/content/config.ts`)

```typescript
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    series: z.string().optional(),           // e.g., "automation-series"
    seriesOrder: z.number().optional(),      // Order within series
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),            // OG image override
    canonicalUrl: z.string().url().optional(),
  }),
});

export const collections = { posts };
```

### Series Metadata (`_series.json`)

```json
{
  "title": "Automation Series",
  "description": "Automating repetitive developer tasks to focus on what matters",
  "slug": "automation-series"
}
```

### Example Post

```mdx
---
title: "Automating Myself Out of a Job: PR Creation Workflow"
description: "How I built a CLI tool to automate PR creation, saving 15 minutes per PR"
pubDate: 2025-02-01
series: "automation-series"
seriesOrder: 1
tags: ["automation", "git", "ruby", "cli"]
---

Introduction paragraph here...

## The Problem

Code and explanation...

```ruby
# Example code block with title
def create_pr(branch_name)
  # Implementation
end
```

## The Solution

More content...
```

## Features to Implement

### 1. SEO (BaseHead.astro)

- Canonical URLs
- Open Graph tags (title, description, image, type)
- Twitter Card tags
- JSON-LD structured data for blog posts
- Sitemap generation (`@astrojs/sitemap`)
- robots.txt

### 2. Code Blocks (Expressive Code)

Install and configure `astro-expressive-code`:

```javascript
// astro.config.mjs
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  integrations: [
    expressiveCode({
      themes: ['github-dark', 'github-light'],
      styleOverrides: {
        borderRadius: '0.5rem',
      },
    }),
    // ... other integrations
  ],
});
```

Features to enable:
- Syntax highlighting (Shiki-based)
- File name tabs
- Line highlighting
- Copy button
- Terminal styling for shell commands
- Diff highlighting (+ / -)

### 3. Comments (Giscus)

Create `Comments.astro`:

```astro
<section class="mt-16">
  <script
    is:inline
    src="https://giscus.app/client.js"
    data-repo="[REPO_OWNER]/[REPO_NAME]"
    data-repo-id="[REPO_ID]"
    data-category="Comments"
    data-category-id="[CATEGORY_ID]"
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="bottom"
    data-theme="preferred_color_scheme"
    data-lang="en"
    data-loading="lazy"
    crossorigin="anonymous"
    async
  ></script>
</section>
```

Note: User will fill in the data attributes after setting up Giscus.

### 4. Images

- Use Astro's built-in image optimization (`astro:assets`)
- Support for images in MDX with captions
- Lazy loading by default
- WebP/AVIF conversion

Create an `Image` component for MDX that supports captions:

```astro
<!-- src/components/Figure.astro -->
---
import { Image } from 'astro:assets';

interface Props {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

const { src, alt, caption } = Astro.props;
---

<figure class="my-8">
  <Image src={src} alt={alt} class="rounded-lg" />
  {caption && <figcaption class="text-center text-sm text-gray-500 mt-2">{caption}</figcaption>}
</figure>
```

### 5. Video Embeds

Create `VideoEmbed.astro` for YouTube (lite-youtube for performance):

```astro
---
interface Props {
  id: string;
  title: string;
}

const { id, title } = Astro.props;
---

<lite-youtube videoid={id} playlabel={title}></lite-youtube>

<script>
  import '@justinribeiro/lite-youtube';
</script>
```

### 6. Series Support

- Show series banner on posts that belong to a series
- Link to previous/next posts in series
- Series index page listing all posts in order

### 7. Reading Time

Calculate and display reading time on each post.

## Design Guidelines

### Typography

- Clean, readable font stack (system fonts or Inter)
- Base font size: 18px for body text
- Line height: 1.7 for prose
- Max content width: 720px

### Colors

Keep it simple - inspired by Flavien's blog:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-accent: #3b82f6;
  --color-border: #e5e7eb;
}

.dark {
  --color-bg: #0f0f0f;
  --color-text: #f5f5f5;
  --color-text-muted: #a1a1a1;
  --color-accent: #60a5fa;
  --color-border: #2e2e2e;
}
```

### Layout

- Centered content, generous whitespace
- No sidebar clutter
- Mobile-first responsive design
- Dark mode support (toggle in header)

## Astro Config

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://blog.dsa.club',
  integrations: [
    expressiveCode({
      themes: ['github-dark', 'github-light'],
    }),
    mdx(),
    sitemap(),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      wrap: true,
    },
  },
});
```

## Package.json Dependencies

```json
{
  "name": "dsa-club-blog",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "@astrojs/rss": "^4.0.0",
    "astro-expressive-code": "^0.38.0",
    "tailwindcss": "^4.0.0",
    "@justinribeiro/lite-youtube": "^1.5.0"
  }
}
```

## Cloudflare Pages Deployment

1. Push to GitHub
2. Connect repo to Cloudflare Pages
3. Build settings:
   - Build command: `bun run build`
   - Build output directory: `dist`
   - Node version: 20
4. Add CNAME record in Cloudflare DNS:
   - Type: CNAME
   - Name: blog
   - Target: your-project.pages.dev

## Files to Create First

Priority order for implementation:

1. `package.json` - dependencies
2. `astro.config.mjs` - configuration
3. `tailwind.config.mjs` - Tailwind setup
4. `tsconfig.json` - TypeScript config
5. `src/content/config.ts` - content schema
6. `src/styles/global.css` - global styles
7. `src/layouts/BaseLayout.astro` - base HTML
8. `src/components/BaseHead.astro` - SEO
9. `src/components/Header.astro` - navigation
10. `src/components/Footer.astro` - footer
11. `src/pages/index.astro` - homepage
12. `src/layouts/PostLayout.astro` - post template
13. `src/pages/[...slug].astro` - dynamic post routing
14. `src/components/Comments.astro` - Giscus
15. `src/pages/rss.xml.ts` - RSS feed
16. Sample post in `src/content/posts/`

## Notes for Claude Code

- Use bun as package manager
- Keep the design minimal - avoid over-engineering
- Prioritize readability and performance
- All components should support dark mode
- Test with a sample post before adding more features
- The URL structure `/{series}/{post}` is important - don't change it
- Comments should appear at the bottom of every post
- Code blocks should look as good as VS Code
