# Effect-TS Refactoring Opportunities

Opportunities to further use [Effect-TS](https://effect.website/) for improved testability, type safety, and robustness.

## High Priority

### 1. `parseMetadata` — Replace `new Date(NaN)` sentinel with typed error channel

**File:** `src/build/posts.ts:77`

**Problem:** Returns `date: date ?? new Date(NaN)`. The `NaN` date silently propagates as `/blog/NaN/NaN/NaN/slug/` in `loadPost` (`src/build/index.ts:112-114`).

**Fix:** Return `Effect.Effect<PostMetadata, MetadataParseError>` instead. `yield*` in `loadPost` propagates the error through Effect's typed channel.

**Status:** ✅ Done

---

### 2. Extract runtime creation for test isolation

**File:** `src/build/index.ts:324` → `src/build/runtime.ts`

**Problem:** `ManagedRuntime.make(BunContext.layer)` is a module-level singleton. Tests that need a custom runtime must create their own, but the singleton encourages coupling.

**Fix:** Extract runtime creation into a separate module or factory function so entrypoint and tests each create their own isolated runtime.

**Status:** ✅ Done — `src/build/runtime.ts` exports `makeRuntime()` factory. Entrypoint and integration tests each call the factory independently.

---

### 3. Extract CLI argument handling

**File:** `src/build/index.ts:326-329`

**Problem:** `process.argv.includes("--watch")` is untestable inline code inside `import.meta.main`.

**Fix:** Accept CLI args as a function parameter. Optionally use `@effect/cli` (available in `lib/effect/packages/cli/`).

---

## Medium Priority

### 4. Wrap configs in `Context.Tag` + `Layer`

**Files:** `src/config/site.ts`

**Problem:** Configs are static singletons. Tests cannot inject mock configs without modifying module state.

**Fix:** Wrap in `Context.Tag` + `Layer.succeed` so tests can `Layer.provide` mock configs.

**Status:** ✅ Done — `SiteConfigTag` with `Live` layer; all components accept optional `site` prop; build pipeline reads via Effect context; 5 tests covering default config, mock injection, and component rendering.

---

### 5. Wrap `renderToString` in `Effect.try`

**File:** `src/build/pages.tsx`

**Problem:** React SSR failures (`renderToString` throws) are untyped. Callers in `index.ts` handle them via Effect, but the error is a generic `unknown`.

**Fix:** Wrap each `renderToString` call in `Effect.try` with a typed `RenderError` class.

**Status:** ✅ Done — `RenderError` class with `_tag` discriminant; `render()` helper wraps `renderToString` in `Effect.try`; all render functions return `Effect<string, RenderError>`; callers in `index.ts` use `yield*`.

---

## Low Priority

### 6. Enhance `step` helper with structured logging

**File:** `src/build/index.ts:35-36`

**Problem:** `Effect.log` defaults to `LogLevel.Info` and lacks structured context.

**Fix:** Use `Effect.logInfo` + `Effect.annotateLogs` for richer build logs.

---

### 7. Replace `new Date().getFullYear()` in Footer

**File:** `src/components/Footer.tsx:24`

**Problem:** `new Date()` at build time is effectively deterministic but introduces a hidden dependency on the system clock.

**Fix:** Pass the year as a prop from the build pipeline, or add it to site config.
