import { Effect, pipe } from 'effect';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { glob } from 'glob';
import * as P from 'path';

interface Post {
  id: string;
  title: string;
  date: string;
  updated?: string;
  tags: string[];
  description: string;
  htmlContent: string;
  pin?: boolean;
  splashImage?: string;
  author?: string;
}

// Parse metadata from .typ file
const parseMetadata = (content: string): any => {
  const metadata: any = {};
  let inMetadata = false;
  
  for (const line of content.split('\n')) {
    if (line.includes('// frontmatter')) {
      inMetadata = true;
      continue;
    }
    if (line.includes('// end')) {
      inMetadata = false;
      break;
    }
    if (inMetadata && line.trim().startsWith('//')) {
      const match = line.trim().replace('//', '').trim();
      const [key, ...valueParts] = match.split(':');
      const value = valueParts.join(':').trim();
      
      if (key === 'tags') {
        metadata[key] = JSON.parse(value);
      } else if (key === 'pin') {
        metadata[key] = value === 'true';
      } else {
        metadata[key] = value;
      }
    }
  }
  
  return metadata;
};

// Process all .typ files
async function processAllFiles() {
  const files = await glob('content/**/*.typ');
  const posts: Post[] = files.map(filePath => {
    const content = readFileSync(filePath, 'utf-8');
    const metadata = parseMetadata(content);
    
    return {
      id: P.basename(filePath, '.typ'),
      title: metadata.title || 'Untitled',
      date: metadata.date || new Date().toISOString(),
      updated: metadata.updated,
      tags: metadata.tags || [],
      description: metadata.description || '',
      htmlContent: '<div>Placeholder: Typst compilation not yet configured</div>',
      pin: metadata.pin || false,
      splashImage: metadata.splashImage,
      author: metadata.author
    } as Post;
  });
  
  // Sort posts (pinned first, then by date)
  posts.sort((a, b) => {
    if (a.pin && !b.pin) return -1;
    if (!a.pin && b.pin) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Write posts.json
  mkdirSync('src/data', { recursive: true });
  writeFileSync('src/data/posts.json', JSON.stringify(posts, null, 2));
  
  console.log(`✅ Processed ${posts.length} posts`);
}

processAllFiles().then(() => {
  console.log('✅ Build completed successfully!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
