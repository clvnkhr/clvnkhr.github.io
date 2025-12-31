import { parseMetadata, compileTypst } from './posts';
import { renderHomePage, renderBlogIndex, renderPostPage } from './pages';
import { Post } from '../types/post';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function discoverPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  const postsDir = 'blog/posts';

  async function scanDirectory(dir: string, basePath?: string): Promise<void> {
    const entries = await readdir(dir);

    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const entryStat = await stat(fullPath);

      if (entryStat.isDirectory()) {
        if (entry.match(/^\d{4}$/)) {
          await scanDirectory(fullPath, entry);
        } else if (entry.match(/^\d{2}$/) && basePath && !basePath.includes('/')) {
          await scanDirectory(fullPath, `${basePath}/${entry}`);
        } else if (entry.match(/^\d{2}$/) && basePath && basePath.includes('/')) {
          const dayEntries = await readdir(fullPath);

          for (const dayEntry of dayEntries) {
            if (dayEntry.endsWith('.typ')) {
              const typstPath = join(fullPath, dayEntry);
              const content = await Bun.file(typstPath).text();

              try {
                const metadata = parseMetadata(content);
                const htmlContent = await compileTypst(typstPath);

                const slug = dayEntry.replace('.typ', '');
                const path = `/blog/${basePath}/${entry}/${slug}/`;

                posts.push({
                  ...metadata,
                  slug,
                  path,
                  htmlContent
                });
              } catch (error) {
                console.error(`Error processing ${typstPath}:`, error);
                throw error;
              }
            }
          }
        }
      }
    }
  }

  await scanDirectory(postsDir);

  // Sort posts by date (newest first)
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Filter out drafts
  return posts.filter(post => !post.draft);
}

export async function buildBlog() {
  console.log('🔨 Building blog...');
  
  const isWatchMode = process.argv.includes('--watch');

  // Create dist directory
  await Bun.$`rm -rf dist && mkdir -p dist/blog dist/projects`.quiet();

  // Discover all posts
  const posts = await discoverPosts();
  console.log(`📝 Found ${posts.length} posts`);

  // Generate homepage
  console.log('🏠 Generating homepage...');
  const homeHtml = renderHomePage();
  await Bun.write('dist/index.html', homeHtml);

  // Generate blog index
  console.log('📋 Generating blog index...');
  const blogIndexHtml = renderBlogIndex(posts);
  await Bun.write('dist/blog/index.html', blogIndexHtml);

  // Generate individual post pages
  console.log('📄 Generating post pages...');
  for (const post of posts) {
    const postHtml = renderPostPage(post);
    const outputPath = `dist${post.path}index.html`;
    await Bun.write(outputPath, postHtml);
  }

  console.log('✅ Build complete!');
  console.log(`Generated: ${posts.length} post pages, 1 blog index, 1 homepage`);
  
  if (!isWatchMode) {
    console.log('\n🌐 To view your blog:');
    console.log('   bun run serve     # Start local server');
    console.log('   Then visit: http://localhost:3000\n');
  }
}

await buildBlog();
