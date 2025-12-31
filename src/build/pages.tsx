import { renderToString } from 'react-dom/server';
import { Layout } from '../components/Layout';
import { Post } from '../types/post';

export function getTagPastelColor(tagName: string): string {
  const colors = [
    'pink', 'mauve', 'red', 'maroon',
    'peach', 'yellow', 'green', 'teal',
    'sky', 'sapphire', 'blue', 'lavender'
  ];

  const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedColor = `ctp-${colors[hash % colors.length]}`;

  return `bg-${selectedColor} text-ctp-crust`;
}

export function renderHomePage(): string {
  const html = renderToString(
    <Layout title="Calvin's Blog" darkMode={true}>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold mb-4 ctp-text">Calvin's Blog</h1>
        <p className="text-xl text-ctp-subtext0 mb-8">
          Welcome to my blog powered by Typst and Bun
        </p>
        <nav className="flex gap-4">
          <a href="/blog/" className="ctp-mauve hover:underline">
            View Blog Posts →
          </a>
          <a href="/projects/" className="ctp-mauve hover:underline">
            View Projects →
          </a>
        </nav>
      </main>
    </Layout>
  );

  return `<!DOCTYPE html>${html}`;
}

export function renderBlogIndex(posts: Post[]): string {
  const html = renderToString(
    <Layout title="Blog | Calvin's Blog" darkMode={true}>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 ctp-text">Blog Posts</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-ctp-surface1 pb-6">
              <h2 className="text-2xl font-bold mb-2">
                <a href={post.path} className="ctp-mauve hover:underline">
                  {post.title}
                </a>
              </h2>
              <time className="text-sm text-ctp-subtext0">
                {post.date.toLocaleDateString()}
              </time>
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className={`px-2 py-1 rounded text-sm ${getTagPastelColor(tag)}`}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </Layout>
  );

  return `<!DOCTYPE html>${html}`;
}

export function renderPostPage(post: Post): string {
  const html = renderToString(
    <Layout title={`${post.title} | Calvin's Blog`} darkMode={true}>
      <article className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 ctp-text">{post.title}</h1>
          <time className="text-ctp-subtext0">
            {post.date.toLocaleDateString()}
          </time>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-2">
              {post.tags.map((tag) => (
                <span key={tag} className={`px-2 py-1 rounded text-sm ${getTagPastelColor(tag)}`}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-lg" dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
      </article>
    </Layout>
  );

  return `<!DOCTYPE html>${html}`;
}
