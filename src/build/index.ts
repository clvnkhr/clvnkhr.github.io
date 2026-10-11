import { Effect } from "effect";
import { Command } from "@effect/platform";
import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import { compileTypst, parseMetadata, processTypstOutput } from "./posts";
import {
  renderHomePage,
  renderBlogIndex,
  renderPostPage,
  renderTagPage,
  renderTagsIndex,
  renderNotFoundPage,
} from "./pages";
import { Post } from "../types/post";
import { extractTitleFromHtml, stripFirstHeading } from "../utils/post";
import { generateSvgColorCss } from "../utils/svg-colors";
import { SiteConfigTag, type SiteConfig } from "../config/site";
import { makeRuntime } from "./runtime";
import packageJson from "../../package.json" with { type: "json" };

// ── Domain Errors ──

export class MissingFontsDirectory {
  readonly _tag = "MissingFontsDirectory";
  constructor(readonly path: string) { }
}

export class CommandFailed {
  readonly _tag = "CommandFailed";
  constructor(readonly name: string, readonly exitCode: number) { }
}

// ── Helpers ──

const step = <A, E, R>(label: string, effect: Effect.Effect<A, E, R>) =>
  Effect.log(label).pipe(Effect.zipRight(effect));

const runNamed = (name: string, cmd: Command.Command) =>
  Command.exitCode(cmd).pipe(
    Effect.andThen((code) =>
      code === 0
        ? Effect.void
        : Effect.fail(new CommandFailed(name, code)),
    ),
  );

// ── Build Steps ──

const ensureFontsExist = FileSystem.pipe(
  Effect.andThen((fs) => fs.stat("fonts/LeteSansMath")),
  Effect.mapError(() => new MissingFontsDirectory("fonts/LeteSansMath")),
  Effect.asVoid,
);

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



const loadPost = (postsDir: string, entry: string) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const path = yield* Path;

    const typstPath = path.join(postsDir, entry);
    const content = yield* fs.readFileString(typstPath);
    const metadata = yield* parseMetadata(content);

    const rawHtml = yield* compileTypst(typstPath, content);
    const typstResult = yield* processTypstOutput(typstPath, rawHtml);
    const title = extractTitleFromHtml(typstResult.html);
    if (!title) return null;

    const slug = entry.slice(0, -".typ".length);
    const [year, month, day] = metadata.date.toISOString().slice(0, 10).split("-");

    return {
      ...metadata,
      title,
      slug,
      path: `/blog/${year}/${month}/${day}/${slug}/`,
      htmlContent: stripFirstHeading(typstResult.html),
      svgColors: typstResult.svgColors,
    } satisfies Post;
  });

const discoverPosts = Effect.gen(function* () {
  const fs = yield* FileSystem;
  const postsDir = "blog/posts";
  const entries = yield* fs.readDirectory(postsDir);
  const typFiles = entries.filter((e) => e.endsWith(".typ") && !e.startsWith(".")).sort();

  const maybePosts = yield* Effect.forEach(
    typFiles,
    (entry) =>
      loadPost(postsDir, entry).pipe(
        Effect.tapError((e) =>
          Effect.logError(`Error processing ${entry}: ${String(e)}`),
        ),
      ),
    { concurrency: 4 },
  );

  const posts = maybePosts.filter((p) => p !== null);

  const hiddenPosts = posts.filter((p) => p.hidden);
  if (hiddenPosts.length > 0) {
    yield* Effect.log(
      `🙈 Hidden posts: ${hiddenPosts.map((p) => p.title).join(", ")}`,
    );
  }

  return posts
    .filter((p) => !p.draft && !p.hidden)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
});

const setupDist = Effect.gen(function* () {
  const fs = yield* FileSystem;
  yield* fs.remove("dist", { recursive: true, force: true });
  yield* fs.makeDirectory("dist/blog", { recursive: true });

  yield* fs.makeDirectory("dist/assets/css", { recursive: true });
  yield* fs.makeDirectory("dist/assets/img", { recursive: true });

  yield* fs.makeDirectory("dist/fonts", { recursive: true });
});

const copyAssets = Effect.gen(function* () {
  const fs = yield* FileSystem;
  const publicEntries = yield* fs.readDirectory("public");
  yield* Effect.forEach(
    publicEntries,
    (entry) => fs.copy(`public/${entry}`, `dist/${entry}`, { overwrite: true }),
    { concurrency: "unbounded" },
  );
  yield* fs.copy("fonts/LeteSansMath", "dist/fonts/LeteSansMath", { overwrite: true });
});

const buildBrowserScripts = runNamed(
  "browser scripts",
  Command.make(
    "bun", "build", "--target", "browser", "--format", "iife",
    "--outdir", "dist/assets/js",
    "src/assets/js/back-to-top.js",
    "src/assets/js/tag-search.js",
    "src/assets/js/blog-search.js",
  ),
);

const buildTailwind = runNamed(
  "tailwind",
  Command.make(
    "bunx",
    "@tailwindcss/cli",
    "-i",
    "src/assets/css/main.css",
    "-o",
    "dist/assets/css/main.css",
  ),
);

const generateSvgCss = (allColors: Set<string>) =>
  FileSystem.pipe(
    Effect.andThen((fs) =>
      fs.writeFileString(
        "src/assets/css/svg-colors.css",
        generateSvgColorCss(Array.from(allColors)),
      ),
    ),
  );

const generateHomepage = (siteCfg: SiteConfig, posts: Post[]) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const html = yield* renderHomePage(siteCfg, posts.length > 0 ? posts[0] : undefined);
    yield* fs.writeFileString("dist/index.html", html);
  });

const generateBlogIndex = (siteCfg: SiteConfig, posts: Post[]) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const html = yield* renderBlogIndex(siteCfg, posts);
    yield* fs.writeFileString("dist/blog/index.html", html);
  });

const generatePostPages = (siteCfg: SiteConfig, posts: Post[]) =>
  Effect.forEach(
    posts,
    (post: Post) =>
      Effect.gen(function* () {
        const fs = yield* FileSystem;
        const html = yield* renderPostPage(siteCfg, post, posts);
        const dir = `dist${post.path}`;
        yield* fs.makeDirectory(dir, { recursive: true });
        yield* fs.writeFileString(`${dir}index.html`, html);
      }),
  );

const generateTagPages = (siteCfg: SiteConfig, posts: Post[], allTags: Set<string>) =>
  Effect.gen(function* () {
    const tagCounts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags ?? []) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      }
    }
    const tagPosts = Object.fromEntries(tagCounts);

    const fs = yield* FileSystem;
    yield* fs.makeDirectory("dist/tags", { recursive: true });
    const tagsIndexHtml = yield* renderTagsIndex(
      siteCfg,
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
          const tagHtml = yield* renderTagPage(siteCfg, tag, tagPostsList);
          yield* fs.makeDirectory(`dist/tags/${tag}`, { recursive: true });
          yield* fs.writeFileString(`dist/tags/${tag}/index.html`, tagHtml);
        }),
      { concurrency: "unbounded" },
    );
  });

const generateNotFoundPage = (siteCfg: SiteConfig) =>
  Effect.gen(function* () {
    const fs = yield* FileSystem;
    const html = yield* renderNotFoundPage(siteCfg);
    yield* fs.writeFileString("dist/404.html", html);
  });

// ── Main Build Program ──

const buildBlog = (options: { watch: boolean }) =>
  Effect.gen(function* () {
    yield* Effect.log("🔨 Building blog...");
    yield* ensureFontsExist;
    yield* checkTypstVersion;

    // 1. Compile all posts: typst → HTML (body + remaining SVG colors)
    const posts: Post[] = yield* discoverPosts;

    // Aggregate per-post SVG colors for dark-mode inversion CSS
    const allColors = new Set(posts.flatMap((post) => post.svgColors ?? []));
    const allTags = new Set(posts.flatMap((post) => post.tags ?? []));

    // Read site config from Effect context
    const siteCfg = yield* SiteConfigTag;

    // 2. Set up output directory and static assets
    yield* setupDist;

    // Can run in parallel — no dependency between these
    yield* Effect.all([
      step("🎨 Generating SVG color CSS...", generateSvgCss(allColors)),
      step("📦 Copying assets...", copyAssets),
      step("✨ Bundling browser scripts...", buildBrowserScripts),
      step("🔍 Generating 404 page...", generateNotFoundPage(siteCfg)),
    ], { concurrency: "unbounded" });

    // Tailwind must finish before pages use its CSS
    yield* step("🎨 Building Tailwind CSS...", buildTailwind);

    // 3. Generate pages — all depend on Tailwind CSS being ready
    yield* Effect.all([
      step("🏠 Generating homepage...", generateHomepage(siteCfg, posts)),
      step("📋 Generating blog index...", generateBlogIndex(siteCfg, posts)),
      step("📄 Generating post pages...", generatePostPages(siteCfg, posts)),
      step("🏷️  Generating tag pages...", generateTagPages(siteCfg, posts, allTags)),
    ], { concurrency: "unbounded" });

    yield* Effect.log("✅ Build complete!");
    yield* Effect.log(
      `Generated: ${posts.length} post pages, 1 blog index, 1 homepage, ${allTags.size} tag pages, 1 tags index, 1 404 page`,
    );

    if (!options.watch) {
      yield* Effect.log("🌐 To view your blog:");
      yield* Effect.log("   bun run serve     # Start local server");
      yield* Effect.log("   Then visit: http://localhost:3000\n");
    }
  });

const runtime = makeRuntime();

if (import.meta.main) {
  const watch = process.argv.includes("--watch");
  runtime.runPromise(buildBlog({ watch }));
}

export { buildBlog, runtime };
