// date: 2026-01-02
// tags: typst, test, ai-assisted

#import "../templates/math.typ": html_fmt
#show: html_fmt

#import "@preview/lilaq:0.5.0" as lq


#set document(title: "Hello Typst")
#title()

This is a sample blog post written in Typst format.

= Introduction

Welcome to new blog system! This post demonstrates how Typst files work.

= Basic Math

Here's an inline equation: $x^2 + y^2 = z^2$

And here's a display equation:

$
  integral_(-oo)^oo e^(-x^2) dif x = sqrt(pi)
$

= Other Features

== Code block:
```typst
#set: text(fill: red)
#let a = 5
#let b = 10
$a+b=#{a+b}$
```

== Image:
#image("../img/image-9.jpg", width: 300pt)

== Third party library usage

#let xs = (0, 1, 2, 3, 4)


#html.frame(lq.diagram(
  title: [Precious data],
  xlabel: $x$,
  ylabel: $y$,

  lq.plot(xs, (3, 5, 4, 2, 3), mark: "s", label: [A]),
  lq.plot(
    xs,
    x => 2 * calc.cos(x) + 3,
    mark: "o",
    label: [B],
  ),
))

= Conclusion

That's how Typst math rendering works with HTML export!

