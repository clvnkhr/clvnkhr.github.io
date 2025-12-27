import { Effect, pipe, Array as A } from 'effect';
import { execSync } from 'child_process';
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

// Helper: Execute command safely
const execSafe = (command: string) => 
  Effect.try({
    try: () => execSync(command, { encoding: 'utf-8' }),
    catch: (error) => new Error(`Command failed: ${command}\n${error}`)
  });

// Helper: Read file safely
const readFile = (path: string) =>
  Effect.try({
    try: () => readFileSync(path, 'utf-8'),
    catch: (error) => new Error(`Failed to read: ${path}\n${error}`)
  });

// Helper: Write file safely
const writeFile = (path: string, content: string) =>
  Effect.try({
    try: () => writeFileSync(path, content, 'utf-8'),
    catch: (error) => new Error(`Failed to write: ${path}\n${error}`)
  });

// Helper: Ensure directory exists
const ensureDir = (path: string) =>
  Effect.sync(() => {
    try { mkdirSync(path, { recursive: true }); }
    catch (e) { /* ignore if exists */ }
  });

// Parse metadata from .typ file
const parseMetadata = (content: string): Partial<Post> => {
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

// Process a single .typ file into a Post
const processTypFile = (filePath: string): Effect.Effect<never, Error, Post> =>
  pipe(
    readFile(filePath),
    Effect.flatMap(content => 
      Effect.succeed({
        id: P.basename(filePath, '.typ'),
        ...parseMetadata(content),
        htmlContent: '<div>Placeholder: Typst compilation not yet configured</div>'
      })
    )
  );

// Process all .typ files
const processAllFiles = (pattern: string): Effect.Effect<never, Error, Post[]> =>
  pipe(
    Effect.promise(() => glob(pattern)),
    Effect.flatMap(files => 
      pipe(
        A.fromArray(files),
        Effect.forEach(file => processTypFile(file))
      )
    ),
    Effect.tap(files => Effect.log(`Processed ${files.length} posts`))
  );

// Sort posts (pinned first, then by date)
const sortPosts = (posts: Post[]): Post[] =>
  pipe(
    A.sortBy(posts, [
      { order: 'descending', extract: (p: Post) => p.pin ? 1 : 0 },
      { order: 'descending', extract: (p: Post) => new Date(p.date).getTime() }
    ])
  );

// Write posts.json
const writePostsJson = (posts: Post[]): Effect.Effect<never, Error, void> =>
  pipe(
    ensureDir('src/data'),
    Effect.flatMap(() => 
      writeFile('src/data/posts.json', JSON.stringify(posts, null, 2))
    ),
    Effect.tap(() => Effect.log('posts.json written'))
  );

// Build pipeline
const buildPipeline = pipe(
  Effect.log('Starting build...'),
  Effect.flatMap(() => processAllFiles('content/**/*.typ')),
  Effect.tap(posts => Effect.log(`Found ${posts.length} posts`)),
  Effect.map(sortPosts),
  Effect.tap(posts => Effect.log('Posts sorted')),
  Effect.flatMap(writePostsJson),
  Effect.flatMap(() => execSafe('vite build')),
  Effect.tap(() => Effect.log('Vite build complete'))
);

// Run the build pipeline
Effect.runPromise(buildPipeline).then(
  () => {
    console.log('✅ Build completed successfully!');
    process.exit(0);
  },
  error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
);
