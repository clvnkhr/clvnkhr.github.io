import { usePosts } from '../hooks/usePosts';
import { PostList } from '../components/posts/PostList';
import { Link } from 'react-router-dom';

export function Home() {
  const { posts, projects } = usePosts();
  
  // Show latest 5 posts on home
  const latestPosts = posts.slice(0, 5);
  const latestProjects = projects.slice(0, 3);
  
  return (
    <div className="animate-fade-in">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
          A place to record my thoughts, journeys, experiences, and ideas
        </p>
        <div className="flex gap-4">
          <Link 
            to="/posts" 
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors"
          >
            View Posts
          </Link>
          <Link 
            to="/projects" 
            className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
          >
            View Projects
          </Link>
        </div>
      </section>
      
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Latest Posts</h2>
          <Link to="/posts" className="text-primary hover:underline">
            View all →
          </Link>
        </div>
        <PostList posts={latestPosts} />
      </section>
      
      {latestProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Recent Projects</h2>
            <Link to="/projects" className="text-primary hover:underline">
              View all →
            </Link>
          </div>
          <PostList posts={latestProjects} />
        </section>
      )}
    </div>
  );
}
