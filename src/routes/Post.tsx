import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import type { Post } from '../types/post';

export function Post() {
  const { id } = useParams<{ id: string }>();
  const { getPostsByTag } = usePosts();
  const navigate = useNavigate();
  
  // Find post by id
  const post = getPostsByTag('all').find((p: Post) => p.id === id);
  
  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Post not found</h1>
        <p className="text-slate-500 mb-6">The post you're looking for doesn't exist.</p>
        <Link to="/posts" className="text-primary hover:underline">
          Back to all posts
        </Link>
      </div>
    );
  }
  
  // Find related posts (posts with at least one matching tag)
  const relatedPosts = getPostsByTag('all')
    .filter((p: Post) => p.id !== id && p.tags.some((tag: string) => post.tags.includes(tag)))
    .slice(0, 3);
  
  return (
    <div className="animate-fade-in">
      <Helmet>
        <title>{post.title} | Calvin Khor</title>
        <meta name="description" content={post.description} />
        {post.splashImage && (
          <meta property="og:image" content={post.splashImage} />
        )}
      </Helmet>
      
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-slate-500 hover:text-primary transition-colors"
      >
        ← Back
      </button>
      
      <article className="max-w-3xl mx-auto">
        {post.splashImage && (
          <img
            src={post.splashImage}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
        )}
        
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <p className="text-slate-500 dark:text-slate-400">
            {new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
            {post.updated && (
              <span>
                {' '}• Updated {new Date(post.updated).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            )}
            {post.author && <span> • By {post.author}</span>}
          </p>
        </header>
        
        <div 
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />
      </article>
      
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-8 border-t dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="space-y-2">
            {relatedPosts.map((relatedPost: Post) => (
              <Link
                key={relatedPost.id}
                to={`/posts/${relatedPost.id}`}
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <h3 className="text-lg font-bold mb-2">{relatedPost.title}</h3>
                <p className="text-slate-500 text-sm">{relatedPost.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
