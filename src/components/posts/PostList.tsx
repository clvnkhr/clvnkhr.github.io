import type { Post } from '../../types/post';
import { PostItem } from './PostItem';

export function PostList({ posts, title }: { 
  posts: Post[]; 
  title?: string;
}) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-slate-500">No posts found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {title && (
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
      )}
      
      <div>
        {posts.map((post: Post, index: number) => (
          <PostItem key={post.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
}
