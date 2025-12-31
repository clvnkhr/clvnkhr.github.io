# Blog Redesign Work Log

This file records all work done and lessons learned during the blog redesign project.

---

## 2025-12-31 15:50: Compaction Summary - Phase 1 & 2 Complete

**Project Status: Foundation and build system fully operational.**

### Completed Work

**Phase 1: Foundation Setup (2025-12-30 16:48)** ✅
- Created package.json with 97 dependencies (React, Tailwind, Catppuccin, Pagefind)
- Configured tsconfig.json with JSX support (react-jsx mode)
- Set up tailwind.config.js with Catppuccin plugin v1.0.0
- Created bunfig.toml for Bun configuration
- Established directory structure: src/, blog/, public/
- All dependencies installed successfully (488ms)

**Phase 1.5: Testing Infrastructure (2025-12-30 17:50)** ✅
- Configured Bun test runner with test/setup.ts
- Created 16 unit tests across 3 test files:
  - metadata.test.ts (6 tests)
  - tag-colors.test.ts (7 tests)
  - build.test.ts (3 tests)
- All tests passing (58 expect() calls, ~40ms execution)

**Phase 2: Build System Core (2025-12-30 18:50)** ✅
- Implemented TypeScript types (Post, PostMetadata interfaces)
- Created metadata parser extracting: title, date, tags, splash, draft
- Implemented Typst compilation (HTML format with math support)
- Built post discovery system scanning yyyy/mm/dd/ structure
- Created React Layout component for page structure
- Implemented page rendering: homepage, blog index, post pages
- Tag coloring with deterministic Catppuccin pastel colors
- Full build orchestration with clean/dist workflow
- Sample blog post created and tested

**Math Template & Fonts (2025-12-31)** ✅
- Implemented html_math(it) function pattern in blog/templates/math.typ
- Posts import with `#import ... : html_math` and apply with `#show: html_math`
- Integrated Lete Sans Math font via git submodule
- Font configuration globalized to math template
- All posts automatically use Lete Sans Math for equations

### Current State

**Build System:** Fully operational
- Typst files → HTML → JSX pages workflow working
- All metadata parsing functional
- Math rendering with Lete Sans Math
- Catppuccin theme configured
- Test suite green (16/16 passing)

**Sample Content:**
- 1 sample post: blog/posts/2025/01/15/my-first-post.typ
- Math template: blog/templates/math.typ
- Font integration: fonts/LeteSansMath/ (submodule)

### Next Steps

**Phase 3: Templates & Components (3-4 hours)**
1. Create Header component (navigation, search bar, dark mode toggle)
2. Create Footer component
3. Create BlogIndex component (post listing)
4. Create TagPage component (posts by tag)
5. Create ProjectsPage component
6. Create HomePage component (splash)
7. Create SearchPage component (dedicated /search/)
8. Create SearchBar component (in header with Ctrl/Cmd+K shortcut)

**Phase 4: Styling & Theme (3-4 hours)**
1. Style all components with Catppuccin utility classes
2. Implement dark mode toggle (system default + localStorage)
3. Ensure responsive design (mobile-first)
4. Refine typography and spacing
5. Test light/dark mode switching

**Phase 5: Content Migration (2-4 hours)**
1. Migrate 9 old Jekyll posts from archive/_posts/
2. Convert Markdown to Typst syntax
3. Extract frontmatter to Typst comments
4. Update image paths to /assets/img/
5. Verify all posts render correctly

**Phase 6: Search Implementation (2-3 hours)**
1. Integrate Pagefind into build script
2. Add Pagefind data attributes to templates
3. Test search functionality
4. Verify tag filtering works

**Phase 7: Projects Page (1-2 hours)**
1. Create src/config/projects.ts with project data
2. Migrate project info (tao2tex, macaltkey.nvim, Project Euler)
3. Style project grid/list

**Phase 8: Optimization & Polish (1-2 hours)**
1. Optimize Tailwind CSS (purge unused styles)
2. Add meta tags (title, description)
3. End-to-end testing

**Phase 9: CI/CD & Deployment (1-2 hours)**
1. Update GitHub Actions workflow
2. Test build on CI
3. Deploy to GitHub Pages

**Estimated Remaining Time:** 13-21 hours

**Priority Order:** Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 8 → Phase 9

---

## 2025-12-30 18:50: Phase 2 - Full Build System Complete

Successfully implemented complete blog build system with Typst compilation and React-based rendering.

**Implemented:**

1. **TypeScript Types** (`src/types/post.ts`):
   - `Post` interface with all metadata fields
   - `PostMetadata` interface for parsed metadata
   - Proper typing for blog post data structures

2. **Metadata Parser** (`src/build/posts.ts`):
   - `parseMetadata()` - Extracts metadata from Typst comment blocks
   - Supports: `title`, `date`, `tags`, `splash`, `splash_caption`, `draft`
   - Parses date strings to Date objects
   - Splits tag strings into arrays
   - Handles optional fields gracefully

3. **Typst Compilation** (`src/build/posts.ts`):
   - `compileTypst()` - Compiles `.typ` files to HTML via Typst CLI
   - Uses `typst compile --format html --features html <file> -` command
   - Returns HTML string for use in page rendering

4. **Post Discovery** (`src/build/index.ts`):
   - `discoverPosts()` - Recursively scans `blog/posts/yyyy/mm/dd/` structure
   - Properly handles 3-level directory nesting (year/month/day)
   - Uses `stat()` to check directory types
   - Filters out draft posts automatically
   - Sorts posts by date (newest first)

5. **React Components** (`src/components/Layout.tsx`):
   - `Layout` component for HTML page structure
   - Props: `title`, `darkMode`
   - Includes meta tags, Catppuccin CSS, responsive viewport
   - Server-side rendering compatible

6. **Page Rendering** (`src/build/pages.tsx`):
   - `renderHomePage()` - Generates landing page
   - `renderBlogIndex()` - Lists all blog posts with metadata
   - `renderPostPage()` - Renders individual blog post page
   - Uses `renderToString()` from `react-dom/server`
   - `getTagPastelColor()` - Generates deterministic Catppuccin colors for tags

7. **Build Orchestration** (`src/build/index.ts`):
   - `buildBlog()` - Main build function
   - Creates output directories (`dist/`, `dist/blog/`)
   - Coordinates all build steps
   - Cleans `dist/` directory before each build

8. **Sample Content**:
   - `blog/posts/2025/01/15/my-first-post.typ` - Example blog post
   - `blog/templates/math.typ` - Math show rules for HTML export
   - Proper Typst math syntax (`integral`, `sqrt`, `infinity`)

**Fixed Issues:**
- JSX compilation errors by converting `src/build/pages.ts` → `src/build/pages.tsx`
- Updated imports to remove `.js` extensions (TypeScript moduleResolution handles this)
- Fixed Typst math syntax (LaTeX `\infty` → Typst `infinity`)
- Fixed directory scanning logic to properly detect directory depth

**Build Results:**
- Successfully builds: homepage, blog index, individual post pages
- All pages render with proper HTML structure and Catppuccin styling
- Post metadata correctly parsed and displayed
- Tags rendered with deterministic Catppuccin colors

**Status:** Phase 2 complete. Full build system operational. Blog can be built end-to-end from Typst source files to HTML output.

---

## 2025-12-30 17:50: Testing Infrastructure Implemented

Implemented complete testing infrastructure with Bun's built-in test runner:

**Added to package.json:**
- `"test": "bun test"` - Run all tests
- `"test:watch": "bun test --watch"` - Watch mode for TDD

**Updated tsconfig.json:**
- Added `"test/**/*"` to include patterns to support test files

**Created test infrastructure:**
- `test/setup.ts` - Test setup file with NODE_ENV='test'
  - Loaded automatically via bunfig.toml preload configuration

**Test files created (16 tests total):**

1. **test/metadata.test.ts** (6 tests):
   - Parse all metadata fields from Typst comments
   - Parse minimal metadata
   - Parse tags as array
   - Parse boolean draft field
   - Handle empty value gracefully
   - Ignore non-comment lines

2. **test/tag-colors.test.ts** (7 tests):
   - Return valid Catppuccin color class
   - Return consistent color for same tag name
   - Return different colors for different tag names
   - Handle empty string tag
   - Handle special characters in tag names
   - Always use available Catppuccin colors
   - Produce deterministic results

3. **test/build.test.ts** (3 tests):
   - Initialize build system without errors
   - Log build initialization messages
   - Handle build system errors gracefully

**Test execution:**
- All 16 tests passing
- 0 failures
- 58 expect() calls across 3 files
- Execution time: ~40ms

**Lessons learned:**
- Bun's test runner is built-in and requires no external testing libraries
- Test files use Bun's native `bun:test` module with Jest-like API (`describe`, `it`, `expect`)
- Metadata parser implementation included in test files as reference for future build implementation
- Tag color generator uses 12 Catppuccin colors (pink, mauve, red, maroon, peach, yellow, green, teal, sky, sapphire, blue, lavender)

**Status:** Testing infrastructure complete and all tests passing. Ready for Phase 2 implementation with TDD support.

---

## 2025-12-31 15:50: Math Template Implementation Refinement

Reviewed and updated PLAN.md to reflect the actual working implementation of the math template.

**What was learned:**

1. **Math Template Function Pattern:**
   - `blog/templates/math.typ` defines `html_math(it)` function instead of direct `#show` rule
   - Function wraps the `show math.equation` rule for HTML export
   - Returns `it` to allow chaining

2. **Post Import Pattern:**
   - Posts import the function with: `#import "../../../../templates/math.typ": html_math`
   - Applied after import with: `#show: html_math`
   - Different from `#include` pattern originally documented

3. **Why This Pattern Works:**
   - Function approach allows explicit import and application
   - Cleaner separation between template definition and usage
   - More control over when/how math rules are applied
   - Compatible with Typst's module system

4. **Math Syntax Notes:**
   - Typst uses `integral`, `sqrt`, `infinity` instead of LaTeX syntax
   - LaTeX: `\int_{-\infty}^\infty`
   - Typst: `integral_(-oo)^oo`

**Changes Made to PLAN.md:**
- Updated all math template examples to use `html_math(it)` function pattern
- Corrected post import syntax from `#include` to `#import ... : html_math`
- Added `#show: html_math` step to post examples
- Updated migration checklist with correct import pattern
- Updated "Key Points" section with 3-step process (write, import, apply, build)
- Updated "Design Decisions" section to mention function-based approach

**Status:** PLAN.md now accurately reflects the working implementation. Math rendering operational with both inline and display equations.

---

## 2025-12-31 15:50: Math Template Implementation Refinement

Reviewed and updated PLAN.md to reflect the actual working implementation of the math template.

**What was learned:**

1. **Math Template Function Pattern:**
   - `blog/templates/math.typ` defines `html_math(it)` function instead of direct `#show` rule
   - Function wraps the `show math.equation` rule for HTML export
   - Returns `it` to allow chaining

2. **Post Import Pattern:**
   - Posts import the function with: `#import "../../../../templates/math.typ": html_math`
   - Applied with: `#show: html_math`
   - Different from `#include` pattern originally documented

3. **Why This Pattern Works:**
   - Function approach allows explicit import and application
   - Cleaner separation between template definition and usage
   - More control over when/how math rules are applied
   - Compatible with Typst's module system

4. **Math Syntax Notes:**
   - Typst uses `integral`, `sqrt`, `infinity` instead of LaTeX syntax
   - LaTeX: `\int_{-\infty}^\infty`
   - Typst: `integral_(-oo)^oo`

**Changes Made to PLAN.md:**
- Updated all math template examples to use `html_math(it)` function pattern
- Corrected post import syntax from `#include` to `#import ... : html_math`
- Added `#show: html_math` step to post examples
- Updated migration checklist with correct import pattern
- Updated "Key Points" section with 3-step process (write, import, apply, build)
- Updated "Design Decisions" section to mention function-based approach
- Added version history entry for this update

**Status:** PLAN.md now accurately reflects the working implementation. Math rendering operational with both inline and display equations.

---

## 2025-12-31 16:30: Lete Sans Math Font Integration

Successfully integrated Lete Sans Math font into the blog build system via git submodule.

**Implementation:**

1. **Git Submodule Setup:**
   - Cloned `https://github.com/abccsss/LeteSansMath.git` as submodule
   - Located at `fonts/LeteSansMath/`
   - Font files available:
     - `LeteSansMath.otf` (443KB - main font)
     - `LeteSansMath-Bold.otf` (129KB - bold variant)

2. **Build Script Update:**
   - Updated `src/build/posts.ts` to add `--font-path fonts/LeteSansMath` to Typst CLI command
   - Typst can now discover and use Lete Sans Math font files during compilation
   - Command: `typst compile --format html --features html --root ../../../../ --font-path ${fontPath} ${typstFile} -`

3. **Sample Blog Post Update:**
   - Added font show rule to sample post: `#show math.equation: set text(font: "Lete Sans Math")`
   - Applied after the `#show: html_math` import
   - Only affects math equations, not regular text

4. **Build Verification:**
   - Build runs successfully with Lete Sans Math font
   - No errors with font loading
   - Math equations now render with Lete Sans Math font

**Font Details:**
- **Name:** Lete Sans Math
- **Type:** OpenType sans-serif math font
- **Base Font:** Lato font family
- **License:** SIL Open Font License (OFL) Version 1.1
- **GitHub:** https://github.com/abccsss/LeteSansMath
- **Version:** v0.50 (as of 2025-08-30)
- **Features:**
  - Displayed integrals and big operators aligned on math axis
  - Triple and quadruple stroked arrows are extensible
  - Single-storey variant for lowercase letter g (feature `cv11`)
  - Consistent equal sign styling

**Files Modified:**
- `.gitmodules` - New submodule configuration
- `fonts/LeteSansMath/**` - Cloned submodule with font files
- `src/build/posts.ts` - Added font path to Typst compilation
- `blog/posts/2025/01/15/my-first-post.typ` - Added font show rule

**Lessons Learned:**
- Git submodules work well for managing external font dependencies
- Typst's `--font-path` flag makes font discovery straightforward
- Font show rules can be applied globally or per-post
- Lete Sans Math provides excellent visual quality for mathematical content

**Status:** Lete Sans Math font successfully integrated and available to all blog posts. Any post using `#show math.equation: set text(font: "Lete Sans Math")` will render with this beautiful sans-serif math font.

**Follow-up Change (2025-12-31):**
- Moved font configuration from individual posts to `blog/templates/math.typ`
- Added `set text(font: "Lete Sans Math")` directly in the `html_math()` function
- All blog posts now automatically use Lete Sans Math for math rendering
- Simplified post structure - no per-post font configuration needed
- Benefits:
  - Single point of configuration for math font
  - Consistent math styling across all posts
  - Easy to change font globally by editing one template file

---

## 2025-12-30 16:48: Phase 1 - Foundation Setup Complete

Completed all Phase 1 tasks:

**Created:**
- `package.json` with all dependencies (React, Pagefind, Tailwind, Catppuccin plugin)
- `tsconfig.json` with JSX support (`react-jsx` mode)
- `tailwind.config.js` with Catppuccin plugin (v1.0.0, latest version)
- `bunfig.toml` configuration file
- Directory structure:
  - `src/build/`, `src/components/`, `src/config/`, `src/types/`, `src/assets/`
  - `blog/posts/2025/01/15/`, `blog/templates/`, `blog/tags/`
  - `public/assets/img/`
- Basic `src/build/index.ts` placeholder

**Installed dependencies (97 packages):**
- @catppuccin/tailwindcss@1.0.0
- @types/bun@1.3.5
- @types/node@20.19.27
- @types/react@18.3.27
- @types/react-dom@18.3.7
- autoprefixer@10.4.23
- postcss@8.5.6
- tailwindcss@3.4.19
- pagefind@1.4.0
- react@18.3.1
- react-dom@18.3.1

**Lessons learned:**
- @catppuccin/tailwindcss v0.7.0 does not exist; latest version is v1.0.0
- TypeScript `console.log` output may not be captured in bash when running Bun scripts
- Bun install completed successfully in 488ms (very fast)

**Status:** Foundation setup complete, build environment verified working.

