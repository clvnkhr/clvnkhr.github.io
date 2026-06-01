// date: 2026-06-01
// tags: blog, ai-assisted, redesign, typescript, typst, vibe-coding


#set document(title: "Blog Redesign: Effect-TS, Search, and What's New")
#title()

This is an updated description of the current features of this blog, following up on the #link("/blog/2026/01/07/blog-redesign/")[initial redesign post]. The biggest changes since then are the migration to Effect-TS for the build system, a client-side search bar on every post listing page, and a post-processing step that removes the need for a broken show rule in each typst document source. I'll also cover the supporting infrastructure that has grown around the build.

== Effect-TS Build System

The build pipeline was rewritten using #link("https://effect.website/")[Effect-TS], a TypeScript library for structured concurrency and typed error handling. The original pipeline ran each step sequentially — compile a post, wait, compile the next, wait. Switching to Effect made it trivial to compile all posts in parallel, dropping the full build time from about 15 seconds to under 2.

Here is the main build program. The key lines are the `Effect.all` blocks with `{ concurrency: "unbounded" }`:

```typescript
const buildBlog = (options: { watch: boolean }) =>
  Effect.gen(function* () {
    yield* Effect.log("🔨 Building blog...");
    yield* ensureFontsExist;
    yield* checkTypstVersion;

    const posts: Post[] = yield* discoverPosts;        // ← Effect.forEach(…, { concurrency: "unbounded" })

    const allColors = new Set(posts.flatMap((post) => post.svgColors ?? []));
    const allTags = new Set(posts.flatMap((post) => post.tags ?? []));
    const siteCfg = yield* SiteConfigTag;

    yield* setupDist;

    yield* Effect.all([                                 // ← parallel:
      step("🎨 Generating SVG color CSS...", generateSvgCss(allColors)),
      step("📦 Copying assets...", copyAssets),
      step("🔍 Generating 404 page...", generateNotFoundPage(siteCfg)),
    ], { concurrency: "unbounded" });

    yield* step("🎨 Building Tailwind CSS...", buildTailwind);

    yield* Effect.all([                                 // ← parallel:
      step("🏠 Generating homepage...", generateHomepage(siteCfg, posts)),
      step("📋 Generating blog index...", generateBlogIndex(siteCfg, posts)),
      step("📄 Generating post pages...", generatePostPages(siteCfg, posts)),
      step("🏷️  Generating tag pages...", generateTagPages(siteCfg, posts, allTags)),
    ], { concurrency: "unbounded" });

    yield* Effect.log("✅ Build complete!");
  });
```

The 7× speedup comes from three places: post compilation happens across all CPU cores, asset copying and CSS generation run side by side, and page rendering (homepage, blog index, every post, every tag page) all run concurrently. Effect's `{ concurrency: "unbounded" }` handles the scheduling without manual thread management.

Beyond speed, typed errors mean that a missing font directory, a failed `typst compile`, or an invalid metadata line all produce a distinct error type. The build either succeeds or tells you exactly what broke.

== Post-Processing Typst HTML Output

Typst's built-in `--format html` export produces clean HTML, but two things need fixing after compilation:

*Colour inversion* — Math equations are rendered as inline SVGs with hardcoded fill colours. Those colours work in light mode but are invisible on a dark background. A post-processing step collects every colour used across all SVGs, generates a CSS file that overrides them with Catppuccin theme variables, and the Tailwind build picks it up. The SVGs then adapt automatically to light or dark mode.

*Show-rule injection* — Each post needs the `html_fmt` show rule applied to convert math equations into framed SVGs. The build system prepends `#import "../typ-templates/html-fmt.typ": html_fmt` and `#show: html_fmt` before every compilation, so posts can be written as plain Typst without worrying about the boilerplate. This approach works for now but should become unnecessary once Typst's HTML export matures and handles math natively.

The Typst template uses the #link("https://github.com/typst/packages/tree/main/packages/preview/bullseye/0.1.0")[bullseye] package for show-target support, which lets the `html_fmt` rule target only the HTML backend without affecting PDF output. Individual posts also use #link("https://github.com/typst/packages/tree/main/packages/preview/quick-maths/0.2.1")[quick-maths], #link("https://github.com/typst/packages/tree/main/packages/preview/cmarker/0.1.8")[cmarker], #link("https://github.com/typst/packages/tree/main/packages/preview/mitex/0.2.6")[mitex], and #link("https://github.com/typst/packages/tree/main/packages/preview/lilaq/0.5.0")[lilaq] where needed.

== Tag System

Tags have been part of the blog since the original redesign. Each tag name hashes to one of twelve Catppuccin accent colours, so `blog` always appears in the same colour without any manual config. Every tag gets a dedicated page at `/tags/<tagname>/`, and the master index at `/tags/` shows every tag with its colour and post count.

== Client-Side Search

The blog index page has a search bar that performs real-time fuzzy matching across titles, descriptions, tags, and dates. It scores each field with different weights — title counts four times as much as the blurb — and reorders results so the best match ends up at the top. The same search bar now appears on every tag page too.

The tags index page has its own search that filters tags by name as you type. Both are plain JavaScript with zero dependencies.

== Fork It

The full source is at #link("https://github.com/clvnkhr/clvnkhr.github.io")[github.com/clvnkhr/clvnkhr.github.io]. If you want your own blog with this setup:

1. Fork the repo
2. Write posts as `.typ` files in `blog/posts/` with Typst comment metadata
3. Run `bun run build`
4. Deploy to GitHub Pages via the included workflow

The code is MIT. Pull requests are welcome — especially for new features or bug fixes.
