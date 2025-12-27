import { usePosts } from '../hooks/usePosts';

export function Posts() {
  const { filteredPosts } = usePosts();
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Posts</h1>
      <div className="space-y-2">
        {filteredPosts.length === 0 ? (
          <p className="text-center py-20 text-slate-500">No posts found</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg">
              <h3 className="text-xl font-bold">{post.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{post.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
