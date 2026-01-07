// Global Typst template for math show rules
// This file is imported by all blog posts to handle HTML export

#let html_fmt(it) = {
  show math.equation: it => context {
    set text(font: "Lete Sans Math")
    // Only wrap in frame when exporting to HTML
    if target() == "html" {
      // Wrap inline equations in a box to prevent paragraph interruption
      // Wrap display equations in a centered span
      show: if it.block {
        it => html.span(
          style: "display: block; text-align: center; margin: 1em 0;",
          it,
        )
      } else { box }
      html.frame(it)
    } else {
      it
    }
  }
  it
}
