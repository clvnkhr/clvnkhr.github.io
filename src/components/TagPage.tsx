import { Layout } from './Layout';
import { site as defaultSite } from '../config/site';
import type { SiteConfig } from '../config/site';
import type { Post } from '../types/post';
import { getTagColorClass } from '../utils/tags';
import { formatDate } from '../utils/date';
import { getPostBlurb } from '../utils/post';
import { UpdateDatesTooltip } from './UpdateDatesTooltip';

interface TagPageProps {
  tagName: string;
  posts: Post[];
  site?: SiteConfig;
}

export function TagPage({ tagName, posts, site = defaultSite }: TagPageProps) {

  return (
    <Layout title={`Posts tagged "${tagName}" - ${site.title}`} site={site}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <span className={`px-4 py-2 text-lg ${getTagColorClass(tagName)}`}>
            #{tagName}
          </span>
          <span className="ml-4 text-ctp-subtext0">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </span>
        </div>
        <input
          id="blog-search-input"
          type="text"
          placeholder="Search posts..."
          className="w-full px-4 py-2 mb-8 rounded-lg bg-ctp-surface0 border border-ctp-surface1 text-ctp-text placeholder-ctp-subtext0 focus:outline-none focus:border-ctp-mauve transition-colors"
        />
        <div className="space-y-8" data-blog-list>
          {posts.map((post) => (
            <div
              key={post.slug}
              data-search-title={post.title}
              data-search-blurb={post.description || getPostBlurb(post.htmlContent)}
              data-search-tags={(post.tags ?? []).join(' ')}
            >
              <article className="border border-ctp-surface1 rounded-lg p-6 hover:border-ctp-mauve transition-colors">
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
            </div>
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
