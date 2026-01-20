export function getPostBlurb(htmlContent: string, wordCount: number = 25): string {
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const words = plainText.split(' ').slice(0, wordCount);
  const blurb = words.join(' ');

  return plainText.split(' ').length > wordCount ? `${blurb}...` : blurb;
}

export function extractTitleFromTypst(content: string): string | null {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    const headingMatch = trimmed.match(/^=\s+(.+)$/);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  }
  return null;
}

export function extractTitleFromHtml(htmlContent: string): string | null {
  const headingRegex = /<h1[^>]*>(.*?)<\/h1>/i;
  const match = htmlContent.match(headingRegex);
  return match ? match[1].replace(/<[^>]*>/g, '').trim() : null;
}

export function stripFirstHeading(htmlContent: string): string {
  const headingRegex = /<h1[^>]*>.*?<\/h1>/i;
  return htmlContent.replace(headingRegex, '');
}

import type { Post } from '../types/post';

export interface RelatedPostScore {
  post: Post;
  score: number;
}

export function getRelatedPosts(
  currentPost: Post,
  allPosts: Post[],
  maxResults: number = 3
): Post[] {
  if (!currentPost.tags || currentPost.tags.length === 0) {
    return [];
  }

  const relatedPosts: RelatedPostScore[] = [];

  for (const post of allPosts) {
    if (post.slug === currentPost.slug) {
      continue;
    }

    if (!post.tags || post.tags.length === 0) {
      continue;
    }

    const sharedTags = currentPost.tags.filter(tag => post.tags?.includes(tag));
    const score = sharedTags.length;

    if (score > 0) {
      relatedPosts.push({ post, score });
    }
  }

  relatedPosts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.post.date.getTime() - a.post.date.getTime();
  });

  return relatedPosts.slice(0, maxResults).map(item => item.post);
}
