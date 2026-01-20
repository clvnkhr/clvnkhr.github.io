import React from 'react';
import type { Post } from '../types/post';
import { formatDate } from '../utils/date';

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 pt-6 border-t border-ctp-surface1">
      <h2 className="text-xl font-semibold mb-4">
        Related Posts
      </h2>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <a
              href={post.path}
              className="flex items-baseline gap-3 group hover:opacity-80 transition-opacity"
            >
              <time className="text-sm text-ctp-subtext0 shrink-0">
                {formatDate(post.date)}
              </time>
              <span className="text-lg font-medium group-hover:text-ctp-mauve transition-colors">
                {post.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
