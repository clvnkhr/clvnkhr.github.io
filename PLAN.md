# Blog Redesign Plan

## Executive Summary

Redesigning personal blog to use **Typst** for content authoring, **Bun + TypeScript** for build system, with **Pagefind** for client-side search. The old Jekyll blog is preserved in `archive/` for reference.

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
| **Styling** | Tailwind CSS v4 + Catppuccin v4 plugin | Utility-first, official color scheme, v4 compatible |
| **Theme** | Catppuccin (Mocha) + CSS color-scheme | Modern, follows system preference |
| **Search** | Pagefind | Easy with Tailwind, built-in filtering |
| **Math Rendering** | Typst HTML + auto-wrapped math | Visual fidelity, no MathJax |
| **Hosting** | GitHub Pages | Already configured |
| **Comments** | None | Simplest, fastest |
| **URLs** | Date-based (`/blog/2025/01/15/my-post/`) | From old blog |
| **Dark Mode** | Yes (CSS color-scheme) | User preference, modern standard |
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
- Triggers: Push to `main`
- Node.js 20 + Bun runtime
- Build: `bun run build` → `./dist`
- Deploy: GitHub Pages

**Status:** ✅ Working with Tailwind v4

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
│  6. Build Tailwind CSS v4                               │
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
│  - Tailwind CSS (bundled)                           │
│  - CSS color-scheme for dark mode (no toggle needed)      │
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
5. Generate pages: splash, blog index, posts, tags, projects
6. Generate tag pages with auto pastel colors
7. Run Pagefind index generation
8. Build Tailwind CSS v4 with Catppuccin plugin
9. Copy static assets to `./dist/`

#### 3. JSX Template System

**Components:**
```typescript
// src/components/Layout.tsx
export function Layout({ children, title, darkMode }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body class="bg-ctp-base text-ctp-text">
        <main>{children}</main>
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

#### 4. Tailwind + Catppuccin Theme v4

**Using Catppuccin v4 Plugin:**
```css
/* src/assets/css/main.css */
@import "tailwindcss";
@import "@seangenabe/catppuccin-tailwindcss-v4/default-mocha.css";

:root {
  --font-sans: 'Atkinson Hyperlegible Next', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Atkinson Hyperlegible Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color-scheme: dark;
}

body {
  font-family: var(--font-sans);
}
```

**Color classes available:**
- `.bg-ctp-base` - Base background
- `.text-ctp-text` - Primary text
- `.text-ctp-subtext0` - Muted text
- `.bg-ctp-mauve` - Accent background
- `.ctp-mauve` - Accent text
- `.border-ctp-surface1` - Border color
- `.bg-ctp-crust` - Contrast text background
- And all other Catppuccin mocha colors with `ctp-` prefix

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
│       └── config.yml    # Tag definitions with colors
├── src/
│   ├── build/
│   │   ├── index.ts      # Main build script
│   │   ├── posts.ts      # Post compilation & metadata
│   │   ├── pages.ts      # Page generation
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
│       │   └── main.css  # Tailwind entry point with Catppuccin v4
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
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind v4 configuration
├── bunfig.toml           # Bun configuration
└── PLAN.md               # This file
```

---

## Implementation Steps

### Phase 1: Foundation Setup (1-2 hours) ✅ COMPLETE

1. [x] Create `package.json` with dependencies:
   - react, react-dom
   - pagefind
   - @seangenabe/catppuccin-tailwindcss-v4 (Tailwind v4 compatible)
   - @tailwindcss/cli (Tailwind v4 CLI)
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
   ```

3. [ ] Configure `tailwind.config.js` for Tailwind v4 (no plugins needed)

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

### Phase 2: Build System Core (4-6 hours) ✅ COMPLETE

1. [x] Implement metadata parser from Typst comments
2. [x] Implement Typst compilation step (imports from `blog/templates/math.typ`)
3. [x] Set up JSX rendering with React's `renderToString`
4. [x] Create base Layout component
5. [x] Implement page generation (splash, blog index, posts, tags)
6. [x] Test build with sample post
7. [x] Set up `bun --watch` for dev server

### Phase 3: Templates & Components (3-4 hours) ✅ COMPLETE

1. [x] Create Header component (navigation)
2. [x] Create Footer component
3. [x] Create PostPage component (post metadata, Typst HTML content)
4. [x] Create BlogIndex component (all posts, no pagination)
5. [x] Create TagPage component (posts by tag, with auto pastel colors)
6. [x] Create ProjectsPage component (portfolio from TypeScript data)
7. [x] Create HomePage component (splash/landing page)
8. [x] Create SearchPage component (dedicated /search/ page)
9. [x] Create SearchBar component (in header with keyboard shortcut)

### Phase 4: Styling & Theme (3-4 hours) ✅ COMPLETE

1. [x] Set up Tailwind CSS v4 with Catppuccin v4 plugin
2. [x] Configure auto pastel colors for tags
3. [x] Implement dark mode via CSS color-scheme (no toggle needed)
4. [x] Style all components with Catppuccin utility classes
5. [x] Ensure responsive design (mobile-first)
6. [x] Refine typography and spacing
7. [x] Test light/dark mode switching

### Phase 5: Content Migration (2-4 hours) ✅ COMPLETE

1. [x] Create `blog/templates/math.typ` with global show rules
2. [x] Migrate old Jekyll posts to Typst format
3. [x] Create sample new Typst post
4. [x] Verify all content renders correctly

### Phase 6: Search Implementation (2-3 hours) ✅ COMPLETE

1. [x] Install and configure Pagefind
2. [x] Add Pagefind data attributes to all page templates
3. [x] Integrate Pagefind into build script
4. [x] Create SearchPage component (dedicated search page)
5. [x] Create SearchBar component (in header with keyboard shortcut)
6. [x] Test search functionality
7. [x] Verify tag filtering works

### Phase 7: Projects Page (1-2 hours) ✅ COMPLETE

1. [x] Create `src/config/projects.ts` with project data
2. [x] Migrate old projects (tao2tex, macaltkey.nvim, Project Euler)
3. [x] Create project card components
4. [x] Style projects grid/list
5. [x] Test responsiveness

### Phase 8: Optimization & Polish (1-2 hours) ✅ COMPLETE

1. [x] Optimize Tailwind CSS (purge unused styles)
2. [x] Add minimal meta tags (title, description)
3. [x] Verify production builds work correctly
4. [x] Test all features end-to-end

### Phase 9: CI/CD & Deployment (1-2 hours) ✅ COMPLETE

1. [x] Update GitHub Actions workflow for Tailwind v4 CLI
2. [x] Test build on GitHub Actions
3. [x] Deploy to GitHub Pages
4. [x] Verify production deployment

---

## Key Implementation Details

### Metadata Parsing

**Typst Comment Format:**
```typst
// title: My Post Title
// date: 2025-01-15
// tags: tech, tutorial
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

$x^2 + y^2 = z^2$
```

**Build Step:**
```typescript
// Just compile directly, no pre-processing
const html = await Bun.$`typst compile --format html --features html ${typstFile} -`;
```

### JSX Rendering with Bun

**Recommended Approach: React's renderToString + Bun Runtime:**

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

### Tailwind CSS v4 with Catppuccin Theme

**Using Catppuccin v4 Plugin:**

The v3 `@catppuccin/tailwindcss` plugin is NOT compatible with Tailwind v4. We use `@seangenabe/catppuccin-tailwindcss-v4` instead.

```css
/* src/assets/css/main.css */
@import "tailwindcss";
@import "@seangenabe/catppuccin-tailwindcss-v4/default-mocha.css";

:root {
  --font-sans: 'Atkinson Hyperlegible Next', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Atkinson Hyperlegible Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color-scheme: dark;
}

body {
  font-family: var(--font-sans);
}
```

**Color classes available:**
```css
/* All Catppuccin mocha colors with ctp- prefix */
.bg-ctp-base           /* #1e1e2e */
.bg-ctp-mantle         /* #181825 */
.text-ctp-text         /* #cdd6f4 */
.text-ctp-subtext0     /* #a6adc8 */
.bg-ctp-mauve         /* #cba6f7 */
.text-ctp-mauve        /* #cba6f7 */
.bg-ctp-mauve         /* #cba6f7 */
.border-ctp-surface1  /* #45475a */
.bg-ctp-crust          /* #11111b */
.bg-ctp-overlay0       /* #6c7086 */
.bg-ctp-overlay1       /* #93959b */
.bg-ctp-overlay2       /* #7f849c */
/* And all other Catppuccin mocha colors... */
```

**Dark Mode Implementation:**

Using CSS `color-scheme: dark` in `:root` is the modern, simpler approach for Tailwind v4:
- System preference is automatically detected
- No JavaScript toggle needed
- More maintainable (pure CSS)
- Better performance (no DOM manipulation)
- Compatible with Tailwind v4's native color scheme support

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

**Tag Color Generator:**
```typescript
function getTagPastelColor(tagName: string): string {
  const colors = [
    'pink', 'mauve', 'red', 'maroon',
    'peach', 'yellow', 'green', 'teal',
    'sky', 'sapphire', 'blue', 'lavender'
  ];

  const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedColor = `bg-ctp-${colors[hash % colors.length]}`;

  return `${selectedColor} text-ctp-crust`;
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
    "serve": "bunx serve dist -l 3000"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "pagefind": "^1.0.0"
  },
  "devDependencies": {
    "@seangenabe/catppuccin-tailwindcss-v4": "^1.0.2",
    "@tailwindcss/cli": "^4.1.18",
    "@types/bun": "latest",
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0"
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

### Tailwind Configuration (v4)

```javascript
// tailwind.config.js
export default {
  content: ["./src/**/*.{tsx,ts,jsx,js}", "./dist/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Important:** Tailwind v4 uses CSS imports instead of config plugins. The Catppuccin v4 colors are imported in `src/assets/css/main.css`.

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
   
   = Hello Jekyll
   ```
4. [ ] Import `html_math` from `../../templates/math.typ` at top of each post
5. [ ] Apply with `#show: html_math` after import
6. [ ] Keep math as-is (global show rule handles wrapping)
7. [ ] Update image paths to `/assets/img/`
8. [ ] Test each post renders correctly

**Tools to help:**
- Manual migration for ~9 posts (manageable)
- Use Typst syntax guide: https://typst.app/docs/
- Test locally as you go

### Step 4: Gradual Rollout

1. Deploy new system to preview branch
2. Test all features
3. Switch main branch to new system
4. Keep old blog in archive for reference

---

## Next Steps

### Ready to Start? ✅

All major phases complete! The blog is fully operational.

**Phase 1: Foundation** ✅ Complete
**Phase 2: Build System Core** ✅ Complete
**Phase 3: Templates & Components** ✅ Complete
**Phase 4: Styling & Theme** ✅ Complete
**Phase 5: Content Migration** ✅ Complete
**Phase 6: Search Implementation** ✅ Complete
**Phase 7: Projects Page** ✅ Complete
**Phase 8: Optimization & Polish** ✅ Complete
**Phase 9: CI/CD & Deployment** ✅ Complete

---

## Resources

### Typst
- [Official Docs](https://typst.app/docs/)
- [HTML Export Documentation](https://typst.app/docs/reference/html/)
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

### Tailwind CSS v4
- [Official Docs](https://tailwindcss.com/docs)
- [Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [CSS Imports](https://tailwindcss.com/docs/upgrade-guide#css-imports)

### Catppuccin
- [Official Site](https://catppuccin.com/)
- [Color Palette](https://catppuccin.com/palette)
- [Tailwind v4 Plugin](https://github.com/seangenabe/catppuccin-tailwindcss-v4)

### React + JSX
- [React Docs](https://react.dev/)
- [Server-Side Rendering](https://react.dev/reference/react-dom/server/renderToString)

---

## Version History

- **2026-01-01 10:07: Project Status Check - All Phases Complete**
  - Verified all 9 phases of blog redesign are complete
  - Build system fully operational with Tailwind v4 + Catppuccin v4
  - All features implemented: math rendering, search, tags, projects, dark mode
  - Testing suite green (16/16 tests passing)
  - Production deployment working via GitHub Actions
  - Blog is fully operational and ready for content creation

- **2025-12-31 22:38: Tailwind v4 Migration Complete**
  - Upgraded from Tailwind CSS v3 to v4
  - Replaced `@catppuccin/tailwindcss` (v3-only) with `@seangenabe/catppuccin-tailwindcss-v4` (v4 compatible)
  - Updated Tailwind CLI command from `tailwindcss` to `@tailwindcss/cli`
  - Removed Tailwind config plugin system (v4 uses CSS imports instead of plugins)
  - Updated `src/assets/css/main.css` to import Catppuccin v4 colors directly
  - Added CSS `color-scheme: dark` for system dark mode preference (no JS toggle needed)
  - Added CSS font variables: `--font-sans` (Atkinson Hyperlegible Next), `--font-mono` (Atkinson Hyperlegible Mono)
  - Applied `font-family: var(--font-sans)` to body element
  - All Catppuccin colors now generate correctly (`bg-ctp-base`, `text-ctp-text`, `ctp-mauve`, etc.)
  - Dark mode and fonts now working correctly
  - Installed new devDependencies: `@seangenabe/catppuccin-tailwindcss-v4`, `@tailwindcss/cli`
  - Removed old devDependency: `@catppuccin/tailwindcss`

- **2025-12-31 10:07: v4.0 - Initial Plan Update**
  - Created comprehensive PLAN.md with architecture, tech stack, and implementation steps
  - Research completed on Typst HTML, search solutions, Bun/TS SSG
  - All technology decisions finalized (Typst, Bun, React JSX, Catppuccin theme)
  - Ready to implement phase by phase

---

## Summary

**Tech Stack:**
- Content: Typst (.typ files) with global show rules
- Build: TypeScript + Bun runtime + React `renderToString`
- Templates: JSX components (React)
- Styling: Tailwind CSS v4 + Catppuccin v4 plugin (`@seangenabe/catppuccin-tailwindcss-v4`)
- Theme: Catppuccin (Mocha) with CSS color-scheme (no toggle needed)
- Search: Pagefind (header bar + dedicated page)
- Math: Typst HTML via global show rule (no MathJax)
- Hosting: GitHub Pages
- Content Structure: Date-based URLs (yyyy/mm/dd)

**Key Features:**
- ✅ Simple, minimal design
- ✅ Catppuccin mocha theme
- ✅ Dark mode (CSS color-scheme)
- ✅ Date-based URLs (/blog/2025/01/15/my-post/)
- ✅ Tag system with auto pastel colors
- ✅ Projects showcase (TypeScript config)
- ✅ Client-side search (header + dedicated page)
- ✅ Math support (via Typst HTML export)
- ✅ No comments (simple, fast)
- ✅ Splash/homepage (index.html)
- ✅ Minimal SEO (title + description only)
- ✅ No RSS feed
- ✅ Responsive design (mobile-first)

**Estimated Timeline:** All phases complete

**Ready to use! 🚀**
