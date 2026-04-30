// date: 2026-04-30
// tags: maths, notation

#import "../templates/math.typ": html_fmt
#show: html_fmt



#set document(title: "Left and right acting derivatives")
#title()

Saw an interesting notation in this #link("https://math.stackexchange.com/questions/5134857/is-there-an-operator-theoretic-derivation-of-int-xn-eax-dx-using-a-finit")[Math Stackexchange answer]. I quote -
#let lD = $arrow.l("D")$
#let rD = $arrow.r("D")$

#quote[

  Eq. $(1)$ may be rewritten as $D(f dot g) = f(lD + rD)g$, where $lD$ acts on the left and $rD$ on the right, hence
  $
    D^n (f dot g) = f(lD + rD)^n g = sum_(k=0)^n binom(n, k) D^(n-k)f dot D^k g
  $
  by the binomial theorem $-$ which can be applied straightforwardly, since $lD$ and $rD$ commute. Now, this result can be extended to non-integer $n$ by using [generalized binomial coefficients][1], leading to the following von Neumann series :
  $
    "D"^alpha equiv sum_(k=0)^oo binom(alpha, k) lD^{alpha-k} rD^k
  $
  where the equivalent symbol means that the this relation has to be considered when applied to products of functions. Eq. $(3)$ corresponds with the case $alpha = 1$.

  As a final note, let's remark that the geometric expansion is recovered due to the fact that the exponential function is an eigenvector of the derivative operator, whence
  $
    D^(-1)(e^(a x)q) = e^(a x)(lD + rD)^(-1)q = e^(a x)(a + D)^(-1)q
  $
]
