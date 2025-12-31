# Blog Redesign Work Log

This file records all work done and lessons learned during the blog redesign project.

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

