import { getCollection, type CollectionEntry } from 'astro:content';

export async function getAllPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', ({ data }) => {
    // Filter out drafts in production
    return import.meta.env.PROD ? !data.draft : true;
  });

  // Sort by date, newest first
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getSeriesPosts(series: string): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getAllPosts();

  return posts
    .filter((post) => post.data.series === series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

export async function getAllSeries(): Promise<string[]> {
  const posts = await getAllPosts();

  const seriesSet = new Set<string>();
  posts.forEach((post) => {
    if (post.data.series) {
      seriesSet.add(post.data.series);
    }
  });

  return Array.from(seriesSet);
}

export function getPostUrl(post: CollectionEntry<'posts'>): string {
  const { series } = post.data;
  const slug = post.slug.includes('/') ? post.slug.split('/').pop() : post.slug;

  if (series) {
    return `/${series}/${slug}`;
  }

  return `/${slug}`;
}
