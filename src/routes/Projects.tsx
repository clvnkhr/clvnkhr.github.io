import { usePosts } from '../hooks/usePosts';
import { PostList } from '../components/posts/PostList';

export function Projects() {
  const { projects } = usePosts();
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold mb-6">Projects</h1>
      
      <PostList 
        posts={projects}
        title={`${projects.length} Project${projects.length !== 1 ? 's' : ''}`}
      />
    </div>
  );
}
