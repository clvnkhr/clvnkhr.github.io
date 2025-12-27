import type { Post } from '../../types/post';
import { Link } from 'react-router-dom';

export function PostItem({ post, index }: { post: Post; index: number }) {
  return (
    <Link
      to={`/posts/${post.id}`}
      className={`
        block p-6 rounded-lg border transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        ${post.pin ? 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10' : ''}
        dark:border-slate-700 dark:hover:border-primary
        border-slate-200 hover:border-primary
      `}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.map((tag: string) => (
          <span
            key={tag}
            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
        {post.pin && (
          <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
            ⭐ Pinned
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
        {post.title}
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
        {new Date(post.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
        {post.updated && (
          <span className="ml-2">
            (Updated {new Date(post.updated).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })})
          </span>
        )}
      </p>
      
      <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
        {post.description}
      </p>
    </Link>
  );
}
