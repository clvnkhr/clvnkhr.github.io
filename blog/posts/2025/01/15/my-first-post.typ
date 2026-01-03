// date: 2025-01-15, 2026-01-02
// tags: tutorial, typst, test

#import "../../../../templates/math.typ": html_math

#show: html_math

#set document(title: "My First Typst Post")
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

Code block:
```typst
#set: text(fill: red)
#let a = 5
#let b = 10
$a+b=#{a+b}$
```

#image("../../../../img/image-9.jpg", width: 300pt)

= Conclusion

That's how Typst math rendering works with HTML export!

