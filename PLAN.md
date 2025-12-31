# Blog Redesign Plan

## Executive Summary

Redesigning the personal blog to use **Typst** for content authoring, **Bun + TypeScript** for the build system, with **Pagefind** for client-side search. The old Jekyll blog is preserved in `archive/` for reference.

---

## Final Technology Choices

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Content Format** | Typst (.typ) | Excellent for math, your requirement |
| **Frontmatter** | Typst comments (`// key: value`) | Simple, parseable |
| **Runtime** | Bun | Fast, TypeScript-native |
| **Language** | TypeScript | Type safety, your requirement |
| **Build** | Custom TypeScript scripts | Max control, Bun-native |
| **Templates** | JSX components | Flexible, can add React later |
 | **Styling** | Tailwind CSS + Catppuccin plugin | Utility-first, official color scheme |
| **Theme** | Catppuccin (Latte/Mocha) + System default | Modern, follows system preference |
| **Search** | Pagefind | Easy with Tailwind, built-in filtering |
| **Math Rendering** | Typst HTML + auto-wrapped math | Visual fidelity, no MathJax |
| **Hosting** | GitHub Pages | Already configured |
| **Comments** | None | Simplest, fastest |
| **URLs** | Date-based (`/blog/2025/01/15/my-post/`) | From old blog |
| **Dark Mode** | Yes | User preference, modern standard |
| **Projects** | Yes | Portfolio showcase |

---

## Current State Analysis

### Old Blog (archive/)

**Technology Stack:**
- Jekyll 4.0.0 (Ruby-based SSG)
- MathJax 3 for math rendering
- Dark mode via Darkmode.js
- Disqus for comments
- 9 blog posts (2023-06 to 2024-04)

**Features to Retain:**
- Dark mode toggle (but with Catppuccin theme)
- Tag system
- Project showcase
- Date-based URL structure
- Clean, simple aesthetic

**Features to Drop:**
- MathJax (replacing with Typst HTML)
- Disqus comments
- Jekyll-specific patterns

### Current GitHub Actions (.github/workflows/deploy.yml)

**Workflow:**
- Triggers: Push to `ts-blog` or `main`
- Node.js 20 + npm + Typst CLI
- Build: `npm run build` → `./dist`
- Deploy: GitHub Pages

**Status:** ⚠️ No `package.json` exists at root - needs to be created

---

## Proposed Architecture

### Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│ Content Layer                                            │
│                                                          │
│  blog/posts/*.typ  →  Typst source (.typ files)          │
│  blog/tags/*        →  Tag metadata                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ Build Layer                                              │
│                                                          │
│  1. Metadata extraction from .typ comments             │
│  2. Typst compilation:                                   │
│     `typst compile --format html --features html`        │
│  3. Auto-wrap math with show rules                      │
│  4. JSX template rendering                              │
│  5. Generate pages (index, posts, tags, projects)       │
│  6. Build search index (Pagefind)                       │
│  7. Bundle assets (Tailwind, images)                     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ Output Layer                                             │
│                                                          │
│  ./dist/                                                 │
│  ├── index.html          → Homepage                     │
│  ├── blog/                                                │
│  │   ├── index.html      → Post listing                  │
│  │   └── 2025/01/15/my-post/index.html → Posts          │
│  ├── tags/                                                 │
│  │   └── *.html          → Tag pages                     │
│  ├── projects/                                            │
│  │   └── index.html      → Projects page                 │
│  ├── pagefind/                                            │
│  │   └── search-index   → Pagefind data                  │
│  ├── assets/                                             │
│  │   ├── css/                                          │
│  │   ├── js/                                           │
│  │   └── img/                                          │
│  └── favicon.png                                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│ Runtime Layer                                            │
│                                                          │
│  - Static hosting (GitHub Pages)                        │
│  - Pagefind search (client-side)                        │
│  - Dark mode toggle (via CSS variables)                 │
│  - Tailwind CSS (via CDN or bundled)                    │
└─────────────────────────────────────────────────────────┘
```

### Detailed Components

#### 1. Content Structure

```
blog/
├── posts/
│   ├── 2025/
│   │   ├── 01/
│   │   │   ├── 15/my-first-post.typ
│   │   │   └── 20/typst-guide.typ
│   │   └── 02/
│   │       └── 05/another-post.typ
│   └── 2024/
│       └── 12/
│           └── 25/old-post.typ
├── templates/
│   └── math.typ      # Global show rules (math, etc.)
└── tags/
    └── config.yml    # Tag definitions with colors
```

**Typst Frontmatter Format:**
```typst
// title: My First Post
// date: 2025-01-15
// updated: 2025-01-16
// tags: tech, tutorial
// splash: /assets/img/post-splash.png
// splash_caption: Caption text
// draft: false

= My First Post

Content here...

Some inline math: $x^2 + y^2 = z^2$

Display math:
$
  \int_{-\infty}^\infty e^{-x^2} \, dx = \sqrt{\pi}
$
```

#### 2. Build System (TypeScript + Bun)

**Main Build Script:**
```typescript
// build/index.ts
import { buildBlog } from './build';

await buildBlog();
```

**Build steps:**
1. Scan `blog/posts/yyyy/mm/dd/` for `.typ` files
2. Parse metadata from top comments using regex
3. Compile each `.typ` → `.html` via `typst compile --format html --features html`
   (posts import `blog/templates/math.typ` for global show rules)
4. Render JSX templates for each page type using `renderToString`
5. Generate pages: splash, blog index, posts, tags, projects, search
6. Generate tag pages with auto pastel colors
7. Run Pagefind index generation
8. Bundle Tailwind CSS with Catppuccin plugin
9. Copy static assets to `./dist/`

#### 3. JSX Template System

**Components:**
```typescript
// src/components/Layout.tsx
export function Layout({ children, title, darkMode }: LayoutProps) {
  return (
    <html lang="en" class={darkMode ? "dark" : ""}>
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/assets/css/main.css" />
        <script src="/assets/js/dark-mode.js" defer />
      </head>
      <body class="bg-catppuccin-latte-base dark:bg-catppuccin-mocha-base">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Page templates:**
- `Layout.tsx` - Base layout with header/footer
- `PostPage.tsx` - Blog post with metadata and content
- `BlogIndex.tsx` - Post listing with pagination
- `TagPage.tsx` - Posts filtered by tag
- `ProjectsPage.tsx` - Projects showcase
- `HomePage.tsx` - Landing page

#### 4. Tailwind + Catppuccin Theme

**Using Official Catppuccin Plugin:**
```javascript
// tailwind.config.js
const { catppuccin } = require("@catppuccin/tailwindcss");

module.exports = {
  content: ["./src/**/*.{tsx,ts}", "./dist/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [catppuccin({
    name: "catppuccin",
    defaultFlavour: "latte", // Light mode default
    autoPrefix: "ctp",
  })],
  darkMode: 'class',
};
```

**Dark Mode Toggle (System Default with Manual Override):**
```javascript
// assets/js/dark-mode.js
// Check system preference on first load
if (!localStorage.getItem('theme')) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', prefersDark);
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
```

#### 5. Math Handling

**Global Show Rule File:**
All posts will import this from a shared file:

```typst
// blog/templates/math.typ
#let html_math(it) = {
  show math.equation: it => context {
    // Only wrap in frame when exporting to HTML
    if target() == "html" {
      // Wrap inline equations in a box to prevent paragraph interruption
      // Wrap display equations in a centered span
      show: if it.block {
        it => html.span(
          style: "display: block; text-align: center; margin: 1em 0;",
          it,
        )
      } else { box }
      html.frame(it)
    } else {
      it
    }
  }
  it
}
```

**Usage in posts:**
```typst
// title: My Post
// date: 2025-01-15

#import "../../../../templates/math.typ": html_math

#show: html_math

= My Post

Math here: $x^2 + y^2 = z^2$
```

**Key features:**
- Defined as a function `html_math(it)` that wraps the show rule
- Posts import the function with `#import ... : html_math`
- Applied with `#show: html_math` in the post
- Only wraps math when exporting to HTML (`target() == "html"`)
- Handles inline equations (wraps in box to prevent paragraph interruption)
- Handles display/block equations (centers with inline CSS)
- Uses `math.equation` for more specific targeting
- Imported from shared file, not injected

**Alternative: Pre-process .typ file**
```typescript
// build/math.ts
async function addMathShowRules(content: string): string {
  // Insert show rule at top of file
  const showRule = '\nshow math: it => html.frame(it)\n\n';
  return showRule + content;
}
```

#### 6. Search with Pagefind

**Integration:**
```typescript
// build/search.ts
import * as pagefind from "pagefind";

async function buildSearch(distDir: string) {
  const { index } = await pagefind.createIndex();
  await index.addDirectory({ path: distDir });
  await index.writeFiles({ outputPath: `${distDir}/pagefind` });
}
```

**Search in Header (SearchBar Component):**
```tsx
// src/components/SearchBar.tsx
import { useEffect, useRef } from 'react';

export function SearchBar() {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPagefind = async () => {
      const { PagefindUI } = await import('pagefind');
      new PagefindUI({
        element: searchRef.current,
        showSubResults: true,
        translations: {
          placeholder: "Search...",
        },
      });
    };

    // Load lazily when user focuses
    const handleFocus = () => loadPagefind();
    searchRef.current?.addEventListener('focus', handleFocus);

    // Keyboard shortcut (Ctrl/Cmd + K)
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.querySelector('input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
      searchRef.current?.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div ref={searchRef} className="search-bar" />
  );
}
```

**Dedicated Search Page (SearchPage Component):**
```tsx
// src/components/SearchPage.tsx
export function SearchPage() {
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initSearch = async () => {
      const { PagefindUI } = await import('pagefind');
      new PagefindUI({
        element: searchRef.current,
        showSubResults: true,
        showImages: true,
        excerptLength: 150,
      });
    };

    initSearch();
  }, []);

  return (
    <Layout title="Search">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 ctp-text">Search</h1>
        <div ref={searchRef} />
      </div>
    </Layout>
  );
}
```

**HTML Attributes for Tag Filtering:**
```tsx
<article data-pagefind-body>
  <h1>{post.title}</h1>
  <div data-pagefind-filter="tag">
    {post.tags.map(tag => (
      <span key={tag} className={getTagPastelColor(tag)}>
        #{tag}
      </span>
    ))}
  </div>
</article>
```

---

## Directory Structure

```
clvnkhr.github.io/
├── archive/              # Old Jekyll blog (read-only reference)
│   ├── _posts/
│   ├── _layouts/
│   ├── _includes/
│   └── ...
├── blog/
│   ├── posts/
│   │   └── yyyy/mm/dd/  # Typst blog posts (e.g., 2025/01/15/my-post.typ)
│   ├── templates/
│   │   └── math.typ      # Global show rules (math, etc.)
│   └── tags/
│       └── config.yml    # Tag definitions
├── src/
│   ├── build/
│   │   ├── index.ts      # Main build script
│   │   ├── posts.ts      # Post compilation & metadata
│   │   ├── pages.ts      # Page generation
│   │   ├── search.ts     # Pagefind integration
│   │   └── assets.ts     # Asset copying & bundling
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostPage.tsx
│   │   ├── BlogIndex.tsx
│   │   ├── TagPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── SearchPage.tsx
│   │   └── SearchBar.tsx
│   ├── config/
│   │   ├── site.ts       # Site metadata
│   │   └── projects.ts  # Projects data
│   ├── types/
│   │   └── post.ts       # TypeScript types
│   └── assets/
│       ├── css/
│       │   └── main.css  # Tailwind entry point
│       └── js/
│           └── dark-mode.ts
├── public/               # Static assets (copied to dist)
│   ├── favicon.png
│   ├── robots.txt
│   └── assets/
│       └── img/          # Blog post images
├── dist/                 # Build output (generated)
├── node_modules/         # Dependencies
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions (existing)
├── package.json          # Node/Bun dependencies
├── package-lock.json
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind configuration
├── bunfig.toml           # Bun configuration
└── PLAN.md               # This file
```

---

## Implementation Steps

### Phase 1: Foundation Setup (1-2 hours) ✅ COMPLETE

1. [x] Create `package.json` with dependencies:
   - react, react-dom
   - pagefind
   - @catppuccin/tailwindcss
   - tailwindcss, postcss, autoprefixer
   - @types packages (bun, node, react, react-dom)

2. [ ] Set up `tsconfig.json` for TypeScript with JSX support:
   ```json
   {
     "compilerOptions": {
       "jsx": "react-jsx",
       "jsxImportSource": "react",
       "target": "ESNext",
       "module": "ESNext",
       "moduleResolution": "bundler",
       "types": ["bun-types"]
     }
   }
   ```

3. [ ] Configure `tailwind.config.js` with official Catppuccin plugin

4. [ ] Create directory structure:
   - `src/` with subdirectories
   - `blog/posts/yyyy/mm/dd/` for posts
   - `blog/templates/` for global show rules
   - `public/` for static assets

5. [ ] Initialize Bun and install dependencies

6. [x] Test local environment

### Phase 1.5: Testing Infrastructure (1-2 hours) ✅ COMPLETE

1. [x] Set up Bun test runner
2. [x] Create test setup file (`test/setup.ts`)
3. [x] Write unit tests for metadata parser
4. [x] Write unit tests for tag color generator
5. [x] Write integration tests for build system
6. [x] Verify all tests pass (16/16 passing)
7. [x] Add test scripts to package.json

### Phase 2: Build System Core (4-6 hours)

1. [ ] Implement metadata parser from Typst comments
2. [ ] Implement Typst compilation step (imports from `blog/templates/math.typ`)
3. [ ] Set up JSX rendering with React's `renderToString`
4. [ ] Create base Layout component
5. [ ] Implement page generation (splash, blog index, posts, tags)
6. [ ] Test build with sample post
7. [ ] Set up `bun --watch` for dev server

### Phase 3: Templates & Components (3-4 hours)

1. [ ] Create Header component (navigation, search bar, dark mode toggle)
2. [ ] Create Footer component
3. [ ] Create PostPage component (post metadata, Typst HTML content)
4. [ ] Create BlogIndex component (all posts, no pagination)
5. [ ] Create TagPage component (posts by tag, with auto pastel colors)
6. [ ] Create ProjectsPage component (portfolio from TypeScript data)
7. [ ] Create HomePage component (splash/landing page)
8. [ ] Create SearchPage component (dedicated /search/ page)
9. [ ] Create SearchBar component (in header)

### Phase 4: Styling & Theme (3-4 hours)

1. [ ] Set up Tailwind CSS with Catppuccin plugin
2. [ ] Configure auto pastel colors for tags
3. [ ] Implement dark mode toggle (system default + localStorage)
4. [ ] Style all components with Catppuccin utility classes
5. [ ] Ensure responsive design (mobile-first)
6. [ ] Refine typography and spacing
7. [ ] Test light/dark mode switching

### Phase 5: Content Migration (2-4 hours)

1. [ ] Create `blog/templates/math.typ` with global show rules
2. [ ] Migrate old Jekyll posts to Typst format:
   - Convert to `blog/posts/yyyy/mm/dd/` structure
   - Extract frontmatter to Typst comments
   - Import `../templates/math.typ` in each post
   - Convert Markdown to Typst syntax
   - Update image paths
   - Remove MathJax config

3. [ ] Create tag configuration (assign auto pastel colors)
4. [ ] Create sample new Typst post
5. [ ] Verify all content renders correctly

### Phase 6: Search Implementation (2-3 hours)

1. [ ] Install and configure Pagefind
2. [ ] Add Pagefind data attributes to all page templates
3. [ ] Integrate Pagefind into build script
4. [ ] Create SearchPage component (dedicated search page)
5. [ ] Create SearchBar component (in header with keyboard shortcut)
6. [ ] Test search functionality
7. [ ] Verify tag filtering works

### Phase 7: Projects Page (1-2 hours)

1. [ ] Create `src/config/projects.ts` with project data
2. [ ] Migrate old projects (tao2tex, macaltkey.nvim, Project Euler)
3. [ ] Create project card components
4. [ ] Style projects grid/list
5. [ ] Test responsiveness

### Phase 8: Optimization & Polish (1-2 hours)

1. [ ] Optimize Tailwind CSS (purge unused styles)
2. [ ] Add minimal meta tags (title, description)
3. [ ] Verify production builds work correctly
4. [ ] Test all features end-to-end

### Phase 9: CI/CD & Deployment (1-2 hours)

1. [ ] Update GitHub Actions workflow if needed
2. [ ] Ensure Typst CLI is installed in CI (already configured)
3. [ ] Test build on GitHub Actions
4. [ ] Deploy to GitHub Pages
5. [ ] Verify production deployment

---

## Key Implementation Details

### Metadata Parsing

**Typst Comment Format:**
```typst
// title: My Post Title
// date: 2025-01-15
// updated: 2025-01-16
// tags: tech, tutorial
// splash: /assets/img/image.png
// splash_caption: Caption here
// draft: false
```

**TypeScript Parser:**
```typescript
// build/posts.ts
function parseMetadata(content: string): PostMetadata {
  const metadata: Partial<PostMetadata> = {};
  
  // Extract comment block at top of file
  const commentBlock = content.match(/^\/\/.*$/gm);
  
  commentBlock?.forEach(line => {
    const [key, value] = line.replace('// ', '').split(':');
    if (key && value) {
      // Parse based on key type
      if (key === 'tags') {
        metadata[key] = value.split(',').map(t => t.trim());
      } else if (key === 'date' || key === 'updated') {
        metadata[key] = new Date(value.trim());
      } else if (key === 'draft') {
        metadata[key] = value.trim() === 'true';
      } else {
        metadata[key] = value.trim();
      }
    }
  });
  
  return metadata as PostMetadata;
}
```

### Math Auto-wrapping

**No Pre-processing Needed:**

Since we're importing global show rules from a shared file, no injection step is required in the build process.

**Post Format:**
```typst
// blog/posts/2025/01/15/my-post.typ
// title: My Post
// date: 2025-01-15

#import "../../../../templates/math.typ": html_math

#show: html_math

= My Post

Content here...

$ x^2 + y^2 = z^2 $
```

**Build Step:**
```typescript
// Just compile directly, no pre-processing
const html = await Bun.$`typst compile --format html --features html ${typstFile} -`;
```

**Alternative: Post-process HTML**
```typescript
// Build Typst HTML first
const html = await compileTypst(typstFile);

// Then wrap math elements
const wrappedHtml = html.replace(/<math>/g, '<figure class="math-frame">')
                         .replace(/<\/math>/g, '</figure>');
```

### JSX Rendering with Bun

**Recommended Approach: React's renderToString + Bun Runtime**

Research shows that Bun's native streaming renderer has stability issues with React 19 in production mode. For static site generation, streaming isn't needed anyway. The recommended approach is:

```typescript
// build/pages.ts
import { renderToString } from 'react-dom/server';

async function renderPostPage(post: Post, htmlContent: string): Promise<string> {
  const jsx = <PostPage post={post} htmlContent={htmlContent} />;
  const html = renderToString(jsx);

  // Write to file using Bun's fast file API
  await Bun.write(`dist/${post.path}/index.html`, html);
}
```

**Why this approach:**
- ✅ **Stable** - React's `renderToString` is mature and battle-tested
- ✅ **Fast** - Still benefits from Bun's fast runtime (3.5x faster than Node)
- ✅ **Simple** - No streaming complexity for static files
- ✅ **Debuggable** - Easier to troubleshoot issues

**Example Component:**
```typescript
// src/components/PostPage.tsx
import React from 'react';

export function PostPage({ post, htmlContent }: PostPageProps) {
  return (
    <Layout title={post.title}>
      <article className="max-w-3xl mx-auto px-4 py-8 ctp-base">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4 ctp-text">{post.title}</h1>
          <time className="text-ctp-subtext0">
            {post.date.toLocaleDateString()}
          </time>
          {post.tags?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-ctp-mauve px-2 py-1 rounded ctp-crust">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-lg dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </Layout>
  );
}
```

**Performance Note:**
- Bun runtime: ~70,000 req/s for SSR (vs ~16,000 for Node)
- For SSG: Build time dominated by file I/O, not rendering
- Parallel rendering recommended for multiple pages

### Catppuccin Color Palette

**Using Official Plugin:**

All colors are available via the official `@catppuccin/tailwindcss` plugin with automatic prefix `ctp-`. Examples:

```css
/* Available utility classes */
.bg-ctp-base           /* Base background */
.bg-ctp-mantle         /* Mantle background */
.text-ctp-text         /* Primary text */
.text-ctp-mauve        /* Mauve accent */
.bg-ctp-mauve         /* Mauve background */
.border-ctp-mauve     /* Mauve border */
```

**Flavors Available:**
- `latte` - Light mode (default)
- `frappe` - Dark (blue-tinted)
- `macchiato` - Dark (purple-tinted)
- `mocha` - Dark (standard dark)

**Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  plugins: [catppuccin({
    defaultFlavour: "latte",
    autoPrefix: "ctp",
  })],
  darkMode: 'class',
};
```

**Auto Pastel Colors for Tags:**

Generate random pastel colors for tags using utility:
```typescript
function getTagPastelColor(tagName: string): string {
  const colors = [
    'ctp-pink', 'ctp-mauve', 'ctp-red', 'ctp-maroon',
    'ctp-peach', 'ctp-yellow', 'ctp-green', 'ctp-teal',
    'ctp-sky', 'ctp-sapphire', 'ctp-blue', 'ctp-lavender'
  ];
  // Hash tag name for consistent color
  const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `bg-ctp-${colors[hash % colors.length]} text-ctp-crust`;
}
```

### Pagefind Search Integration

**Add to Build:**
```typescript
// build/index.ts
import { buildSearch } from './search';

async function buildBlog() {
  // ... build steps ...
  
  await buildSearch('./dist');
  
  console.log('✅ Build complete!');
}
```

**Search Component:**
```tsx
// src/components/Search.tsx
export function Search() {
  return (
    <div id="search" className="max-w-3xl mx-auto px-4">
      <div data-pagefind-filter="tags">
        {/* Pagefind will inject search UI here */}
      </div>
    </div>
  );
}
```

---

## Technology Requirements

### Package.json Dependencies

```json
{
  "name": "clvnkhr.github.io",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "bun run src/build/index.ts",
    "dev": "bun run src/build/index.ts --watch",
    "serve": "bun dist",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "pagefind": "^1.0.0"
  },
  "devDependencies": {
    "@catppuccin/tailwindcss": "^0.7.0",
    "@types/bun": "latest",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "types": ["bun-types", "node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Bun Configuration

```toml
# bunfig.toml
[install]
# Use bun's lockfile
lockfile = true
# Don't add workspace prefix
no-save-workspace-prefix = true

[test]
preload = ["./test/setup.ts"]

[serve.static]
plugins = []
```

---

## Potential Issues & Considerations

### Typst HTML Export Limitations

⚠️ **Important:** Typst's HTML export is **experimental** (v0.13.0, Feb 2025)

**Known limitations:**
- Single HTML file only (no multi-page)
- No CSS output (must provide your own)
- Some Typst features cause errors (e.g., `set page`)
- Math requires `html.frame()` for visual fidelity
- Not recommended for production by Typst team

**Mitigation:**
1. ✅ Using Typst HTML for content body only
2. ✅ Wrapping in our JSX templates
3. ✅ Providing Tailwind CSS for styling
4. ✅ Auto-wrapping math with show rules
5. ✅ Testing thoroughly with complex layouts

### JSX Rendering with Bun

Bun has experimental JSX support, but we're using React for stability:

```typescript
import { renderToString } from 'react-dom/server';
```

**Alternative:** Use Bun's native JSX renderer (if available/stable)

### Build Performance

**Estimated times:**
- Metadata parsing: ~10-50ms per post
- Typst compilation: ~100-500ms per post
- JSX rendering: ~50-200ms per page
- Pagefind indexing: ~1-3s for 20 posts
- Tailwind build: ~500ms-2s

**Total for 20 posts:** ~5-15s (acceptable)

**Optimization:**
- Parallelize Typst compilation
- Cache intermediate files
- Only recompile changed posts in watch mode

### Development Server

**Bun's `--watch` Mode:**

```bash
# In package.json
"scripts": {
  "dev": "bun --watch src/build/index.ts"
}
```

**How it works:**
- Bun monitors all files imported by `src/build/index.ts`
- When any imported file changes (TS, Typst, config), Bun automatically re-runs the build
- No need for manual file watching libraries (like chokidar)
- Faster than Node's watch implementations
- Supports hot reloading with Bun's built-in dev server

**Difference from "auto-rebuild" (Question 15):**
- **Option A (manual auto-rebuild):** Would require implementing a file watcher manually (more code, more dependencies)
- **Option C (Bun's --watch):** Built-in, zero-configuration, leverages Bun's optimization
- **Conclusion:** Option C is simpler and faster

**Usage:**
```bash
bun run dev    # Watch mode, rebuilds on changes
bun run build  # Single build
```

### GitHub Actions Workflow

Current workflow expects `npm run build` → `./dist`

**Ensure:**
- ✅ `package.json` has correct build script
- ✅ Build outputs to `./dist`
- ✅ All static assets included
- ✅ No absolute paths in build
- ✅ Typst CLI installed in CI (already there)

### Tailwind CSS in Production

**Development:**
```bash
bun run tailwindcss -i ./src/assets/css/main.css -o ./dist/assets/css/main.css --watch
```

**Production:**
```bash
bun run tailwindcss -i ./src/assets/css/main.css -o ./dist/assets/css/main.css --minify
```

---

## Migration Strategy

### Step 1: Keep Old Blog Running

- ✅ Old Jekyll blog preserved in `archive/`
- Old blog still accessible if needed
- Can serve from subdomain or separate branch

### Step 2: Build New System

- Create new blog system in root
- Develop locally without affecting production
- Test thoroughly

### Step 3: Content Migration

**Migration Checklist:**
1. [ ] Copy posts from `archive/_posts/` to `blog/posts/yyyy/mm/dd/`
2. [ ] Rename files to match Typst convention: `yyyy-mm-dd-title.typ`
3. [ ] Convert Markdown frontmatter to Typst comments:
   ```yaml
   ---
   layout: post
   title: Hello Jekyll
   date: 2023-06-09
   tags: [Jekyll]
   usemathjax: true
   ---
   ```
    →
    ```typst
    // title: Hello Jekyll
    // date: 2023-06-09
    // tags: Jekyll

    #import "../../templates/math.typ": html_math

    #show: html_math
    ```
4. [ ] Convert Markdown to Typst syntax:
   - `## Heading` → `== Heading`
   - `**bold**` → `*bold*`
   - `*italic*` → `_italic_`
   - `---` → `---` (horizontal rule, same)
    - `[link](url)` → `#link(url)[link]`
    - `` `code` `` → `` `code` `` (same)
  5. [ ] Import `html_math` from `../../templates/math.typ` at top of each post
  6. [ ] Apply with `#show: html_math` after the import
  7. [ ] Keep math as-is (global show rule handles wrapping)
7. [ ] Update image paths to `/assets/img/`
8. [ ] Test each post renders correctly

**Tools to help:**
- Manual migration for ~9 posts (manageable)
- Use Typst syntax guide: https://typst.app/docs/reference/
- Test locally as you go

### Step 4: Gradual Rollout

1. Deploy new system to preview branch
2. Test all features
3. Switch main branch to new system
4. Keep old blog in archive for reference

---

## Next Steps

### Ready to Start? ✅

All decisions are finalized! Here's what happens next:

**Phase 1: Foundation**
1. Create `package.json` with all dependencies
2. Set up `tsconfig.json` for TypeScript + JSX
3. Configure `tailwind.config.js` with Catppuccin
4. Create directory structure
5. Initialize Bun and install dependencies

**Phase 2: Build System**
1. Implement metadata parser
2. Create math show rule injector
3. Set up Typst compilation
4. Implement JSX rendering
5. Create base Layout component
6. Test with sample post

**Phase 3: Content**
1. Create sample Typst post
2. Migrate old posts
3. Create tag configuration
4. Set up projects data

**Phase 4: Polish**
1. Style all components with Tailwind
2. Implement dark mode
3. Add search
4. Optimize for production
5. Deploy

---

## Resources

### Typst
- [Official Docs](https://typst.app/docs/)
- [HTML Export Documentation](https://typst.app/docs/reference/html/)
- [HTML Tracking Issue #5512](https://github.com/typst/typst/issues/5512)
- [Math Syntax](https://typst.app/docs/reference/math/)
- [Show Rules](https://typst.app/docs/reference/styling/templates/)

### Bun
- [Official Docs](https://bun.sh/)
- [HTML & Static Sites](https://bun.sh/docs/bundler/html-static)
- [TypeScript Support](https://bun.sh/docs/guides/runtime/typescript)
- [JSX Support](https://bun.sh/docs/bundler/react-jsx)

### Pagefind
- [Official Site](https://pagefind.app/)
- [Documentation](https://pagefind.app/docs/)
- [Filtering](https://pagefind.app/docs/ui-filtering/)
- [Node API](https://pagefind.app/docs/node-api/)

### Tailwind CSS
- [Official Docs](https://tailwindcss.com/docs)
- [Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Configuration](https://tailwindcss.com/docs/configuration)

### Catppuccin
- [Official Site](https://catppuccin.com/)
- [Color Palette](https://catppuccin.com/palette)
- [Tailwind Plugin](https://github.com/catppuccin/tailwindcss)

### React + JSX
- [React Docs](https://react.dev/)
- [Server-Side Rendering](https://react.dev/reference/react-dom/server/renderToString)

---

## Version History

- **2025-12-31 v4.1:** Updated math template documentation to reflect working implementation (html_math function pattern)
- **2025-12-30 v4.0:** Added Phase 1.5 - Testing Infrastructure (16 tests passing)
- **2025-12-29 v3.0:** Updated with final user decisions:
- **2025-12-29 v2.0:** Finalized technology choices, updated architecture
- **2025-12-29 v3.0:** Updated with final user decisions:
  - Math show rules imported from shared file
  - Typst organization: yyyy/mm/dd
  - Official Catppuccin Tailwind plugin
  - System default dark mode with toggle
  - All posts on blog index (no pagination)
  - Auto pastel colors for tags
  - TypeScript for projects config
  - Search: header bar + dedicated page
  - JSX: React `renderToString` (recommended)
  - Minimal SEO (no RSS, no asset optimization)
  - Dev server: Bun's `--watch`

---

## Summary

**Tech Stack:**
- Content: Typst (.typ files) with global show rules
- Build: TypeScript + Bun runtime + React `renderToString`
- Templates: JSX components (React)
- Styling: Tailwind CSS + Official Catppuccin plugin
- Theme: Catppuccin (Latte/Mocha) with system default + toggle
- Search: Pagefind (header bar + dedicated page)
- Math: Typst HTML via global show rule (no MathJax)
- Hosting: GitHub Pages
- Content Structure: Date-based URLs (yyyy/mm/dd)

**Key Features:**
- ✅ Simple, minimal design
- ✅ Catppuccin theme (Latte/Mocha)
- ✅ Dark mode (system default with manual toggle)
- ✅ Date-based URLs (/blog/2025/01/15/my-post/)
- ✅ Tag system with auto pastel colors
- ✅ Projects showcase (TypeScript config)
- ✅ Client-side search (header + dedicated page)
- ✅ Math support (via Typst HTML export)
- ✅ No comments (simple, fast)
- ✅ Splash/homepage (index.html)
- ✅ Minimal SEO (title + description only)
- ✅ No RSS feed

**Design Decisions:**
- All posts on blog index (no pagination)
- Math show rules via `html_math()` function imported from shared file
- Posts apply math rules with `#show: html_math`
- Tags auto-colored with pastel palette
- Projects stored as TypeScript for type safety
- Dev server uses Bun's built-in `--watch`

**Estimated Timeline:** 16-28 hours total (includes testing phase)

**Ready to implement! 🚀**

---

## Blog Post Creation Flow - Step-by-Step Example

Here's exactly how a blog post goes from a `.typ` file to a rendered HTML page:

### Step 1: File Locations

```
blog/
├── posts/
│   └── 2025/
│       └── 01/
│           └── 15/
│               └── my-first-post.typ  ← Your blog post
└── templates/
    └── math.typ                       ← Global Typst template with math rules
```

### Step 2: Your Blog Post (.typ file)

```typst
// blog/posts/2025/01/15/my-first-post.typ

// title: My First Blog Post
// date: 2025-01-15
// tags: tutorial, typst

// Import global math rules from templates folder
#import "../../../../templates/math.typ": html_math

#show: html_math

= My First Blog Post

Welcome to my new blog! This post demonstrates how Typst files become HTML blog posts.

== Introduction

This is a simple blog post with some math equations.

== Basic Math

Here's an inline equation: $x^2 + y^2 = z^2$

And here's a display equation:

$
  integral_(-oo)^oo e^(-x^2) dif x = sqrt(pi)
 $

== Conclusion

That's how it works!
```

### Step 3: Global Math Template

```typst
// blog/templates/math.typ

// This file contains a function with show rules that ALL blog posts import
// It handles math rendering for HTML export

#let html_math(it) = {
  show math.equation: it => context {
    // Only wrap in frame when exporting to HTML
    if target() == "html" {
      // Wrap inline equations in a box to prevent paragraph interruption
      // Wrap display equations in a centered span
      show: if it.block {
        it => html.span(
          style: "display: block; text-align: center; margin: 1em 0;",
          it,
        )
      } else { box }
      html.frame(it)
    } else {
      it
    }
  }
  it
}
```

### Step 4: Build Process (What the build script does)

```typescript
// src/build/posts.ts

async function compilePost(postFile: string) {
  // Step 4a: Parse metadata from top comments
  const content = await Bun.file(postFile).text();
  const metadata = parseMetadata(content);
  /*
    metadata = {
      title: "My First Blog Post",
      date: 2025-01-15,
      tags: ["tutorial", "typst"]
    }
  */

  // Step 4b: Compile Typst to HTML
  // The file already imports math.typ, so math is auto-wrapped
  const htmlOutput = await Bun.$`
    typst compile --format html --features html ${postFile} -
  `;
  /*
    htmlOutput contains:
    <h1>My First Blog Post</h1>
    <p>Welcome to my new blog!...</p>
    <p>Here's an inline equation: <svg class="math">x² + y² = z²</svg></p>
    <p>And here's a display equation:</p>
    <span style="display: block; text-align: center; margin: 1em 0;">
      <svg class="math">∫₋∞^∞ e⁻ˣ² dx = √π</svg>
    </span>
  */

  // Step 4c: Render JSX template around the HTML
  const fullHtml = renderToString(
    <PostPage 
      post={metadata}
      htmlContent={htmlOutput}
    />
  );
  /*
    fullHtml is a complete HTML page:
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>My First Blog Post | My Blog</title>
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body>
        <header>...nav...</header>
        <main>
          <article>
            <h1>My First Blog Post</h1>
            <p>Welcome to my new blog!...</p>
            <p>Here's an inline equation: <svg class="math">x² + y² = z²</svg></p>
            <p>And here's a display equation:</p>
            <span style="display: block; text-align: center; margin: 1em 0;">
              <svg class="math">∫₋∞^∞ e⁻ˣ² dx = √π</svg>
            </span>
          </article>
        </main>
        <footer>...</footer>
      </body>
    </html>
  */

  // Step 4d: Write to dist
  const outputPath = `dist/blog/2025/01/15/my-first-post/index.html`;
  await Bun.write(outputPath, fullHtml);
}
```

### Step 5: JSX Template Component

```typescript
// src/components/PostPage.tsx

export function PostPage({ post, htmlContent }: PostPageProps) {
  return (
    <Layout title={post.title}>
      <article className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <time className="text-ctp-subtext0">
            {post.date.toLocaleDateString()}
          </time>
          {post.tags?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-ctp-mauve px-2 py-1 rounded text-ctp-crust">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* This is where the Typst HTML content goes */}
        <div 
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </Layout>
  );
}
```

### Step 6: Final HTML Output (dist/blog/2025/01/15/my-first-post/index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My First Blog Post | My Blog</title>
  <link rel="stylesheet" href="/assets/css/main.css" />
</head>
<body class="bg-ctp-base text-ctp-text">
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/blog/">Blog</a>
      <a href="/projects/">Projects</a>
    </nav>
  </header>
  
  <main>
    <article class="max-w-3xl mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">My First Blog Post</h1>
        <time class="text-ctp-subtext0">1/15/2025</time>
        <div class="flex gap-2 mt-2">
          <span class="bg-ctp-mauve px-2 py-1 rounded text-ctp-crust">#tutorial</span>
          <span class="bg-ctp-pink px-2 py-1 rounded text-ctp-crust">#typst</span>
        </div>
      </header>

      <!-- This HTML came from Typst compilation -->
      <div class="prose prose-lg">
        <h2>Introduction</h2>
        <p>Welcome to my new blog! This post demonstrates how Typst files become HTML blog posts.</p>
        
        <h2>Basic Math</h2>
        <p>Here's an inline equation: <svg class="math">x² + y² = z²</svg></p>
        <p>And here's a display equation:</p>
        <span style="display: block; text-align: center; margin: 1em 0;">
          <svg class="math">∫₋∞^∞ e⁻ˣ² dx = √π</svg>
        </span>

        <h2>Conclusion</h2>
        <p>That's how it works!</p>
      </div>
    </article>
  </main>

  <footer>
    <p>© 2025 Your Name</p>
  </footer>
</body>
</html>
```

---

## Complete Flow Diagram

```
1. WRITE (You create the .typ file)
   blog/posts/2025/01/15/my-first-post.typ
   
2. IMPORT (Your .typ file imports global rules)
   #include "../../templates/math.typ"
   
3. BUILD (Build script runs)
   ├─ Parse metadata from comments
   ├─ Compile .typ → HTML (math wrapped via show rule)
   ├─ Render JSX template around HTML
   └─ Write final HTML to dist
   
4. SERVE (User visits /blog/2025/01/15/my-first-post/)
   Server sends: dist/blog/2025/01/15/my-first-post/index.html
   
5. RENDER (Browser displays the page)
   HTML loads CSS from /assets/css/main.css
   User sees the formatted blog post with math equations
```

---

## Key Points

1. **You write:** `.typ` file in `blog/posts/yyyy/mm/dd/`
2. **You import:** Global rules from `blog/templates/math.typ` using `#import ... : html_math`
3. **You apply:** The imported function with `#show: html_math`
4. **Build script:**
   - Parses metadata from `// title:`, `// date:`, etc.
   - Compiles `.typ` to HTML (math is already wrapped by the show rule)
   - Wraps HTML in JSX template
   - Writes complete HTML page to `dist/`
5. **User visits:** URL like `/blog/2025/01/15/my-first-post/`
6. **Browser serves:** The HTML file with CSS styling applied



---

## Work Log

Maintain a work log in `LOG.md` to track progress and lessons learned during the blog redesign project.

### How to Use

When completing work:
1. Add timestamp: `YYYY-MM-DD HH:MM`
2. Description: Briefly describe what was done
3. Lessons learned: Any insights or discoveries (optional)

Example:

```2025-12-29 14:30: Initial plan created
- Created comprehensive PLAN.md with architecture, tech stack, and implementation steps
- Research completed on Typst HTML, search solutions, Bun/TS SSG
- All technology decisions finalized
``

When encountering issues or learning something new:
```2025-12-29 15:45: Discovered Typst HTML export limitations
- Typst's HTML export is experimental (v0.13.0)
- No CSS output, must provide own styling
- Math requires `html.frame()` for visual fidelity
- Not recommended for production by Typst team
- Mitigation: Use Typst HTML for content only, wrap in templates
``


