import { Layout } from './Layout';
import { site as defaultSite } from '../config/site';
import type { SiteConfig } from '../config/site';
import type { Post } from '../types/post';
import { PostCard } from './PostCard';
import { getPostBlurb } from '../utils/post';
import { formatDate } from '../utils/date';

interface BlogIndexProps {
  posts: Post[];
  site?: SiteConfig;
}

export function BlogIndex({ posts, site = defaultSite }: BlogIndexProps) {
  return (
    <Layout title={`Blog - ${site.title}`} site={site}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-ctp-mauve">Blog Posts</h1>
        <input
          id="blog-search-input"
          type="text"
          placeholder="Search posts..."
          autoFocus
          className="w-full px-4 py-2 mb-8 rounded-lg bg-ctp-surface0 border border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:outline-none focus:border-ctp-mauve transition-colors"
        />
        <div className="space-y-8" data-blog-list>
          {posts.map((post) => (
            <div
              key={post.slug}
              data-search-title={post.title}
              data-search-blurb={post.description || getPostBlurb(post.htmlContent)}
              data-search-date={formatDate(post.date)}
              data-search-tags={(post.tags ?? []).join(' ')}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
      </Layout>
  );
}