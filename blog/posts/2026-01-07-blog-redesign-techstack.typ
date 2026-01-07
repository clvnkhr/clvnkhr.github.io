// date: 2026-01-07
// tags: blog, redesign, typescript, typst

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "Blog Redesign: Tech Stack Overview")
#title()

We now have a custom static site generator built with Bun + TypeScript + Typst. Here's the blog post processing pipeline.

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

= Post-Processing: HTML to Pages

After Typst compilation:

1. Extract first `<h1>` as post title and strip it from HTML content
2. Extract SVG colors from embedded SVGs
3. Collect all unique colors across all posts
4. Generate CSS file with these colors
5. Include in Tailwind v4 build process
6. Generate HTML pages at `/blog/YEAR/MONTH/DAY/slug/`

= Tech Stack

- Bun - Runtime, build tool
- Typst 0.14.2 - Typesetting with HTML export
- TypeScript - Build scripts
- React - Page rendering
- Tailwind CSS v4 - Styling (Catppuccin theme)
- GitHub Pages - Deployment

