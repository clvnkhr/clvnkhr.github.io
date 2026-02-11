// date: 2026-01-07
// tags: blog, redesign, typescript, typst, vibe-coding

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "Blog Redesign")
#title()

This blog used to be a Jekyll site. I feel a strong need to practice and improve my writing, so I decided to leverage my programming skills plus the recent high quality LLM models to redesign my blog from the ground up.

We now have a custom static site generator built with Bun + TypeScript + Typst. The Typst part is a new feature that I am excited to use.Here's the blog post processing pipeline.

== Tech Stack

- Bun - Runtime, fast builds
- Typst 0.14.2 - Typesetting with HTML export
- TypeScript - Build scripts
- React - Page rendering
- Tailwind CSS v4 - Styling (Catppuccin theme)
- GitHub Pages - Deployment


== Design choices
Using Typst, math equations are formatted by wrapping them in ```typ html.frame``` blocks, which convert the inner content into SVGs. This allows for high quality rendering of mathematical content without relying on JavaScript libraries like MathJax or KaTeX.

A side effect is that we can use arbitrary fonts as long as they are present during the Typst compilation step. For this blog, I am using #link("https://github.com/abccsss/LeteSansMath")[Lete Sans Math] which pairs very nicely with #link("https://www.brailleinstitute.org/freefont/")[Atkinson Hyperlegible] for body text. Unforunately this means that we can't copy the math out as text but maybe this will improve in the future.

= Processing Pipeline


= Pre-Processing: Typst to HTML

Posts are written in Typst (`.typ` files) with metadata in comments:

```typst
// date: 2026-01-07
// tags: blog, techstack
// updated: 2026-01-08, 2026-01-10
// hidden: false
```

Each `.typ` file compiles to HTML using Typst's HTML export:

```bash
typst compile --format html --features html --root .. --font-path fonts/LeteSansMath ${typstFile} -
```

== Post-Processing: HTML to Pages

After Typst compilation:

1. Extract first `<h1>` as post title and strip it from HTML content
2. Extract SVG colors from embedded SVGs
3. Collect all unique colors across all posts
4. Generate CSS file with these colors
5. Include in Tailwind v4 build process
6. Generate HTML pages at `/blog/YEAR/MONTH/DAY/slug/`

= Example pages
- #link("/blog/2026/01/02/hello-typst/")[Hello Typst - basic example of features]
- #link("/tags/maths")[Posts tagged with `maths`]
