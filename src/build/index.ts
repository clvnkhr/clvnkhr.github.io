import { Effect, ManagedRuntime } from "effect";
import { Command } from "@effect/platform";
import { FileSystem } from "@effect/platform/FileSystem";
import { BunContext } from "@effect/platform-bun";
import { Path } from "@effect/platform/Path";
import { compileTypst, parseMetadata } from "./posts";
import {
  renderHomePage,
  renderBlogIndex,
  renderPostPage,
  renderTagPage,
  renderTagsIndex,
  renderProjectsPage,
  renderNotFoundPage,
} from "./pages";
import { Post } from "../types/post";
import { extractTitleFromHtml, stripFirstHeading } from "../utils/post";
import { generateSvgColorCss } from "../utils/svg-colors";
import packageJson from "../../package.json" with { type: "json" };

// ── Helpers ──

/** Run a shell command and fail if it returns non-zero. */
const run = (cmd: Command.Command) =>
  Command.exitCode(cmd).pipe(
    Effect.flatMap((code) =>
      code === 0
        ? Effect.void
        : Effect.fail(new Error(`Command failed with exit code ${code}`)),
    ),
  );

// ── Build Steps ──

/** Fail if the LeteSansMath font directory is missing. */
const ensureFontsExist = Effect.gen(function* () {
  const fs = yield* FileSystem;
  yield* fs.stat("fonts/LeteSansMath");
});

/** Log a warning if the installed Typst version doesn't match package.json. */
const checkTypstVersion = Effect.gen(function* () {
  const expectedVersion = packageJson.engines?.typst;
  if (!expectedVersion) {
    yield* Effect.logWarning(
      "⚠️  No expected Typst version specified in package.json engines.typst",
    );
    return;
  }

  const version = yield* Command.string(Command.make("typst", "--version"))
    .pipe(
      Effect.map((stdout: string) => {
        const match = stdout.match(/typst (\d+\.\d+\.\d+)/);
        return match?.[1] ?? null;
      }),
      Effect.catchAll(() => Effect.succeed(null as string | null)),
    );

  if (!version) {
    yield* Effect.logWarning("⚠️  Could not parse Typst version");
    return;
  }

  if (version !== expectedVersion) {
    yield* Effect.logWarning("⚠️  WARNING: Typst version mismatch!");
    yield* Effect.logWarning(`   Expected: ${expectedVersion}`);
    yield* Effect.logWarning(`   Actual:   ${version}`);
    yield* Effect.logWarning(
      "   This blog relies on Typst HTML export (experimental feature).",
    );
    yield* Effect.logWarning(
      "   Unexpected version changes may break the build.\n",
    );
  } else {
    yield* Effect.log(
      `✅ Typst version ${version} matches expected ${expectedVersion}`,
    );
  }
});

/** Parse all .typ posts, compile them, and return non-draft/non-hidden posts sorted by date. */
const discoverPosts = Effect.gen(function* () {
  const postsDir = "blog/posts";
  const fs = yield* FileSystem;
  const path = yield* Path;
  const entries = yield* fs.readDirectory(postsDir);
  const typFiles: string[] = entries.filter((e) => e.endsWith(".typ"));

  const results = yield* Effect.forEach(
    typFiles,
    (entry: string) =>
      Effect.gen(function* () {
        const typstPath = path.join(postsDir, entry);
        const content = yield* fs.readFileString(typstPath);

        const metadata = parseMetadata(content);

        if (!metadata.draft && !metadata.hidden) {
          const hasImport = /^\s*#import "\.\.\/templates\/math\.typ": html_fmt\s*$/m.test(content);
          const hasShow = /^\s*#show: html_fmt\s*$/m.test(content);
          if (!hasImport || !hasShow) {
            const missing = [
              !hasImport ? '#import "../templates/math.typ": html_fmt' : null,
              !hasShow ? "#show: html_fmt" : null,
            ].filter(Boolean).join(" and ");
            return yield* Effect.fail(
              new Error(`${entry}: missing required template ${missing}. Post must include both lines.`),
            );
          }
        }

        const typstResult = yield* compileTypst(typstPath);
        const title = extractTitleFromHtml(typstResult.html);
        if (!title) return null;

        const slug = entry.replace(".typ", "");
        const year = metadata.date.getFullYear();
        const month = String(metadata.date.getMonth() + 1).padStart(2, "0");
        const day = String(metadata.date.getDate()).padStart(2, "0");

        return {
          ...metadata,
          title,
          slug,
          path: `/blog/${year}/${month}/${day}/${slug}/`,
          htmlContent: stripFirstHeading(typstResult.html),
          svgColors: typstResult.svgColors,
        } as Post;
      }).pipe(
        Effect.catchAll((e: Error) =>
          Effect.logError(`Error processing ${entry}:`, e.message).pipe(
            Effect.zipRight(Effect.die(e)),
          ),
        ),
      ),
    { concurrency: "unbounded" },
  );

  const posts: Post[] = results.filter((p): p is Post => p !== null);
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  const hiddenPosts = posts.filter((p) => p.hidden);
  if (hiddenPosts.length > 0) {
    yield* Effect.log(
      `🙈 Hidden posts: ${hiddenPosts.map((p) => p.title).join(", ")}`,
    );
  }

  return posts.filter((p) => !p.draft && !p.hidden);
});

/** Wipe the dist directory and recreate the output folder structure. */
const setupDist = Effect.gen(function* () {
  const fs = yield* FileSystem;
  yield* fs.remove("dist", { recursive: true, force: true });
  yield* fs.makeDirectory("dist/blog", { recursive: true });
  yield* fs.makeDirectory("dist/projects", { recursive: true });
  yield* fs.makeDirectory("dist/assets/css", { recursive: true });
  yield* fs.makeDirectory("dist/assets/img", { recursive: true });

  yield* fs.makeDirectory("dist/fonts", { recursive: true });
});

/** Copy public/ contents and src/assets/js into dist/. */
const copyAssets = Effect.gen(function* () {
  const fs = yield* FileSystem;
  const publicEntries = yield* fs.readDirectory("public");
  yield* Effect.forEach(
    publicEntries,
    (entry) => fs.copy(`public/${entry}`, `dist/${entry}`, { overwrite: true }),
    { concurrency: "unbounded" },
  );
  yield* fs.copy("src/assets/js", "dist/assets/js", { overwrite: true });
});

/** Compile Tailwind CSS to dist/assets/css/main.css. */
const buildTailwind =
  run(Command.make("bunx", "@tailwindcss/cli", "-i", "src/assets/css/main.css", "-o", "dist/assets/css/main.css"));

/** Generate SVG color utility CSS from colors used across all posts. */
const generateSvgCss = (allColors: Set<string>) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const css = generateSvgColorCss(Array.from(allColors));
    yield* fs.writeFileString("src/assets/css/svg-colors.css", css);
  });

/** Write the homepage with the most recent post featured. */
const generateHomepage = (posts: Post[]) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const html = renderHomePage(posts.length > 0 ? posts[0] : undefined);
    yield* fs.writeFileString("dist/index.html", html);
  });

/** Write the blog listing page. */
const generateBlogIndex = (posts: Post[]) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const html = renderBlogIndex(posts);
    yield* fs.writeFileString("dist/blog/index.html", html);
  });

/** Write each post's individual page. */
const generatePostPages = (posts: Post[]) =>
  Effect.forEach(
    posts,
    (post: Post) =>
      Effect.gen(function* () {
        const fs = yield* FileSystem;
        const html = renderPostPage(post, posts);
        const dir = `dist${post.path}`;
        yield* fs.makeDirectory(dir, { recursive: true });
        yield* fs.writeFileString(`${dir}index.html`, html);
      }),
  );

/** Write the tags index and a page per tag. */
const generateTagPages = (posts: Post[], allTags: Set<string>) =>
  Effect.gen(function* () {
    const tagPosts: Record<string, number> = {};
    posts.forEach((post: Post) => {
      post.tags?.forEach((tag: string) => {
        tagPosts[tag] = (tagPosts[tag] || 0) + 1;
      });
    });

    const fs = yield* FileSystem;
    yield* fs.makeDirectory("dist/tags", { recursive: true });
    const tagsIndexHtml = renderTagsIndex(
      Array.from(allTags).sort(),
      tagPosts,
    );
    yield* fs.writeFileString("dist/tags/index.html", tagsIndexHtml);

    yield* Effect.forEach(
      Array.from(allTags),
      (tag: string) =>
        Effect.gen(function* () {
          const tagPostsList = posts.filter((post: Post) =>
            post.tags?.includes(tag),
          );
          const tagHtml = renderTagPage(tag, tagPostsList);
          yield* fs.makeDirectory(`dist/tags/${tag}`, { recursive: true });
          yield* fs.writeFileString(`dist/tags/${tag}/index.html`, tagHtml);
        }),
      { concurrency: "unbounded" },
    );
  });

/** Write the projects page. */
const generateProjectsPage = Effect.gen(function* () {
  const fs = yield* FileSystem;
  const html = renderProjectsPage();
  yield* fs.writeFileString("dist/projects/index.html", html);
});

/** Write the custom 404 page. */
const generateNotFoundPage = Effect.gen(function* () {
  const fs = yield* FileSystem;
  const html = renderNotFoundPage();
  yield* fs.writeFileString("dist/404.html", html);
});

// ── Main Build Program ──

/** Orchestrate the full blog build pipeline. */
const buildBlog = Effect.gen(function* () {
  yield* Effect.log("🔨 Building blog...");
  yield* ensureFontsExist;

  yield* checkTypstVersion;

  const isWatchMode = process.argv.includes("--watch");

  const posts: Post[] = yield* discoverPosts;

  const allColors = new Set<string>();
  posts.forEach((post: Post) =>
    post.svgColors?.forEach((c: string) => allColors.add(c)),
  );

  yield* setupDist;

  yield* Effect.log("🎨 Generating SVG color CSS...");
  yield* generateSvgCss(allColors);

  yield* Effect.log("📦 Copying assets...");
  yield* copyAssets;

  yield* Effect.log("🎨 Building Tailwind CSS...");
  yield* buildTailwind;

  yield* Effect.log("🏠 Generating homepage...");
  yield* generateHomepage(posts);

  yield* Effect.log("📋 Generating blog index...");
  yield* generateBlogIndex(posts);

  yield* Effect.log("📄 Generating post pages...");
  yield* generatePostPages(posts);

  yield* Effect.log("🏷️  Generating tag pages...");
  const allTags = new Set<string>();
  posts.forEach((post: Post) =>
    post.tags?.forEach((tag: string) => allTags.add(tag)),
  );
  yield* generateTagPages(posts, allTags);

  yield* Effect.log("🚀 Generating projects page...");
  yield* generateProjectsPage;

  yield* Effect.log("🔍 Generating 404 page...");
  yield* generateNotFoundPage;

  yield* Effect.log("✅ Build complete!");
  yield* Effect.log(
    `Generated: ${posts.length} post pages, 1 blog index, 1 homepage, ${allTags.size} tag pages, 1 tags index, 1 projects page, 1 404 page`,
  );

  if (!isWatchMode) {
    yield* Effect.log("🌐 To view your blog:");
    yield* Effect.log("   bun run serve     # Start local server");
    yield* Effect.log("   Then visit: http://localhost:3000\n");
  }
});

const runtime = ManagedRuntime.make(BunContext.layer);

export { buildBlog, runtime };

if (import.meta.main) {
  runtime.runPromise(buildBlog);
}
