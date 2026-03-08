import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts, getPostUrl } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getAllPosts();

  return rss({
    title: 'Get AI Native Blog',
    description: 'A developer-focused blog about automation, tooling, and software engineering.',
    site: context.site ?? 'https://blog.getainative.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostUrl(post),
    })),
    customData: `<language>en-us</language>`,
  });
}
