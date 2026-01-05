import { parseMetadata, compileTypst } from './posts';
import { renderHomePage, renderBlogIndex, renderPostPage, renderTagPage, renderTagsIndex, renderProjectsPage, renderNotFoundPage } from './pages';
import { Post } from '../types/post';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { extractTitleFromHtml, stripFirstHeading } from '../utils/post';
import { generateSvgColorCss } from '../utils/svg-colors.js';

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
                const typstResult = await compileTypst(typstPath);
                const title = extractTitleFromHtml(typstResult.html);

                if (!title) {
                  console.warn(`Warning: No h1 tag found in ${typstPath}, skipping post`);
                  continue;
                }

                // Strip the first H1 from HTML content since title is displayed separately
                const htmlContent = stripFirstHeading(typstResult.html);

                const slug = dayEntry.replace('.typ', '');
                const path = `/blog/${basePath}/${entry}/${slug}/`;

                posts.push({
                  ...metadata,
                  title,
                  slug,
                  path,
                  htmlContent,
                  svgColors: typstResult.svgColors
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

  // Discover all posts first (to collect SVG colors)
  const posts = await discoverPosts();
  console.log(`📝 Found ${posts.length} posts`);

  // Collect all SVG colors from posts and generate CSS
  console.log('🎨 Generating SVG color CSS...');
  const allColors = new Set<string>();
  posts.forEach(post => {
    post.svgColors?.forEach(color => allColors.add(color));
  });

  const svgColorCss = generateSvgColorCss(Array.from(allColors));
  await Bun.write('src/assets/css/svg-colors.css', svgColorCss);

  // Create dist directory
  await Bun.$`rm -rf dist && mkdir -p dist/blog dist/projects dist/assets/css dist/assets/img dist/assets/js dist/fonts`.quiet();

  // Copy public assets to dist
  console.log('📦 Copying assets...');
  await Bun.$`cp -r public/* dist/`.quiet();

  // Build Tailwind CSS (after svg-colors.css is generated)
  console.log('🎨 Building Tailwind CSS...');
  await Bun.$`bunx @tailwindcss/cli -i src/assets/css/main.css -o dist/assets/css/main.css`.quiet();

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

  console.log('🏷️  Generating tag pages...');
  const allTags = new Set<string>();
  const tagPosts: Record<string, number> = {};
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      allTags.add(tag);
      tagPosts[tag] = (tagPosts[tag] || 0) + 1;
    });
  });

  console.log('📋 Generating tags index...');
  await Bun.$`mkdir -p dist/tags`.quiet();
  const tagsIndexHtml = renderTagsIndex(Array.from(allTags).sort(), tagPosts);
  await Bun.write('dist/tags/index.html', tagsIndexHtml);

  for (const tag of Array.from(allTags)) {
    const tagPostsList = posts.filter(post => post.tags?.includes(tag));
    const tagHtml = renderTagPage(tag, tagPostsList);
    const tagDir = `dist/tags/${tag}`;
    await Bun.$`mkdir -p ${tagDir}`.quiet();
    await Bun.write(`${tagDir}/index.html`, tagHtml);
  }

  console.log('🚀 Generating projects page...');
  const projectsHtml = renderProjectsPage();
  await Bun.write('dist/projects/index.html', projectsHtml);

  console.log('🔍 Generating 404 page...');
  const notFoundHtml = renderNotFoundPage();
  await Bun.write('dist/404.html', notFoundHtml);

  console.log('✅ Build complete!');
  console.log(`Generated: ${posts.length} post pages, 1 blog index, 1 homepage, ${allTags.size} tag pages, 1 tags index, 1 projects page, 1 404 page`);

  if (!isWatchMode) {
    console.log('\n🌐 To view your blog:');
    console.log('   bun run serve     # Start local server');
    console.log('   Then visit: http://localhost:3000\n');
  }
}

await buildBlog();
