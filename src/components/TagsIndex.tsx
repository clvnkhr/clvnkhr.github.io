import { Layout } from './Layout';
import { site as defaultSite } from '../config/site';
import type { SiteConfig } from '../config/site';
import { getTagColorClass, getTagHref } from '../utils/tags';

interface TagsIndexProps {
  allTags: string[];
  tagPosts: Record<string, number>;
  site?: SiteConfig;
}

export function TagsIndex({ allTags, tagPosts, site = defaultSite }: TagsIndexProps) {
  return (
    <Layout title={`Tags - ${site.title}`} site={site}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-ctp-mauve">All Tags</h1>
        <p className="text-ctp-subtext0 mb-4">
          See the{' '}
          <a href="/blog/2026/02/11/tags/" className="text-ctp-mauve hover:underline">
            Blog Tags
          </a>{' '}
          post for elaboration on each tag.
        </p>
        <input
          id="tag-search-input"
          type="search"
          aria-label="Search tags"
          placeholder="Search tags..."
          className="w-full px-4 py-2 mb-6 rounded-lg bg-ctp-surface0 border border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:outline-none focus:border-ctp-mauve transition-colors"
        />
        <p role="status" className="sr-only" data-tag-search-status>
          {allTags.length} tag{allTags.length !== 1 ? 's' : ''} shown
        </p>
        <div className="stagger-list grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTags.map(tag => (
            <a
              key={tag}
              href={getTagHref(tag)}
              data-tag-name={tag}
              className="surface-card block p-4 rounded-lg border border-ctp-surface1 bg-ctp-mantle"
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
        <p hidden={allTags.length > 0} className="text-ctp-subtext0 text-center py-12" data-tag-search-empty>
          No tags match your search.
        </p>
        <div className="mt-8">
          <a href="/blog/" className="text-ctp-mauve hover:underline">
            ← Back to Blog
          </a>
        </div>
      </div>
    </Layout>
  );
}
