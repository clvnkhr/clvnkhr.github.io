import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';
import type { Post } from '../types/post';
import { getTagColorClass } from '../utils/tags';

interface PostPageProps {
  post: Post;
}

export function PostPage({ post }: PostPageProps) {

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout title={`${post.title} - ${site.title}`}>
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8 border-b border-ctp-surface1">
          <h1 className="text-4xl font-bold mb-4 text-ctp-mauve">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-ctp-subtext0">
            <time className="text-sm">
              {formatDate(post.date)}
            </time>
            {post.updated && post.updated !== post.date && (
              <span className="text-sm">
                • Updated {formatDate(post.updated)}
              </span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
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
        </header>
        <div
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />
      </article>
    </Layout>
  );
}
