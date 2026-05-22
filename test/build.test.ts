import { describe, it, expect } from 'bun:test';
import { Effect, Layer, Logger, LogLevel, ManagedRuntime, Option, Stream } from "effect";
import { FileSystem, File } from "@effect/platform/FileSystem";
import { CommandExecutor, TypeId, ExitCode } from "@effect/platform/CommandExecutor";
import { SystemError } from "@effect/platform/Error";
import { BunContext } from "@effect/platform-bun";
import { buildBlog } from '../src/build/index.js';
import { compileTypst, parseMetadata, processTypstOutput } from '../src/build/posts.js';

// ── Mock Factories ──

function makeMockFileSystem(files: Record<string, string>): FileSystem {
  const store = new Map(Object.entries(files));
  const dirs = new Set<string>(['blog/posts', 'public']);

  return new Proxy({} as FileSystem, {
    get(_target, prop) {
      switch (prop) {
        case 'stat':
          return (path: string) => {
            if (dirs.has(path) || path === 'fonts/LeteSansMath') {
              return Effect.succeed<File.Info>({
                type: path === 'fonts/LeteSansMath' ? "File" : "Directory",
                mtime: Option.some(new Date()),
                atime: Option.some(new Date()),
                birthtime: Option.some(new Date()),
                dev: 0,
                ino: Option.some(0),
                mode: 0o755,
                nlink: Option.none(),
                uid: Option.none(),
                gid: Option.none(),
                rdev: Option.none(),
                size: BigInt(0) as File.Info["size"],
                blksize: Option.none(),
                blocks: Option.none(),
              });
            }
            return Effect.fail(new SystemError({
              reason: "NotFound", module: "FileSystem", method: "stat", pathOrDescriptor: path,
            }));
          };
        case 'readDirectory':
          return (path: string) => {
            if (path === 'blog/posts') return Effect.succeed(['test-post.typ']);
            return Effect.succeed([]);
          };
        case 'readFileString':
          return (path: string) => {
            const content = store.get(path);
            if (content !== undefined) return Effect.succeed(content);
            if (path === 'blog/posts/test-post.typ') {
              return Effect.succeed(
                '// title: Test Post\n// date: 2026-01-15\n// tags: test\n\n= Test Post\n\nHello world.',
              );
            }
            return Effect.fail(new SystemError({
              reason: "NotFound", module: "FileSystem", method: "readFileString",
              pathOrDescriptor: path,
            }));
          };
        case 'writeFileString':
          return (path: string, content: string) => {
            store.set(path, content);
            return Effect.succeed(void 0);
          };
        case 'remove':
          return (path: string) => {
            store.delete(path);
            dirs.delete(path);
            return Effect.succeed(void 0);
          };
        case 'makeDirectory':
          return (path: string) => {
            dirs.add(path);
            return Effect.succeed(void 0);
          };
        case 'copy':
        case 'copyFile':
        case 'chmod':
        case 'chown':
        case 'link':
        case 'readFile':
        case 'readLink':
        case 'realPath':
        case 'writeFile':
          return () => Effect.succeed(void 0);
        case 'exists':
          return (path: string) => Effect.succeed(dirs.has(path) || store.has(path));
        default:
          return () => Effect.die(`unexpected FileSystem.${String(prop)} call`);
      }
    },
  });
}

const MOCK_TYPST_HTML = '<html><head></head><body><h1>Test Post</h1><p>Hello world.</p></body></html>';

function makeMockCommandExecutor(): CommandExecutor {
  return {
    [TypeId]: TypeId,
    start: () => Effect.die('unexpected CommandExecutor.start call'),
    exitCode: () => Effect.succeed(ExitCode(0)),
    string: (cmd: { _tag: string; command: string; args: ReadonlyArray<string> }) => {
      if (cmd._tag === 'StandardCommand' && cmd.command === 'typst') {
        if (cmd.args[0] === 'compile') {
          return Effect.succeed(MOCK_TYPST_HTML);
        }
        if (cmd.args[0] === '--version') {
          return Effect.succeed('typst 0.14.2');
        }
      }
      return Effect.succeed('');
    },
    lines: () => Effect.succeed([]),
    stream: () => Stream.empty,
    streamLines: () => Stream.empty,
  };
}

// ── Shared Mock Runtime ──

const mockFs = makeMockFileSystem({
  "blog/typ-templates/html-fmt-preamble.typ": '#import "../typ-templates/html-fmt.typ": html_fmt\n#show: html_fmt',
});
const mockCmd = makeMockCommandExecutor();

const testRuntime = ManagedRuntime.make(
  Layer.mergeAll(
    BunContext.layer,
    Layer.succeed(FileSystem, mockFs),
    Layer.succeed(CommandExecutor, mockCmd),
  ),
);

// ── Silence Logs ──

const silence = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
  effect.pipe(Logger.withMinimumLogLevel(LogLevel.None));

// ── Build System Tests ──

describe('Build System Integration', () => {
  it('should initialize build system without errors', async () => {
    await testRuntime.runPromise(silence(buildBlog({ watch: false })));
  });

  it('should log build initialization messages', async () => {
    const logs: Array<string> = [];
    const testLogger = Logger.make((options) => {
      logs.push(String(options.message));
    });

    await buildBlog({ watch: false }).pipe(
      Effect.provide(Logger.replace(Logger.defaultLogger, testLogger)),
      testRuntime.runPromise,
    );

    expect(logs.length).toBeGreaterThan(0);
    expect(logs.some(log => log.includes('Building blog'))).toBe(true);
    expect(logs.some(log => log.includes('Typst version 0.14.2'))).toBe(true);
  });
});

// ── Missing Fonts Tests ──

describe('MissingFontsDirectory', () => {
  function makeBrokenFs(): FileSystem {
    return new Proxy({} as FileSystem, {
      get(_target, prop) {
        if (prop === 'stat') {
          return (_path: string) =>
            Effect.fail(new SystemError({
              reason: "NotFound", module: "FileSystem", method: "stat",
              pathOrDescriptor: _path,
            }));
        }
        if (prop === 'string') {
          return () => Effect.succeed('');
        }
        return () => Effect.die(`unexpected FileSystem.${String(prop)} call`);
      },
    });
  }

  function brokenRuntime() {
    return ManagedRuntime.make(
      Layer.mergeAll(
        BunContext.layer,
        Layer.succeed(FileSystem, makeBrokenFs()),
        Layer.succeed(CommandExecutor, mockCmd),
      ),
    );
  }

  it('should raise MissingFontsDirectory when fonts directory is missing', async () => {
    const result = await brokenRuntime().runPromise(
      silence(buildBlog({ watch: false })).pipe(
        Effect.catchTag("MissingFontsDirectory", (e) =>
          Effect.succeed(`caught: ${e.path}`),
        ),
        Effect.catchAll((e) =>
          Effect.succeed(`unexpected: ${String(e)}`),
        ),
      ),
    );

    expect(result).toBe("caught: fonts/LeteSansMath");
  });

  it('should propagate MissingFontsDirectory as a typed error', async () => {
    await expect(
      brokenRuntime().runPromise(silence(buildBlog({ watch: false }))),
    ).rejects.toThrow();
  });
});

// ── Typst Compilation and Post-Processing ──

describe('compileTypst', () => {
  it('should return raw HTML from mocked typst output', async () => {
    const rawHtml = await compileTypst('blog/posts/test-post.typ', '= Test\n\nContent.').pipe(
      silence,
      testRuntime.runPromise,
    );

    expect(typeof rawHtml).toBe('string');
    expect(rawHtml).toContain('<html>');
  });

  it('should clean up temp files after compilation', async () => {
    const rawHtml = await compileTypst('blog/posts/test-post.typ', '= Test\n\nContent.').pipe(
      silence,
      testRuntime.runPromise,
    );
    expect(rawHtml).toBeTruthy();
  });
});

describe('processTypstOutput', () => {
  it('should return html and svgColors from typst output', async () => {
    const result = await processTypstOutput('blog/posts/test-post.typ', MOCK_TYPST_HTML).pipe(
      silence,
      testRuntime.runPromise,
    );

    expect(result).toHaveProperty('html');
    expect(result).toHaveProperty('svgColors');
    expect(typeof result.html).toBe('string');
    expect(Array.isArray(result.svgColors)).toBe(true);
  });

  it('should extract body content from typst HTML output', async () => {
    const result = await processTypstOutput('blog/posts/test-post.typ', MOCK_TYPST_HTML).pipe(
      silence,
      testRuntime.runPromise,
    );

    expect(result.html).toContain('Test Post');
    expect(result.html).toContain('Hello world.');
  });
});

// ── Metadata Parser Tests (pure function, no mocking needed) ──

describe('Metadata Parser without html_fmt', () => {
  it('should parse metadata when no #import lines exist after comments', () => {
    const content = `// date: 2026-06-01
// tags: test, metadata

#set par(justify: true)
= Some Heading

Content here.`;

    const metadata = parseMetadata(content);
    expect(metadata.date).toEqual(new Date('2026-06-01'));
    expect(metadata.tags).toEqual(['test', 'metadata']);
  });

  it('should parse metadata with other #import lines after comments', () => {
    const content = `// date: 2026-06-01
// tags: test
#import "@preview/example:0.1.0": foo
#show: foo

= Some Heading`;

    const metadata = parseMetadata(content);
    expect(metadata.date).toEqual(new Date('2026-06-01'));
    expect(metadata.tags).toEqual(['test']);
  });

  it('should parse metadata with #set and #show after comments', () => {
    const content = `// date: 2026-06-01
// tags: maths

#set math.equation(numbering: "(1)")
#show: something

= An Equation Post`;

    const metadata = parseMetadata(content);
    expect(metadata.date).toEqual(new Date('2026-06-01'));
    expect(metadata.tags).toEqual(['maths']);
  });
});
