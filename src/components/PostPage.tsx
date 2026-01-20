import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';
import type { Post } from '../types/post';
import { getTagColorClass } from '../utils/tags';
import { formatDate } from '../utils/date';
import { UpdateDatesTooltip } from './UpdateDatesTooltip';
import { RelatedPosts } from './RelatedPosts';
import { getRelatedPosts } from '../utils/post';

interface PostPageProps {
  post: Post;
  allPosts: Post[];
}

export function PostPage({ post, allPosts }: PostPageProps) {
  const relatedPosts = getRelatedPosts(post, allPosts, 3);

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
        <RelatedPosts posts={relatedPosts} />
        <div className="mt-4">
          <a
            href={`${site.repository}/blob/master/blog/posts/${post.slug}.typ`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ctp-subtext0 hover:text-ctp-mauve transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View source code
          </a>
        </div>
      </article>
    </Layout>
  );
}
