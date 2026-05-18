import { Effect, Console, pipe } from "effect";
import { readdir, stat } from "fs/promises";
import { join } from "path";
import { parseMetadata, compileTypst } from "./posts";
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

const shell = (strings: TemplateStringsArray, ...args: Bun.ShellExpression[]) =>
  Effect.tryPromise({
    try: () => Bun.$(strings, ...args).quiet().then(() => {}),
    catch: toError,
  });

// ── Build Steps ──

const ensureFontsExist = Effect.tryPromise({
  try: () => stat("fonts/LeteSansMath").then(() => {}),
  catch: toError,
});

const checkTypstVersion = Effect.gen(function* () {
  const expectedVersion = packageJson.engines?.typst;
  if (!expectedVersion) {
    yield* Console.warn(
      "⚠️  No expected Typst version specified in package.json engines.typst",
    );
    return;
  }

  const version = yield* pipe(
    Effect.tryPromise({
      try: async () => {
        const result = await Bun.$`typst --version`.quiet();
        const match = result.stdout
          .toString()
          .match(/typst (\d+\.\d+\.\d+)/);
        return match?.[1] ?? null;
      },
      catch: toError,
    }),
    Effect.catchAll(() => Effect.succeed(null as string | null)),
  );

  if (!version) {
    yield* Console.warn("⚠️  Could not parse Typst version");
    return;
  }

  if (version !== expectedVersion) {
    yield* Console.warn("\n⚠️  WARNING: Typst version mismatch!");
    yield* Console.warn(`   Expected: ${expectedVersion}`);
    yield* Console.warn(`   Actual:   ${version}`);
    yield* Console.warn(
      "   This blog relies on Typst HTML export (experimental feature).",
    );
    yield* Console.warn(
      "   Unexpected version changes may break the build.\n",
    );
  } else {
    yield* Console.log(
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
        Effect.tryPromise<Post | null, Error>({
          try: async () => {
            const typstPath = join(postsDir, entry);
            const content = await Bun.file(typstPath).text();
            const metadata = parseMetadata(content);
            const typstResult = await compileTypst(typstPath);
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
          },
          catch: toError,
        }),
        Effect.catchAll((e: Error) => {
          Console.error(`Error processing ${entry}:`, e.message);
          return Effect.die(e);
        }),
      ),
  );

  const posts: Post[] = results.filter((p): p is Post => p !== null);
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  const hiddenPosts = posts.filter((p) => p.hidden);
  if (hiddenPosts.length > 0) {
    yield* Console.log(
      `🙈 Hidden posts: ${hiddenPosts.map((p) => p.title).join(", ")}`,
    );
  }

  return posts.filter((p) => !p.draft && !p.hidden);
});

const setupDist =
  shell`rm -rf dist && mkdir -p dist/blog dist/projects dist/assets/css dist/assets/img dist/assets/js dist/fonts`;

const copyAssets = Effect.gen(function* () {
  yield* shell`cp -r public/* dist/`;
  yield* shell`cp -r src/assets/js dist/assets/`;
});

const buildTailwind =
  shell`bunx @tailwindcss/cli -i src/assets/css/main.css -o dist/assets/css/main.css`;

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

    yield* shell`mkdir -p dist/tags`;

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
      yield* shell`mkdir -p dist/tags/${tag}`;
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
  yield* Console.log("🔨 Building blog...");
  yield* ensureFontsExist;

  yield* checkTypstVersion;

  const isWatchMode = process.argv.includes("--watch");

  const posts: Post[] = yield* discoverPosts;

  const allColors = new Set<string>();
  posts.forEach((post: Post) =>
    post.svgColors?.forEach((c: string) => allColors.add(c)),
  );

  yield* Console.log("🎨 Generating SVG color CSS...");
  yield* generateSvgCss(allColors);

  yield* setupDist;

  yield* Console.log("📦 Copying assets...");
  yield* copyAssets;

  yield* Console.log("🎨 Building Tailwind CSS...");
  yield* buildTailwind;

  yield* Console.log("🏠 Generating homepage...");
  yield* generateHomepage(posts);

  yield* Console.log("📋 Generating blog index...");
  yield* generateBlogIndex(posts);

  yield* Console.log("📄 Generating post pages...");
  yield* generatePostPages(posts);

  yield* Console.log("🏷️  Generating tag pages...");
  const allTags = new Set<string>();
  posts.forEach((post: Post) =>
    post.tags?.forEach((tag: string) => allTags.add(tag)),
  );
  yield* generateTagPages(posts, allTags);

  yield* Console.log("🚀 Generating projects page...");
  yield* generateProjectsPage;

  yield* Console.log("🔍 Generating 404 page...");
  yield* generateNotFoundPage;

  yield* Console.log("✅ Build complete!");
  yield* Console.log(
    `Generated: ${posts.length} post pages, 1 blog index, 1 homepage, ${allTags.size} tag pages, 1 tags index, 1 projects page, 1 404 page`,
  );

  if (!isWatchMode) {
    yield* Console.log("\n🌐 To view your blog:");
    yield* Console.log("   bun run serve     # Start local server");
    yield* Console.log("   Then visit: http://localhost:3000\n");
  }
});

export { buildBlog };
await Effect.runPromise(buildBlog);
