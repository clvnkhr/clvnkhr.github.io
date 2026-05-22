#import "@preview/bullseye:0.1.0": *

// Global Typst template for HTML export show rules

#let span_center(it) = html.span(
  style: "display: block; text-align: center; mx-auto",
  it,
)


#let html_fmt(it) = {
  show math.equation: show-target(
    html: eq => {
      set text(font: "Lete Sans Math")
      show: if eq.block { span_center } else { box }
      html.frame(eq)
    },
  )
  it
}

