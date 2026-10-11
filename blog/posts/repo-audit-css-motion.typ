// date: 2026-10-11
// tags: blog, infrastructure, typescript, typst, css, accessibility, github-actions, ai-assisted
// description: A repository audit covering shared search and card rendering, date handling, accessibility, build reliability, and CSS animations, with local validation results.

#set document(title: "Repository Audit: Cleaner Code and CSS Motion")
#title()

This post was written by the AI agent that carried out the audit. It records the implementation changes and the checks run locally.

The brief was to audit the repository for code smells, fix them, and add some stylish CSS animations. The work focused on the blog's own build code, components, browser scripts, tests, and deployment workflow. The existing Catppuccin palette, Typst posts, and native MathML rendering remain the foundation.

The most useful findings were duplicated code, dates that depended on the build machine's timezone, invalid HTML, incomplete failure handling, and tests that could pass without checking their intended behaviour. The visual changes add short entrances and interaction feedback throughout the site.

= Shared cards and search logic

The blog index used `PostCard`, but tag pages contained a separate copy of the card markup. Search attributes were also assembled independently on the two pages. This meant a change to a blurb, tag link, or date display needed to be repeated in several places.

A new `SearchablePostList` component now owns the list wrappers, searchable attributes, result status, and empty state. Both `BlogIndex` and `TagPage` use it, and every card is rendered through `PostCard`. Generated blurbs still preserve MathML for display; the search attribute contains the text of the blurb.

There was another duplication between the browser scripts and their tests. `src/assets/js/blog-search.js` contained a handwritten mirror of the functions in `src/utils/blog-search.ts`. The tag-search script similarly repeated `fuzzyMatch`. Tests exercised the TypeScript helpers, while the browser ran the copied implementations.

The browser scripts now import those helpers directly. A Bun build step bundles the three browser entry points into standalone scripts in `dist/assets/js`, including their shared TypeScript code. The existing deferred script tags load the bundles. ESLint now checks the browser scripts too; they were previously covered by the broad `src/assets/` ignore.

The scorer retains its field weights: title matches count four times as much as blurb or date matches, and tag matches count twice as much. An explicit empty-query case also prevents the empty-text calculation from producing `NaN`.

= Dates that stay on the same day

The old build derived URL folders with local-time getters such as `getDate()`, and `formatDate` used the machine's default timezone. A date stored as `2026-01-02` could consequently become January 1 on a machine west of UTC, changing both the displayed date and the generated URL.

URL generation now takes its calendar components from the ISO representation:

```typescript
const [year, month, day] = metadata.date
  .toISOString()
  .slice(0, 10)
  .split("-");
```

The display formatter explicitly uses `timeZone: 'UTC'`. Post cards, full posts, related-post links, and update history also include machine-readable timestamps on their `<time>` elements.

Metadata parsing is stricter and more predictable:

- Publication and update dates must be real calendar dates in `YYYY-MM-DD` form. Values such as `2026-02-30` fail instead of being silently normalised.
- Header comments tolerate indentation, blank lines, a leading byte-order mark, and comments without a space after `//`.
- Empty tags are removed, and duplicate tags are collapsed.
- Updates from the `date` line and explicit `updated` lines are merged, deduplicated, and sorted chronologically.
- `draft` and `hidden` accept only `true` or `false`, so a typo cannot silently change their meaning.
- Tags containing path separators, or consisting of `.` or `..`, are rejected before they are used to create output directories.

The heading helpers were also adjusted to recognise an `<h1>` whose content spans several lines. Title extraction and removal of the first heading now handle the same shape of HTML.

= Filtering without surprising empty pages

The saved hidden-tag preferences belong to the blog index, where the checkboxes are visible. Previously, the search script loaded those preferences on tag pages as well. Hiding a tag on the index could make its dedicated page appear empty, even though that page offered no controls for restoring the hidden posts.

The script now loads saved hidden tags only when tag toggles are present. A dedicated tag page shows its own posts and lets the text search narrow them down.

Filtering data is stored as a JSON array rather than a space-separated string. A tag such as `functional analysis` therefore remains one tag. Tag links use a shared URL helper that encodes the name and adds the trailing slash; spaces and characters such as `#` no longer alter the meaning of the link. Build-time tag counts use a `Map`, which also handles names such as `__proto__` as ordinary keys.

The browser caches each card's searchable fields once, trims the query, and moves cards only when their order actually changes. Clearing the query restores the original chronological order. Both post and tag searches provide an explicit empty message and a `role="status"` result count for assistive technology.

= HTML, keyboard access, and theme cleanup

`Layout` already supplied the page's `<main>` element, but the blog index added another one inside it. The inner wrapper is now a regular `<div>`, leaving one main landmark. A skip link leads to that landmark, the navigation has an accessible name, and search inputs have explicit labels and `type="search"`.

The automatic focus on search fields was removed. Navigation and date rows can wrap on narrow screens, and interactive elements have a visible keyboard-focus outline.

The update-history tooltip had two problems: it put block elements inside a `<span>`, and it compared `Date` objects by identity. Two objects representing the same publication date could therefore be treated as distinct updates. The replacement uses native `<details>` and `<summary>` elements, compares timestamps, deduplicates the history, and chooses the latest update after sorting. The disclosure can be opened from the keyboard as well as by clicking.

Theme handling now follows the system preference without a hardcoded `dark` class or an inline style assigning a colour scheme to every element. The root declares `color-scheme: light dark`. The blockquote rule's incorrect `--ctp-text` reference was corrected to `--color-ctp-text`, and unnecessary prose `!important` overrides were removed.

= CSS motion in the existing palette

The animations are implemented in `src/assets/css/main.css`, using the existing theme variables. They cover a few distinct interactions:

- Page content fades in with a 12-pixel upward entrance over 480 milliseconds.
- List items enter over 520 milliseconds, staggered in 60-millisecond increments. The delay is capped at 300 milliseconds, including for longer post and tag lists.
- The header's thin gradient accent draws across the page over 900 milliseconds.
- The homepage title has a single 1.6-second gradient sweep, with a soft static glow behind the introduction.
- Navigation underlines scale into view on hover or keyboard focus.
- Cards lift by four pixels on devices with a fine pointer and hover support, revealing a gradient accent and a subtle shadow. Keyboard focus also reveals the accent.
- Tag links gain a soft background, and the back-to-top arrow nudges upward on hover or focus.

There are no continuously looping animations. Filtering adds an `is-filtering` class that disables list entrances, so changing a search or checkbox does not keep replaying the reveal. Entrance animations use a backwards fill mode, allowing their animation styles to disappear when the entrance finishes.

Motion preferences are part of the implementation. Entrance keyframes are applied only within `prefers-reduced-motion: no-preference`. With reduced motion enabled, transitions become immediate, cards do not lift, and the back-to-top button scrolls instantly. The title also falls back to readable system-coloured text in forced-colour mode.

The shared entrance looks like this:

```css
@keyframes content-enter {
  from { opacity: 0; translate: 0 12px; }
  to { opacity: 1; translate: 0 0; }
}
```

The #link("/")[homepage], #link("/blog/")[blog index], and #link("/tags/")[tag index] show the effects in context.

= Build failures and reproducible deployment

The Typst compile step previously read stdout through `Command.string` without checking the process's exit code. A failed command could reach the HTML-processing stage, where a missing-body error obscured the original failure.

Compilation now starts the process explicitly, drains stdout and stderr concurrently, and checks the exit code. A nonzero exit produces `TypstCompileFailed` with the exit code and captured diagnostics. Temporary source files are cleaned up on both successful and failed compilation. Draining both pipes while waiting also avoids a verbose process blocking on an unread pipe.

Post filenames are sorted before discovery, and compilation is limited to four concurrent jobs. Other independent build steps still run in parallel. This bounds the number of Typst processes as the collection of posts grows; no performance improvement was claimed or benchmarked.

The GitHub Pages workflow now reads the Typst version from `package.json` and downloads that exact release. It uses `bun install --frozen-lockfile`, runs the test suite after the build, and skips the deployment job for pull requests. The deployment notes were updated to match.

Tailwind's source scanning is now limited to the component directory through its CSS configuration. The unused older `tailwind.config.js`, the stylesheet backup, and the temporary `tmp-managed.ts` experiment were removed.

= What was verified

The existing suite passed 162 tests before the audit. After the changes, 172 tests passed across 12 files. The full suite was also run with `TZ=America/Los_Angeles`, including the real build integration checks, to exercise the timezone fix.

New or strengthened checks cover invalid dates and booleans, tag paths and encoding, metadata normalisation, multiline headings, finite search scores, single main landmarks, search labels and status, update-history ordering, and Typst failure diagnostics and cleanup.

Two theme tests had been looking for slash-containing post paths among the immediate children of `dist`. When they found none, they returned successfully without testing the post. They now read a real generated post directly. The hidden-post checks were also changed to use actual hidden titles and an actual hidden post path.

The production build, TypeScript checks, ESLint, workflow YAML parsing, and diff whitespace checks passed. Manual browser checks covered the desktop layout and a 375-pixel mobile viewport, search empty states, date search, show-all and hide-all filtering, independent tag pages, and fuzzy tag search. The inspected pages had no horizontal overflow or browser console errors. These were local checks, not a claim of exhaustive browser or accessibility testing.

There is one version detail to keep explicit: the installed local CLI was Typst `0.15.1`, while `package.json` specifies `0.15.0`. Local builds passed with the existing version warning; the revised CI workflow selects `0.15.0`. The audit did not run a hosted GitHub Actions deployment or verify the build locally with that exact pinned Typst version.
