import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';
import type { Post } from '../types/post';
import { getTagColorClass } from '../utils/tags';

interface BlogIndexProps {
  posts: Post[];
}

export function BlogIndex({ posts }: BlogIndexProps) {

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout title={`Blog - ${site.title}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-ctp-mauve">Blog Posts</h1>
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-ctp-surface1 rounded-lg p-6 hover:border-ctp-mauve transition-colors"
            >
              <div className="flex items-center gap-4 mb-3">
                <time className="text-ctp-subtext0 text-sm">
                  {formatDate(post.date)}
                </time>
                {post.updated && post.updated !== post.date && (
                  <span className="text-ctp-subtext0 text-sm">
                    • Updated {formatDate(post.updated)}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-3">
                <a href={post.path} className="text-ctp-text hover:text-ctp-mauve transition-colors">
                  {post.title}
                </a>
              </h2>
              {post.description && (
                <p className="text-ctp-subtext0 mb-4">
                  {post.description}
                </p>
              )}
                {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <a
                      key={tag}
                      href={`/tags/${tag}/`}
                      className={`px-3 py-1 text-sm transition-colors ${getTagColorClass(tag)}`}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
}
