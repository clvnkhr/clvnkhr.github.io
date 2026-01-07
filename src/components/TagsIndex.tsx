import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';
import { getTagColorClass } from '../utils/tags';

interface TagsIndexProps {
  allTags: string[];
  tagPosts: Record<string, number>;
}

export function TagsIndex({ allTags, tagPosts }: TagsIndexProps) {
  return (
    <Layout title={`Tags - ${site.title}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-ctp-mauve">All Tags</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTags.map(tag => (
            <a
              key={tag}
              href={`/tags/${tag}/`}
              className="block p-4 rounded-lg bg-ctp-surface0 hover:bg-ctp-surface1 transition-colors"
            >
              <div className={`text-xl font-semibold ${getTagColorClass(tag)}`}>
                #{tag}
              </div>
              <div className="text-sm text-ctp-subtext0 mt-1">
                {tagPosts[tag] || 0} post{tagPosts[tag] !== 1 ? 's' : ''}
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8">
          <a href="/blog/" className="text-ctp-mauve hover:underline">
            ← Back to Blog
          </a>
        </div>
      </div>
    </Layout>
  );
}
