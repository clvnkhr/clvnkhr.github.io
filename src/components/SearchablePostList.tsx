import type { Post } from '../types/post';
import { formatDate } from '../utils/date';
import { getPostBlurb } from '../utils/post';
import { PostCard } from './PostCard';

interface SearchablePostListProps {
  posts: Post[];
}

export function SearchablePostList({ posts }: SearchablePostListProps) {
  return (
    <>
      <p role="status" className="sr-only" data-blog-search-status>
        {posts.length} post{posts.length !== 1 ? 's' : ''} shown
      </p>
      <div className="space-y-8 stagger-list" data-blog-list>
        {posts.map((post) => (
          <div
            key={post.path}
            data-search-title={post.title}
            data-search-blurb={post.description || getPostBlurb(post.htmlContent).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
            data-search-date={formatDate(post.date)}
            data-search-tags={(post.tags ?? []).join(' ')}
            data-filter-tags={JSON.stringify(post.tags ?? [])}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
      <p hidden={posts.length > 0} className="text-ctp-subtext0 text-center py-12" data-blog-search-empty>
        No posts match your search or tag filters.
      </p>
    </>
  );
}
