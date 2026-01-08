# Blog Redesign Work Log

This file records all work done and lessons learned during blog redesign project.

---

## 2026-01-07 14:25: Font Submodule Handling & New Blog Post

**Work Completed:**
1. Created new blog post about blog redesign tech stack
2. Fixed font submodule automatic retrieval
3. Updated GitHub Actions to fetch submodules

### Blog Post Created

**File:** `blog/posts/2026-01-07-blog-redesign-techstack.typ`

**Content Overview:**
- Explains custom static site generator built with Bun + TypeScript
- Documents Typst pre-processing pipeline (metadata parsing, HTML compilation, title extraction)
- Documents post-processing (H1 extraction, SVG color collection, CSS generation, page rendering)
- Lists tech stack: Bun, Typst 0.14.2, TypeScript, React, Tailwind CSS v4, GitHub Pages
- Explains why Typst was chosen (superior math support vs Markdown)

**Post Structure:**
- Pre-Processing: Typst to HTML
- Post-Processing: HTML to Pages
- Tech Stack (terse list)
- Why Typst?
- Conclusion

### Font Submodule Issue Fixed

**Problem:**
- Blog post builds failed with "font LeteMath cannot be found"
- `fonts/LeteSansMath` is a git submodule
- Submodule wasn't being cloned in CI/CD or fresh clones

**Solution 1: GitHub Actions Update**
```yaml
# .github/workflows/deploy.yml
- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: true  # Added to fetch submodules
```

**Solution 2: Build Script Enhancement**

Added `ensureFontsExist()` function to `src/build/index.ts`:

```typescript
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
```

**Build Script Flow Updated:**
1. `ensureFontsExist()` - Check/clone fonts
2. `checkTypstVersion()` - Verify Typst version
3. ... rest of build

**Why This Approach:**
- Local development: Works with existing submodule
- CI/CD: GitHub Actions fetches submodules automatically
- Fresh clones: Build script attempts git submodule update first, then direct clone as fallback
- Robust: Handles both git submodule errors and missing directory cases

### Files Modified

1. **blog/posts/2026-01-07-blog-redesign-techstack.typ** (NEW)
   - Tech stack overview blog post
   - Focus on Typst pre/post-processing pipeline

2. **.github/workflows/deploy.yml**
   - Added `submodules: true` to checkout step

3. **src/build/index.ts**
   - Added `ensureFontsExist()` function
   - Integrated into build flow (runs before version check)

### Lessons Learned

**Git Submodules in CI/CD:**
- GitHub Actions requires explicit `submodules: true` in checkout step
- Without this, submodules are not fetched
- Builds fail if they depend on submodule resources

**Font Dependency Management:**
- Fonts as git submodules work well for version control
- Need robust handling for different environments
- Fallback strategy (git submodule → direct clone) ensures availability

**Blog Post Structure:**
- Terse is better for non-Typst sections
- Detailed only for unique/important features (Typst pipeline)
- Lists work better than prose for tech stack

### Status

**Font Handling:** ✅ Working
- GitHub Actions: Clones submodules correctly
- Local development: Uses existing submodule
- Fresh clones: Auto-clones via build script

**New Blog Post:** ✅ Published
- Available at `/blog/2026/01/07/2026-01-07-blog-redesign-techstack/`
- Tech stack documented
- Processing pipeline explained

---

## 2026-01-07 15:14: Blog Post Content Styling Improvements

**Work Completed:**
1. Fixed metadata parsing to stop at first non-comment line
2. Updated link styling in blog posts
3. Updated blockquote styling in blog posts
4. Updated code block styling with dynamic background color

### Metadata Parsing Fix

**Problem:**
- Blog post metadata parser was extracting content from code examples within posts
- Only 2 out of 4 tags were being parsed (blog, techstack instead of blog, redesign, typescript, typst)
- Date was being incorrectly extracted from code examples later in the content

**Root Cause:**
- Original parser used `content.match(/^\/\/.*$/gm)` to find all comment lines globally
- This matched `//` comments in code blocks, not just metadata at the top
- No check to stop parsing when hitting non-comment content

**Solution:**
```typescript
// src/build/posts.ts
export function parseMetadata(content: string): PostMetadata {
  const metadata: Record<string, any> = {};

  // Parse metadata from comment block at the top of the file
  // Stop at first non-comment line (metadata is only at the very beginning)
  const lines = content.split('\n');

  for (const line of lines) {
    // Stop parsing at first non-comment line (allow #import in metadata section)
    if (!line.startsWith('//') && !line.startsWith('#import')) {
      break;
    }

    // Only process metadata from // lines, not #import
    if (!line.startsWith('//')) {
      continue;
    }

    const parts = line.replace('// ', '').split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();

      // Parse specific metadata fields...
    }
  }

  return metadata as PostMetadata;
}
```

**Key Changes:**
- Replaced global regex match with line-by-line iteration
- Added explicit `break` at first non-comment line (allowing `#import` in metadata section)
- Only process metadata from `//` comment lines, skipping `#import` statements
- All metadata fields now only parse from top comment block

**Files Modified:**
- `src/build/posts.ts` - Rewrote `parseMetadata()` function

**Result:**
- All 4 tags now correctly parsed: blog, redesign, typescript, typst
- Date correctly extracted from metadata at top of file
- No metadata extracted from code examples in post content

### Link Styling Updates

**Changes Made:**
```css
/* src/assets/css/main.css */
.prose a {
  color: var(--color-ctp-mauve) !important;
  font-weight: normal !important;
  text-decoration: none !important;
}

.prose a:hover {
  opacity: 0.8 !important;
}
```

**Styling Behavior:**
- Links now use mauve color (respects dark/light mode via `--color-ctp-mauve`)
- Font weight is normal (not bold)
- No underline
- 80% opacity on hover
- Matches homepage link styling

**Why `!important`:**

---

## 2026-01-07 16:00: Tag Page Card Styling Update

**Work Completed:**
1. Updated tag page card layout to match blog index
2. Added blurb display to tag pages
3. Added all tags display to tag pages
4. Added update dates tooltip to tag pages

**Problem:**
- Tag pages showed minimal post information (date, title, description only)
- No blurb fallback when description was missing
- No tags displayed on tag page cards
- No update dates tooltip
- Inconsistent card styling compared to blog index

**Solution:**

**Updated `src/components/TagPage.tsx`:**

```tsx
import { formatDate } from '../utils/date';
import { getPostBlurb } from '../utils/post';
import { UpdateDatesTooltip } from './UpdateDatesTooltip';

// In JSX:
<div className="space-y-8">  // Changed from space-y-6
  {posts.map((post) => (
    <article key={post.slug} className="border border-ctp-surface1 rounded-lg p-6 hover:border-ctp-mauve transition-colors">
      <div className="flex items-center gap-4 mb-3">
        <time className="text-ctp-subtext0 text-sm">
          {formatDate(post.date)}
        </time>
        <UpdateDatesTooltip
          updated={post.updated}
          date={post.date}
          formatDate={formatDate}
        />
      </div>
      <h2 className="text-2xl font-bold mb-3">
        <a href={post.path} className="text-ctp-text hover:text-ctp-mauve transition-colors">
          {post.title}
        </a>
      </h2>
      {(post.description || post.htmlContent) && (
        <p className="text-ctp-subtext0 mb-4">
          {post.description || getPostBlurb(post.htmlContent)}
        </p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <a key={tag} href={`/tags/${tag}`} className={`px-3 py-1 text-sm transition-colors ${getTagColorClass(tag)}`}>
              {tag}
            </a>
          ))}
        </div>
      )}
    </article>
  ))}
</div>
```

**Changes Made:**
1. **Removed local formatDate function** - Use shared utility from `utils/date`
2. **Added imports** - `formatDate`, `getPostBlurb`, `UpdateDatesTooltip`
3. **Updated card spacing** - Changed from `space-y-6` to `space-y-8` (matches blog index)
4. **Added update dates tooltip** - Replace plain text with `UpdateDatesTooltip` component
5. **Added blurb display** - Falls back to `getPostBlurb(post.htmlContent)` when no description
6. **Added all tags display** - Shows all post tags with colored links (matches blog index)

**Tag Page Card Now Shows:**
- ✅ Date
- ✅ Update dates with tooltip
- ✅ Title link
- ✅ Blurb (description or auto-generated)
- ✅ All tags with colored links
- ✅ Border card with hover effect
- ✅ Consistent spacing (space-y-8)

### Files Modified

1. **src/components/TagPage.tsx**
   - Imported shared utilities (`formatDate`, `getPostBlurb`)
   - Imported `UpdateDatesTooltip` component
   - Updated card layout to match blog index
   - Added blurb and tags display
   - Replaced plain text update date with tooltip

### Benefits

**Consistency:**
- Tag pages now match blog index card styling
- Uniform post cards across all views (blog, tags)
- Same spacing, layout, and features

**Information Density:**
- More context per post (blurb, tags)
- Better for browsing related content
- Easier to identify relevant posts

**User Experience:**
- Update dates tooltip provides context about post freshness
- Tags help find related content
- Blurbs help quickly scan post relevance

### Status

**Tag Pages:** ✅ Updated
- Card styling matches blog index
- All post information displayed (date, title, blurb, tags)
- Update dates tooltip working
- Build successful

