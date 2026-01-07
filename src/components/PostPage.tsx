import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';
import type { Post } from '../types/post';
import { getTagColorClass } from '../utils/tags';
import { formatDate } from '../utils/date';
import { UpdateDatesTooltip } from './UpdateDatesTooltip';

interface PostPageProps {
  post: Post;
}

export function PostPage({ post }: PostPageProps) {

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
            <UpdateDatesTooltip
              updated={post.updated}
              date={post.date}
              formatDate={formatDate}
            />
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
