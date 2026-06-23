// date: 2026-06-23
// tags: blog, infrastructure, typescript, typst, github-actions, ai-assisted


#set document(title: "Blog Infra Notes, June 2026")
#title()

(Again an AI post...)

Infra changes from the last twenty-ish commits, excluding post content. Scope: deployment, search/filtering, Typst HTML output, layout, and MathML blurbs.

== Deployment

`bcc536e0b` updated the GitHub Pages actions: `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and `actions/deploy-pages@v5`.

`ffdec5f15` updated `actions/checkout@v5`, moved Bun setup to `oven-sh/setup-bun@v2`, and pinned Bun to `1.3.14` instead of `latest` for reproducible builds.

== Search and filtering

`3d1d3f8b4` added the blog search bar to tag pages, making each tag page a searchable filtered list.

`16362a39b` added formatted dates to search scoring, alongside title, tags, and blurb. It also added autofocus on tag-page search.

`03292060f` added blog-index tag filters: a checkbox side panel, hidden-tag persistence in `localStorage`, combined tag/text filtering, score-based search ordering, and "Show all" / "Hide all" controls.

== Typst output cleanup

`eca425c33` fixed a Mobile Safari SVG issue from the old Typst HTML path. Safari did not reliably cascade CSS fill through `<use>` shadow DOM into `<symbol>` paths, so the post-pass rewrote black `fill` and `stroke` attributes on `<use>` elements to `currentColor`. CSS then set `.typst-frame` color explicitly.

`03292060f` normalized theorem-like Typst blocks emitted as `figure > div > figcaption`. The post-pass recognizes labels including Theorem, Lemma, Definition, Example, and Proof, rewrites those wrappers to `.typst-theorem`, leaves ordinary figures alone, and adds CSS for margins and inline labels.

== Typst 0.15

`4dfd37736` did the main Typst 0.15 migration; `421831f16` simplified it afterward. Details are in #link("/blog/2026/06/19/typst-0-15-migration_summary/")[Typst 0.15 Migration Summary]. Infra summary:

- `4dfd37736`: bump the required Typst version to `0.15.0`, copy `fonts/LeteSansMath` into `dist`, style native MathML with CSS, move remaining SVG color rules from `.typst-frame` to `.prose svg`, add MathML delimiter and overline post-processing, and update tests to expect MathML instead of SVG-backed equations.
- `421831f16`: remove the now-empty `html_fmt` template and stale `migrate-posts.ts`, then replace source-level `overline(...)` rewriting with a compile-time compatibility preamble: `#let overline = math.macron`.

Net effect: Typst now owns HTML math output; site CSS and post-processing handle browser rough edges.

== Prose and layout

`19a0f9d03` added `text-wrap: pretty` and `hyphens: auto` to prose. Headings and blockquotes use `text-wrap: balance` with hyphenation disabled.

`69612ba4e` recentered the blog index after the tag-filter sidebar landed: spare column on the left, content in the middle, tag controls on the right at large viewport sizes.

== Blurbs after MathML

`263c02d8e` fixed MathML blurbs. `getPostBlurb` was stripping all tags, so blurbs containing equations lost their markup. It now preserves `<math>...</math>` blocks while stripping other HTML. `PostCard` and `TagPage` render generated blurbs as HTML when they come from post content.

The same commit keeps `data-search-blurb` plain-text by stripping tags after generating the display blurb. Cards display MathML; search indexes text.

== The pattern

- let Typst 0.15 produce semantic MathML instead of forcing equations through SVG
- keep browser-specific cleanup isolated in the build post-pass
- make list pages searchable and filterable
- keep deployment versions explicit

The writing surface stays simple: make a `.typ` file, add metadata comments, and let the build pipeline handle the fussy parts.
