import { describe, it, expect } from 'bun:test';
import { Effect, Layer, ManagedRuntime } from "effect";
import { SiteConfigTag, type SiteConfig, site } from '../src/config/site';
import { renderHomePage, renderNotFoundPage } from '../src/build/pages';

// ── Default Config ──

describe('SiteConfigTag default layer', () => {
  const runtime = ManagedRuntime.make(SiteConfigTag.Live);

  it('should provide the default site config', async () => {
    const config = await runtime.runPromise(
      Effect.gen(function* () {
        return yield* SiteConfigTag;
      }),
    );
    expect(config.title).toBe(site.title);
    expect(config.description).toBe(site.description);
  });

  it('should have the expected navigation entries', async () => {
    const config = await runtime.runPromise(
      Effect.gen(function* () {
        return yield* SiteConfigTag;
      }),
    );
    expect(config.navigation).toHaveLength(5);
    expect(config.navigation[0].label).toBe("Home");
    expect(config.navigation[0].href).toBe("/");
  });
});

// ── Mock Config Injection ──

describe('SiteConfigTag mock injection', () => {
  const mockConfig: SiteConfig = {
    title: "Test Blog",
    description: "A test description",
    repository: "https://example.com/repo",
    author: { name: "Tester" },
    navigation: [
      { label: "Home", href: "/" },
    ],
  };

  const mockRuntime = ManagedRuntime.make(
    Layer.succeed(SiteConfigTag, mockConfig),
  );

  it('should inject a mock config via Layer', async () => {
    const config = await mockRuntime.runPromise(
      Effect.gen(function* () {
        return yield* SiteConfigTag;
      }),
    );
    expect(config.title).toBe("Test Blog");
    expect(config.description).toBe("A test description");
    expect(config.author.name).toBe("Tester");
  });

  it('should use mock config in renderHomePage', () => {
    const html = Effect.runSync(renderHomePage(mockConfig));
    expect(html).toContain("Test Blog");
    expect(html).toContain("A test description");
    expect(html).toContain("Tester");
    expect(html).not.toContain("Calvin Khor");
  });

  it('should use mock config in renderNotFoundPage', () => {
    const html = Effect.runSync(renderNotFoundPage(mockConfig));
    expect(html).toContain("404 - Test Blog");
    expect(html).not.toContain("Calvin Khor");
  });
});
