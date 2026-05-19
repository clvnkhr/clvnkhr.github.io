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

const run = (cmd: Command.Command) =>
  Command.exitCode(cmd).pipe(
    Effect.flatMap((code) =>
      code === 0
        ? Effect.void
        : Effect.fail(new Error(`Command failed with exit code ${code}`)),
    ),
  );

// ── Build Steps ──

const ensureFontsExist = Effect.gen(function* () {
  const fs = yield* FileSystem;
  yield* fs.stat("fonts/LeteSansMath");
});

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

        const fs = yield* FileSystem;
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

const setupDist = Effect.gen(function* () {
  yield* run(Command.make("rm", "-rf", "dist"));
  yield* run(
    Command.make(
      "mkdir", "-p",
      "dist/blog", "dist/projects", "dist/assets/css", "dist/assets/img", "dist/assets/js", "dist/fonts",
    ),
  );
});

const copyAssets = Effect.gen(function* () {
  yield* run(
    Command.make("cp", "-r", "public/*", "dist/").pipe(Command.runInShell(true)),
  );
  yield* run(
    Command.make("cp", "-r", "src/assets/js", "dist/assets/"),
  );
});

const buildTailwind =
  run(Command.make("bunx", "@tailwindcss/cli", "-i", "src/assets/css/main.css", "-o", "dist/assets/css/main.css"));

const generateSvgCss = (allColors: Set<string>) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const css = generateSvgColorCss(Array.from(allColors));
    yield* fs.writeFileString("src/assets/css/svg-colors.css", css);
  });

const generateHomepage = (posts: Post[]) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const html = renderHomePage(posts.length > 0 ? posts[0] : undefined);
    yield* fs.writeFileString("dist/index.html", html);
  });

const generateBlogIndex = (posts: Post[]) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const html = renderBlogIndex(posts);
    yield* fs.writeFileString("dist/blog/index.html", html);
  });

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

const generateTagPages = (posts: Post[], allTags: Set<string>) =>
  Effect.gen(function* () {
    const tagPosts: Record<string, number> = {};
    posts.forEach((post: Post) => {
      post.tags?.forEach((tag: string) => {
        tagPosts[tag] = (tagPosts[tag] || 0) + 1;
      });
    });

    yield* run(Command.make("mkdir", "-p", "dist/tags"));

    const fs = yield* FileSystem;
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
          yield* run(Command.make("mkdir", "-p", `dist/tags/${tag}`));
          yield* fs.writeFileString(`dist/tags/${tag}/index.html`, tagHtml);
        }),
      { concurrency: "unbounded" },
    );
  });

const generateProjectsPage = Effect.gen(function* () {
  const fs = yield* FileSystem;
  const html = renderProjectsPage();
  yield* fs.writeFileString("dist/projects/index.html", html);
});

const generateNotFoundPage = Effect.gen(function* () {
  const fs = yield* FileSystem;
  const html = renderNotFoundPage();
  yield* fs.writeFileString("dist/404.html", html);
});

// ── Main Build Program ──

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
