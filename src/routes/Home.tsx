import { usePosts } from '../hooks/usePosts';

export function Home() {
  const { filteredPosts } = usePosts();
  
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
        A place to record my thoughts, journeys, experiences, and ideas
      </p>
      
      <h2 className="text-2xl font-bold mb-4">Latest Posts</h2>
      <div className="space-y-2">
        {filteredPosts.length === 0 ? (
          <p className="text-center py-20 text-slate-500">No posts yet</p>
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
