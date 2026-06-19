// date: 2026-06-19
// tags: blog, typst, mathml, typescript, ai-assisted, migration


#set document(title: "Typst 0.15 Migration Summary")
#title()

(this document was 100% AI agent generated with supervision)

The #link("https://typst.app/blog/2026/typst-0.15/")[Typst 0.15 release] changed the most important part of this blog's rendering pipeline: HTML export now emits native MathML for equations. Before this migration, I was using a show rule that wrapped each equation in `html.frame`, which made Typst render math as inline SVG. That worked visually, but it also meant math was basically an image: harder to copy, less semantic, and tied to Typst's SVG output details.

The goal of the migration was to stop doing that. The blog should compile Typst directly to HTML, let Typst emit MathML, keep Lete Sans Math as the math font, and preserve the small amount of SVG handling still needed for diagrams and images.

= The main change

The old HTML formatting template had a show rule like this:

```typst
#show math.equation: show-target(
  html: eq => {
    set text(font: "Lete Sans Math")
    show: if eq.block { span_center } else { box }
    html.frame(eq)
  },
)
```

That is now gone entirely. There is no `html_fmt` template and no injected show rule in the build path anymore.

The compile command also became simpler. We no longer pass the math font to Typst during compilation:

```bash
typst compile --format html --features html --root .. ${typstFile} -
```

Instead, the build copies `fonts/LeteSansMath` into `dist/fonts/LeteSansMath`, and CSS applies the font to MathML:

```css
math {
  font-family: 'Lete Sans Math', math;
  color: var(--color-ctp-text);
}
```

This is the right ownership boundary: Typst produces semantic MathML, while the site stylesheet decides how MathML should look in the browser.

I also deleted the old one-off `migrate-posts.ts` helper while doing this cleanup. It was a historical Jekyll-to-Typst migration script, and it still generated stale `html_fmt` boilerplate. Keeping it around would have made the new pipeline look more complicated than it is.

= SVG fallout

Removing `html.frame` also removed the old `.typst-frame` wrapper. Most math is no longer SVG at all, but the site can still contain SVGs from other Typst features, diagrams, figures, or generated assets.

So the SVG color rules moved from this shape:

```css
.typst-frame [fill="#000000"] { ... }
```

to this broader prose-scoped shape:

```css
.prose svg [fill="#000000"] { ... }
```

The generated dark-mode SVG color CSS changed the same way. This keeps the old dark-mode grayscale inversion behavior for remaining SVGs without pretending every equation is still a Typst frame.

= Browser MathML fixes

Native MathML is a better target than SVG, but it also exposed browser behavior that the old image pipeline had hidden.

== Block math in Chrome

At first, I styled display equations with:

```css
.prose math[display="block"] {
  display: block;
}
```

That was wrong. In Chrome, overriding a MathML root to plain CSS block layout can destroy the internal math layout. A display equation like

$
  norm(B v) <= alpha norm(A v) + C norm(v)
$

was rendered as a vertical stack of tokens even though the viewport had plenty of room.

The fix was to preserve the MathML display type:

```css
.prose math[display="block"] {
  display: block math;
  overflow-x: auto;
  overflow-y: hidden;
  text-align: center;
  white-space: nowrap;
}
```

`display: block math` is the important bit. The element participates as a block, but Chrome still lays out the inside as MathML.

== Delimiters

The SVG output used to bake delimiter sizes into the image. With MathML, the browser decides whether operators stretch. That exposed a bunch of over-eager stretching: ordinary parentheses, norm bars, and absolute-value bars were too tall in expressions like

$
  |b(v)| <= eta q_A(v) + kappa norm(v)^2.
$

But not all large delimiters are wrong. In

$
  abs(integral_(RR^d) V |f|^2)
$

the outer absolute-value bars really should stretch around the integral.

The build now has a small MathML post-pass that walks simple `<mrow>` fences. It marks simple delimiters as `stretchy="false"` for cases like `(v)`, `norm(v)`, `|b(v)|`, and `bangle(u,v)`, while leaving expressions containing tall structures such as fractions, roots, tables/cases, limits, sums, products, and integrals alone.

This is deliberately not a general MathML renderer. It is just a cleanup step for the shapes Typst 0.15 currently emits and Chrome currently stretches too aggressively.

== Overlines

Typst 0.15's MathML export currently drops `overline(...)`. The workaround is to inject a small compatibility definition before compiling the temporary Typst file used by the build:

```typst
#let overline = math.macron
```

This shadows `overline` for the HTML build without rewriting the post body. The source can keep saying `overline(...)`, while Typst emits the same `<mover>` shape that `macron(...)` would have produced.

There was one more browser detail: Typst emitted the accent as a combining macron:

```html
<mover accent="true">
  ...
  <mo>̄</mo>
</mover>
```

In Chrome this sat too high above the base. The post-processing step normalizes that specific accent to the spacing macron:

```html
<mover accent="true">
  ...
  <mo>¯</mo>
</mover>
```

The result is visually much closer to the old overline output.

= Tests

The tests changed from expecting SVG-backed equations to expecting MathML:

- the Typst version check now expects `0.15.0`
- integration tests check for `<math` and `display="block"`
- theme tests check the MathML font and `display: block math`
- post-processing tests cover the injected `overline` compatibility definition, overline accent normalization, and delimiter stretch rules
- SVG color tests now expect `.prose svg` selectors instead of `.typst-frame`

The real build also needed a slightly longer integration-test timeout. Typst 0.15 plus full post generation can take more than the previous default in CI-like runs, so the integration test file now sets a 30 second timeout.

= Result

The migration removes the equation-as-SVG workaround and makes math part of the HTML document again. The remaining custom code is mostly defensive glue around young browser MathML behavior:

- keep Lete Sans Math through CSS
- preserve MathML layout with `display: block math`
- prevent unwanted delimiter stretching
- patch the current `overline` export gap
- keep SVG color handling only for the SVGs that remain

That feels like the right direction. The core rendering path now follows Typst 0.15's HTML model instead of routing every equation through an image export escape hatch.
