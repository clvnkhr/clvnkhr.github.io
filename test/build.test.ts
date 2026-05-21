import { describe, it, expect } from 'bun:test';
import { Effect, Layer, Logger, ManagedRuntime } from "effect";
import { FileSystem } from "@effect/platform/FileSystem";
import { SystemError } from "@effect/platform/Error";
import { BunContext } from "@effect/platform-bun";
import { buildBlog } from '../src/build/index.js';

const runtime = ManagedRuntime.make(BunContext.layer);

describe('Build System Integration', () => {
  it('should initialize build system without errors', async () => {
    await runtime.runPromise(buildBlog({ watch: false }));
  });

  it('should log build initialization messages', async () => {
    const logs: Array<string> = [];

    const testLogger = Logger.make((options) => {
      logs.push(String(options.message));
    });

    await buildBlog({ watch: false }).pipe(
      Effect.provide(Logger.replace(Logger.defaultLogger, testLogger)),
      runtime.runPromise,
    );

    expect(logs.length).toBeGreaterThan(0);
    expect(logs.some(log => log.includes('Building blog'))).toBe(true);
  });
});

describe('MissingFontsDirectory', () => {
  it('should raise MissingFontsDirectory when fonts directory is missing', async () => {
    const mockFs = new Proxy({} as FileSystem, {
      get(_target, prop) {
        if (prop === 'stat') {
          return (path: string) =>
            Effect.fail(
              new SystemError({
                reason: "NotFound",
                module: "FileSystem",
                method: "stat",
                pathOrDescriptor: path,
              }),
            );
        }
        return () => Effect.die(`unexpected FileSystem.${String(prop)} call`);
      },
    });

    const testRuntime = ManagedRuntime.make(
      Layer.mergeAll(BunContext.layer, Layer.succeed(FileSystem, mockFs)),
    );

    const result = await testRuntime.runPromise(
      buildBlog({ watch: false }).pipe(
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
    const mockFs = new Proxy({} as FileSystem, {
      get(_target, prop) {
        if (prop === 'stat') {
          return (_path: string) =>
            Effect.fail(
              new SystemError({
                reason: "NotFound",
                module: "FileSystem",
                method: "stat",
                pathOrDescriptor: "fonts/LeteSansMath",
              }),
            );
        }
        return () => Effect.die(`unexpected FileSystem.${String(prop)} call`);
      },
    });

    const testRuntime = ManagedRuntime.make(
      Layer.mergeAll(BunContext.layer, Layer.succeed(FileSystem, mockFs)),
    );

    await expect(
      testRuntime.runPromise(buildBlog({ watch: false })),
    ).rejects.toThrow();
  });
});
