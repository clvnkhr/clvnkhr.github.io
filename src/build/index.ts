import { Effect, pipe, ManagedRuntime } from "effect";
import { Command } from "@effect/platform";
import { BunContext } from "@effect/platform-bun";
import { readdir, stat } from "fs/promises";
import { join } from "path";
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

const toError = (e: unknown) => e instanceof Error ? e : new Error(String(e));

const run = (cmd: Command.Command) =>
  Command.exitCode(cmd).pipe(
    Effect.flatMap((code) =>
      Number(code) === 0
        ? Effect.void
        : Effect.fail(new Error(`Command failed with exit code ${String(code)}`)),
    ),
  );

// ── Build Steps ──

const ensureFontsExist = Effect.tryPromise({
  try: () => stat("fonts/LeteSansMath").then(() => { }),
  catch: toError,
});

const checkTypstVersion = Effect.gen(function* () {
  const expectedVersion = packageJson.engines?.typst;
  if (!expectedVersion) {
    yield* Effect.logWarning(
      "⚠️  No expected Typst version specified in package.json engines.typst",
    );
    return;
  }

  const version = yield* pipe(
    Command.string(Command.make("typst", "--version")),
    Effect.map((stdout) => {
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
    yield* Effect.logWarning("\n⚠️  WARNING: Typst version mismatch!");
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
  const entries = yield* Effect.tryPromise({
    try: () => readdir(postsDir),
    catch: toError,
  });
  const typFiles: string[] = entries.filter((e) => e.endsWith(".typ"));

  const results = yield* Effect.forEach(
    typFiles,
    (entry: string) =>
      pipe(
        Effect.gen(function* () {
          const typstPath = join(postsDir, entry);

          const content = yield* Effect.tryPromise({
            try: () => Bun.file(typstPath).text(),
            catch: toError,
          });

          const metadata = parseMetadata(content);
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
        }),
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
  Effect.tryPromise({
    try: () => {
      const css = generateSvgColorCss(Array.from(allColors));
      return Bun.write("src/assets/css/svg-colors.css", css);
    },
    catch: toError,
  });

const generateHomepage = (posts: Post[]) =>
  Effect.tryPromise({
    try: () => {
      const html = renderHomePage(posts.length > 0 ? posts[0] : undefined);
      return Bun.write("dist/index.html", html);
    },
    catch: toError,
  });

const generateBlogIndex = (posts: Post[]) =>
  Effect.tryPromise({
    try: () => {
      const html = renderBlogIndex(posts);
      return Bun.write("dist/blog/index.html", html);
    },
    catch: toError,
  });

const generatePostPages = (posts: Post[]) =>
  Effect.forEach(
    posts,
    (post: Post) =>
      Effect.tryPromise({
        try: () => {
          const html = renderPostPage(post, posts);
          return Bun.write(`dist${post.path}index.html`, html);
        },
        catch: toError,
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

    const tagsIndexHtml = renderTagsIndex(
      Array.from(allTags).sort(),
      tagPosts,
    );
    yield* Effect.tryPromise({
      try: () => Bun.write("dist/tags/index.html", tagsIndexHtml),
      catch: toError,
    });

    for (const tag of Array.from(allTags)) {
      const tagPostsList = posts.filter((post: Post) =>
        post.tags?.includes(tag),
      );
      const tagHtml = renderTagPage(tag, tagPostsList);
      yield* run(Command.make("mkdir", "-p", `dist/tags/${tag}`));
      yield* Effect.tryPromise({
        try: () => Bun.write(`dist/tags/${tag}/index.html`, tagHtml),
        catch: toError,
      });
    }
  });

const generateProjectsPage = Effect.tryPromise({
  try: () => {
    const html = renderProjectsPage();
    return Bun.write("dist/projects/index.html", html);
  },
  catch: toError,
});

const generateNotFoundPage = Effect.tryPromise({
  try: () => {
    const html = renderNotFoundPage();
    return Bun.write("dist/404.html", html);
  },
  catch: toError,
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

  yield* Effect.log("🎨 Generating SVG color CSS...");
  yield* generateSvgCss(allColors);

  yield* setupDist;

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

const runtime = ManagedRuntime.make(BunContext.layer as any);

export { buildBlog, runtime };
runtime.runPromise(buildBlog);
