import { Layout } from './Layout';
import { site as defaultSite } from '../config/site';
import type { SiteConfig } from '../config/site';
import type { Post } from '../types/post';
import { PostCard } from './PostCard';
import { getPostBlurb } from '../utils/post';
import { formatDate } from '../utils/date';
import { getTagColorClass } from '../utils/tags';

interface BlogIndexProps {
  posts: Post[];
  site?: SiteConfig;
}

export function BlogIndex({ posts, site = defaultSite }: BlogIndexProps) {
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags ?? []))).sort((a, b) =>
    a.localeCompare(b),
  );

  return (
    <Layout title={`Blog - ${site.title}`} site={site}>
      <div className="max-w-7xl mx-auto px-4 py-8 lg:grid lg:grid-cols-[minmax(0,56rem)_14rem] lg:items-start lg:gap-8">
        <div className="lg:col-start-1">
          <h1 className="text-4xl font-bold mb-8 text-ctp-mauve">Blog Posts</h1>
          <input
            id="blog-search-input"
            type="text"
            placeholder="Search posts..."
            autoFocus
            className="w-full px-4 py-2 mb-6 lg:mb-8 rounded-lg bg-ctp-surface0 border border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:outline-none focus:border-ctp-mauve transition-colors"
          />
        </div>
        {allTags.length > 0 && (
          <aside
            className="mb-8 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-8 lg:mb-0"
            aria-labelledby="blog-tag-filters-heading"
            data-blog-tag-filters
          >
            <div className="flex items-center justify-between gap-4 mb-3 lg:block">
              <h2 id="blog-tag-filters-heading" className="text-sm font-semibold text-ctp-subtext0">
                Visible tags
              </h2>
              <div className="flex gap-3 lg:mt-2">
                <button
                  type="button"
                  className="text-sm text-ctp-mauve hover:underline"
                  data-blog-tag-reset
                >
                  Show all
                </button>
                <button
                  type="button"
                  className="text-sm text-ctp-mauve hover:underline"
                  data-blog-tag-hide-all
                >
                  Hide all
                </button>
              </div>
            </div>
            <div className="flex h-36 flex-wrap gap-2 overflow-y-auto pr-1 lg:h-auto lg:flex-col lg:items-start lg:overflow-visible lg:pr-0">
              {allTags.map((tag) => (
                <label
                  key={tag}
                  className={`blog-tag-filter inline-flex items-center gap-2 text-sm transition-colors ${getTagColorClass(tag)}`}
                >
                  <input
                    type="checkbox"
                    value={tag}
                    defaultChecked
                    className="blog-tag-filter-input"
                    data-blog-tag-toggle
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>
          </aside>
        )}
        <main className="lg:col-start-1">
          <div className="space-y-8" data-blog-list>
            {posts.map((post) => (
              <div
                key={post.slug}
                data-search-title={post.title}
                data-search-blurb={post.description || getPostBlurb(post.htmlContent)}
                data-search-date={formatDate(post.date)}
                data-search-tags={(post.tags ?? []).join(' ')}
                data-filter-tags={(post.tags ?? []).join(' ')}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </main>
      </div>
      </Layout>
  );
}
