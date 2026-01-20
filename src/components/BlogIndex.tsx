import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';
import type { Post } from '../types/post';
import { PostCard } from './PostCard';

interface BlogIndexProps {
  posts: Post[];
}

export function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <Layout title={`Blog - ${site.title}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-ctp-mauve">Blog Posts</h1>
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
      </Layout>
  );
}