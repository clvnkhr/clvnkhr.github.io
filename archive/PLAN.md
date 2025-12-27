# TypeScript React Blog - Architecture Plan

## Project Overview

A modern, clean, minimal blog built with React + TypeScript, using Typst for content. Features include client-side search, tag filtering, dark mode, and automatic GitHub Pages deployment.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Content**: Typst (.typ files)
- **Build Pipeline**: Effect.ts (functional error handling)
- **Deployment**: GitHub Actions → GitHub Pages
- **Error Handling**: Effect.ts with comprehensive logging

## Design Principles

- Clean, minimal, modern aesthetic
- Typography-first design
- Card-less layout (use list/grid with hover effects)
- Subtle animations (fade-in, slide-up)
- Dark mode with smooth transitions
- Mobile-first responsive
- Sticky header with hamburger menu

## File Structure

```
blog-ts/
├── content/
│   ├── posts/
│   │   └── [slug].typ
│   └── projects/
│       └── [slug].typ
├── public/
│   ├── assets/
│   │   └── img/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── Layout.tsx
│   │   ├── posts/
│   │   │   ├── PostList.tsx
│   │   │   ├── PostItem.tsx
│   │   │   └── PostPage.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchPage.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── tags/
│   │   │   ├── TagBadge.tsx
│   │   │   └── TagCloud.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── hooks/
│   │   ├── usePosts.ts
│   │   ├── useSearch.ts
│   │   └── useDarkMode.ts
│   ├── lib/
│   │   ├── parser.ts
│   │   ├── search.ts
│   │   ├── seo.ts
│   │   └── sitemap.ts
│   ├── routes/
│   │   ├── App.tsx
│   │   ├── Home.tsx
│   │   ├── Posts.tsx
│   │   ├── Post.tsx
│   │   ├── Tag.tsx
│   │   └── Search.tsx
│   ├── types/
│   │   └── post.ts
│   ├── data/
│   │   └── posts.json (generated)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── scripts/
│   └── build.ts (Effect.ts pipeline)
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── PLAN.md
```

## Content Format

### .typ File Structure

```typ
// frontmatter
// title: "Post Title"
// date: "2024-01-15"
// updated: "2024-02-20"
// tags: ["coding", "typescript"]
// description: "Post description"
// splashImage: "/assets/img/image.png"
// pin: false
// author: "Author Name"
// end

Post content in Typst format...

= Heading

== Subheading

Content here...
```

### Post Type Definition

```typescript
interface Post {
  id: string;              // filename slug
  title: string;
  date: string;           // ISO format
  updated?: string;
  tags: string[];
  description: string;
  htmlContent: string;    // compiled HTML from Typst
  pin?: boolean;
  splashImage?: string;
  author?: string;
}

interface Filters {
  query?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}
```

## Build Pipeline (Effect.ts)

### Pipeline Overview

1. Parse metadata from .typ files (comments)
2. Compile .typ files → HTML using Typst CLI
3. Combine metadata + HTML → JSON data structure
4. Sort posts (pinned first, then by date)
5. Write `posts.json`
6. Generate sitemap.xml (SEO)
7. Run Vite build
8. Deploy to GitHub Pages

### Build Script

See `scripts/build.ts` - uses Effect.ts for:
- Safe command execution with error handling
- File I/O operations with error handling
- Functional composition of build steps
- Comprehensive logging at each stage
- Graceful failure with detailed error messages

## GitHub Actions Workflow

### Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
- Checkout repository
- Setup Node.js 20
- Install Typst CLI (test with typst-action first, fallback to cargo)
- Install dependencies (npm ci)
- Run build script (npm run build)
- Configure Pages
- Upload artifact (dist/)
- Deploy to GitHub Pages
```

### Testing Typst CLI

Before final deployment, test Typst CLI installation in Actions.

## Design System

### Tailwind Configuration

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    colors: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      dark: {
        bg: '#0f172a',
        card: '#1e293b',
        text: '#f8fafc',
      },
      light: {
        bg: '#ffffff',
        card: '#f8fafc',
        text: '#0f172a',
      }
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-in-out',
      'slide-up': 'slideUp 0.4s ease-out',
    }
  }
}
```

### Component Styling

**Layout**:
- Max-width: 4xl (56rem) for content
- Centered with padding
- Sticky header with backdrop-blur
- Smooth color transitions

**Post Lists**:
- Card-less design
- Border with hover shadow/lift
- Staggered animation delays
- Tag badges and pin indicator

**Dark Mode**:
- Class-based (`darkMode: 'class'`)
- Persist in localStorage
- Smooth transitions (300ms)
- Semantic color tokens

## Component Architecture

### Layout Components

**Layout.tsx**:
- Wraps all pages
- Manages dark mode theme
- Applies global transitions

**Header.tsx**:
- Sticky navigation
- Logo/branding
- Desktop nav links
- Dark mode toggle
- Mobile menu trigger

**MobileNav.tsx**:
- Hamburger menu
- Slide-in panel
- Click-outside close
- Touch-friendly

### Post Components

**PostList.tsx**:
- Renders array of PostItem
- Empty state handling
- Optional title

**PostItem.tsx**:
- Link to post page
- Tag badges
- Pin indicator
- Hover effects
- Staggered animations

**PostPage.tsx**:
- Full post content
- Typst HTML rendering
- Navigation (prev/next)
- Related posts (same tags)

### Search Components

**SearchBar.tsx**:
- Text input
- Filter toggle button
- Submit button
- Clear filters button

**SearchPage.tsx**:
- Dedicated search UI
- Advanced filters (date range)
- Results count
- URL query params

**FilterPanel.tsx**:
- Tag checkboxes (multiselect)
- Date range pickers
- Active filter display

### Tag Components

**TagBadge.tsx**:
- Clickable tag
- Consistent styling
- Color variants (optional)

**TagCloud.tsx**:
- All tags with counts
- Click to filter

## Routing Structure

```typescript
/                    // Home - latest posts
/posts               // All posts with search/filter
/posts/:slug         // Individual post
/tags/:tag           // Posts filtered by tag
/projects            // Posts with 'project' tag
/search              // Dedicated search page
```

## Data Management

### usePosts Hook

```typescript
const {
  posts,           // All posts (sorted)
  filteredPosts,   // Posts matching filters
  allTags,         // Unique tags
  projects,        // Posts with 'project' tag
  getPostsByTag,   // Filter by single tag
  filters,         // Current filters
  setFilters,      // Update filters
} = usePosts();
```

### Search Logic

**Client-side filtering**:
- Text search in title, description, content
- Tag filtering (AND logic - all tags must match)
- Date range filtering
- URL query param synchronization

### State Management

- React Context for:
  - Dark mode
  - Search filters
- No Redux needed (simple app)

## SEO Strategy

### React Helmet Async

```typescript
<Helmet>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
</Helmet>
```

### Additional SEO

- Sitemap generation (build script with Effect.ts)
- robots.txt
- Semantic HTML
- Proper heading hierarchy
- Alt text for images

## Implementation Steps

### Phase 1: Setup
1. Initialize Vite + React + TypeScript
2. Install dependencies (React Router, Effect.ts, Tailwind)
3. Configure Tailwind
4. Set up file structure

### Phase 2: Build Pipeline
1. Create build script with Effect.ts
2. Implement metadata parser
3. Test Typst CLI compilation
4. Generate posts.json
5. Add comprehensive logging

### Phase 3: Core Components
1. Layout components (Layout, Header, Footer)
2. Post components (PostList, PostItem, PostPage)
3. Tag components (TagBadge, TagCloud)
4. UI components (Button, Input)

### Phase 4: Features
1. usePosts hook
2. Search components (SearchBar, FilterPanel, SearchPage)
3. Dark mode implementation
4. Mobile navigation

### Phase 5: Routing & Pages
1. Set up React Router
2. Create page components (Home, Posts, Post, Tag, Search)
3. Implement navigation
4. Handle 404s

### Phase 6: SEO & Deployment
1. Add React Helmet
2. Create sitemap generator
3. Add robots.txt
4. Set up GitHub Actions workflow
5. Test Typst CLI in Actions

### Phase 7: Polish
1. Animations (fade-in, slide-up)
2. Hover effects
3. Transitions
4. Mobile responsiveness
5. Accessibility

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-helmet-async": "^2.0.4",
    "effect": "^2.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tsx": "^4.7.0",
    "glob": "^10.3.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

## Scripts

```json
{
  "dev": "vite",
  "build": "tsx scripts/build.ts",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src --ext ts,tsx",
  "format": "prettier --write src"
}
```

## Configuration Files

### vite.config.ts
```typescript
{
  plugins: [react()],
  base: '/blog-ts/', // Repo name
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
}
```

### tsconfig.json
- Strict mode
- Path aliases (@/components, etc.)
- JSX settings

## Notes

### Typst CLI Testing
Before final deployment, verify:
1. Typst CLI works in GitHub Actions environment
2. Compilation flags are correct
3. HTML output format matches expectations

### Effect.ts Benefits
- Composable error handling
- Functional programming paradigm
- Type-safe operations
- Comprehensive logging
- Graceful failures

### Design Decisions
- No card layout (cleaner, simpler)
- Projects = posts with 'project' tag
- Dark mode toggle in header
- Mobile hamburger menu
- Search in header + dedicated page
- Minimal external dependencies

## Future Enhancements

- RSS feed generation
- Comments system (Giscus, Utterances)
- Reading time calculation
- Table of contents for long posts
- Related posts suggestions
- Newsletter signup
- Social sharing buttons
- Image optimization
- Lazy loading
- Service worker (PWA)
