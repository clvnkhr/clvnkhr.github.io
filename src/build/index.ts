import { parseMetadata, compileTypst } from './posts';
import { renderHomePage, renderBlogIndex, renderPostPage, renderTagPage, renderTagsIndex, renderProjectsPage, renderNotFoundPage } from './pages';
import { Post } from '../types/post';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { extractTitleFromHtml, stripFirstHeading } from '../utils/post';
import { generateSvgColorCss } from '../utils/svg-colors.js';
import { readFileSync } from 'fs';
import packageJson from '../../package.json' with { type: 'json' };

async function discoverPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  const postsDir = 'blog/posts';

  const entries = await readdir(postsDir);

  for (const entry of entries) {
    if (!entry.endsWith('.typ')) continue;

    const typstPath = join(postsDir, entry);
    const content = await Bun.file(typstPath).text();

    try {
      const metadata = parseMetadata(content);
      const typstResult = await compileTypst(typstPath);
      const title = extractTitleFromHtml(typstResult.html);

      if (!title) {
        console.warn(`Warning: No h1 tag found in ${typstPath}, skipping post`);
        continue;
      }

      const htmlContent = stripFirstHeading(typstResult.html);

      const slug = entry.replace('.typ', '');

      const year = metadata.date.getFullYear();
      const month = String(metadata.date.getMonth() + 1).padStart(2, '0');
      const day = String(metadata.date.getDate()).padStart(2, '0');
      const path = `/blog/${year}/${month}/${day}/${slug}/`;

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

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  const hiddenPosts = posts.filter(post => post.hidden);
  if (hiddenPosts.length > 0) {
    console.log(`🙈 Hidden posts: ${hiddenPosts.map(p => p.title).join(', ')}`);
  }

  return posts.filter(post => !post.draft && !post.hidden);
}

async function checkTypstVersion(): Promise<void> {
  const expectedVersion = packageJson.engines?.typst;
  if (!expectedVersion) {
    console.warn('⚠️  No expected Typst version specified in package.json engines.typst');
    return;
  }

  try {
    const result = await Bun.$`typst --version`.quiet();
    const versionMatch = result.stdout.toString().match(/typst (\d+\.\d+\.\d+)/);

    if (!versionMatch) {
      console.warn('⚠️  Could not parse Typst version');
      return;
    }

    const actualVersion = versionMatch[1];

    if (actualVersion !== expectedVersion) {
      console.warn(`\n⚠️  WARNING: Typst version mismatch!`);
      console.warn(`   Expected: ${expectedVersion}`);
      console.warn(`   Actual:   ${actualVersion}`);
      console.warn(`   This blog relies on Typst HTML export (experimental feature).`);
      console.warn(`   Unexpected version changes may break the build.\n`);
    } else {
      console.log(`✅ Typst version ${actualVersion} matches expected ${expectedVersion}`);
    }
  } catch (error) {
    console.warn('⚠️  Could not check Typst version:', error);
  }
}

async function ensureFontsExist(): Promise<void> {
  const fontDir = 'fonts/LeteSansMath';
  const { stat } = await import('fs/promises');

  try {
    await stat(fontDir);
    console.log(`✅ Fonts directory exists: ${fontDir}`);
  } catch {
    console.log(`📥 Fonts directory not found. Cloning submodule...`);
    try {
      await Bun.$`git submodule update --init --recursive -- fonts/LeteSansMath`.quiet();
      console.log(`✅ Cloned fonts submodule successfully`);
    } catch {
      console.warn(`⚠️  Could not clone submodule via git, trying direct clone...`);
      await Bun.$`rm -rf fonts/LeteSansMath && git clone https://github.com/abccsss/LeteSansMath.git fonts/LeteSansMath --depth 1`.quiet();
      console.log(`✅ Cloned fonts repository directly`);
    }
  }
}

export async function buildBlog() {
  console.log('🔨 Building blog...');
  await ensureFontsExist();
  await checkTypstVersion();

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
  await Bun.$`cp -r src/assets/js dist/assets/`.quiet();

  // Build Tailwind CSS (after svg-colors.css is generated)
  console.log('🎨 Building Tailwind CSS...');
  await Bun.$`bunx @tailwindcss/cli -i src/assets/css/main.css -o dist/assets/css/main.css`.quiet();

  // Generate homepage
  console.log('🏠 Generating homepage...');
  const homeHtml = renderHomePage(posts.length > 0 ? posts[0] : undefined);
  await Bun.write('dist/index.html', homeHtml);

  // Generate blog index
  console.log('📋 Generating blog index...');
  const blogIndexHtml = renderBlogIndex(posts);
  await Bun.write('dist/blog/index.html', blogIndexHtml);

  // Generate individual post pages
  console.log('📄 Generating post pages...');
  for (const post of posts) {
    const postHtml = renderPostPage(post, posts);
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
