import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';
import type { Post } from '../types/post';
import { getTagColorClass } from '../utils/tags';
import { formatDate } from '../utils/date';
import { getPostBlurb } from '../utils/post';
import { UpdateDatesTooltip } from './UpdateDatesTooltip';

interface TagPageProps {
  tagName: string;
  posts: Post[];
}

export function TagPage({ tagName, posts }: TagPageProps) {

  return (
    <Layout title={`Posts tagged "${tagName}" - ${site.title}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <span className={`px-4 py-2 text-lg ${getTagColorClass(tagName)}`}>
            #{tagName}
          </span>
          <span className="ml-4 text-ctp-subtext0">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border border-ctp-surface1 rounded-lg p-6 hover:border-ctp-mauve transition-colors">
              <div className="flex items-center gap-4 mb-3">
                <time className="text-ctp-subtext0 text-sm">
                  {formatDate(post.date)}
                </time>
                <UpdateDatesTooltip
                  updated={post.updated}
                  date={post.date}
                  formatDate={formatDate}
                />
              </div>
              <h2 className="text-2xl font-bold mb-3">
                <a href={post.path} className="text-ctp-text hover:text-ctp-mauve transition-colors">
                  {post.title}
                </a>
              </h2>
              {(post.description || post.htmlContent) && (
                <p className="text-ctp-subtext0 mb-4">
                  {post.description || getPostBlurb(post.htmlContent)}
                </p>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <a key={tag} href={`/tags/${tag}`} className={`px-3 py-1 text-sm transition-colors ${getTagColorClass(tag)}`}>
                      {tag}
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
          {posts.length === 0 && (
            <div className="text-ctp-subtext0 text-center py-12">
              <p>No posts found with tag "{tagName}"</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
