import { Layout } from './Layout';
import { site as defaultSite } from '../config/site';
import type { SiteConfig } from '../config/site';
import type { Post } from '../types/post';
import { getTagColorClass } from '../utils/tags';
import { SearchablePostList } from './SearchablePostList';

interface TagPageProps {
  tagName: string;
  posts: Post[];
  site?: SiteConfig;
}

export function TagPage({ tagName, posts, site = defaultSite }: TagPageProps) {
  return (
    <Layout title={`Posts tagged "${tagName}" - ${site.title}`} site={site}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-baseline gap-4 mb-8">
          <h1 className={`text-3xl font-bold ${getTagColorClass(tagName)}`}>
            #{tagName}
          </h1>
          <span className="text-ctp-subtext0">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </span>
        </div>
        <input
          id="blog-search-input"
          type="search"
          aria-label="Search posts"
          placeholder="Search posts..."
          className="w-full px-4 py-2 mb-8 rounded-lg bg-ctp-surface0 border border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:outline-none focus:border-ctp-mauve transition-colors"
        />
        <SearchablePostList posts={posts} />
      </div>
    </Layout>
  );
}
