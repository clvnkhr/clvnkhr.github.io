// date: 2026-05-07
// tags: maths, functional-analysis, notes, rough
// hidden: true

#set par(justify: true)
// #set page(fill: red.darken(70%))
// #set text(fill: white.darken(10%))

#title("Notes on Lewin Ch2: Self-adjointness")

#import "../templates/math.typ": html_fmt
// #show: html_fmt


#import "@preview/quick-maths:0.2.1": shorthands

#show: shorthands.with(
  ($+-$, $plus.minus$),
  ($=<$, $arrow.double.l$),
  ($<~$, $≲$),
  ($>~$, $≳$),
)
#let hbar = [\u{0127}]
#let grad = $nabla$
#let dd = $dif$
#let del = $partial$
#let infty = $oo$ // for the poor LLM that keeps trying to use latex's \infty
#let Subset = $subset.double$
#let ran = math.op("ran")

#let bangle(..xs) = {
  math.lr(
    math.chevron.l + xs.pos().intersperse([, #math.thin]).join() + math.chevron.r,
  )
}
#let fH = $frak(H)$
Let $fH$ be a separable Hilbert space over $CC$.

= Graphs

- Definition: the *graph* of an operator $(A, D(A))$ is the vector subpsace of $fH times fH$ given by
$
  G(A) = {(v, A v): v in D(A)} subset D(A) times fH
$

- Lemma: $G subset fH times fH$ is the graph of an operator $(A, D(A))$ iff #[
    #set enum(numbering: "(i)")
    + (vector space) $G$ is a vector subspace of $fH times fH$
    + (linearity at zero) $(0, y) in G$ implies $y=0$
    + (dense projection to $fH$) $D := {x in fH : exists y in fH "such that" (x,y) in G}$ is dense in $fH$.
  ]

= Spectrum

- Definition: Let $(A,D(A))$ be an operator. the *resolvent set* $rho(A) subset CC$ is
  $
    rho(A) := {#block(width: 21em)[
        $z in CC$ such that $A-z:D(A) -> fH$ is invertible with bounded inverse
      ]}
  $
  and the spectrum $sigma(A) := CC \\ rho(A)$.
  - $lambda$ can belong to $sigma(A)$ (1) if $A-lambda$ is not injective [if $(A-lambda )v = (A - lambda) w$ then $v-w$ is an eigenvalue of $A$], (2) if $A-lambda$ is injective but not surjective (so the inverse cannot be defined), or (3) if it is invertible but not boundedly.
    - right shift on $ell^2(NN)$ is injective but not surjective - there is a left inverse but no right inverse. Said differently - there is an inverse but only on a non-dense subspace of $fH$.
    - for an example of the third kind: Consider $fH = L^2(0,1)$ with operator $A f := t f$. Generically you can take $A = (B-z)^(-1)$ with $B$ an unbounded operator with $z in rho(B)$. The inverse is of course $A^(-1)=B-z$  which is densely defined but is not bounded. We can consider also $A plus.o A^(-1)$ on $fH plus.o fH$ for an operator that is unbounded with unbounded inverse.
- Lemma: $sigma((A-z)^(-1)) = {1/(lambda-z): lambda in sigma(A)} union cases(
    emptyset "if" A "is bounded",
    {0} "otherwise"
  )$

= Closure
- We say $A$ is *closed* if $G(A)$ is closed, i.e. if $x_n in D(A)$ with $x_n ->^fH x$ and $y_n ->^fH x$ then $x in D(A)$ and $A x = y$.
- If $(A,D(A))$ is not closed then $sigma(A) = CC$.
- generically $overline(G(A))$ will always satisfy (i),(ii) of the above lemma characterising graphs. But it is (ii) that may fail, i.e. there can be some nonzero $y$ with $(0,y) in G$, (giving the absurdity $A 0 = y != 0$). Evaluation on $L^2 -> L^2$ is like this, since convergence in $L^2$ of highly oscillatory functions to 0 can break evaluation (the next exercise).
- We say that $A$ is *closable* if $A$ has at least one closed extension. Then $overline(G(A)) = G(overline(A))$ for a uniquely defined operator $(overline(A), D(overline(A)))$, called the *closure* of $A$.
- For $-i del_j$, $Delta$ on $C^oo_c (RR^d)$ the domain of the closure are $H^1$ and $H^2$ respectively.

= Adjoint
- cute observation: the wanted equality $bangle(v, A u) = bangle(A^* v, u)$ can be written $ bangle((v, A^*v), (A u, -u))_(fH times fH) = 0 $ So we make the definition
  $
    G(A^*) := {(A u, -u): u in D(A)}^perp
  $
  - clearly a vector space so (i) is OK. Suppose $(0,y)$ in $G(A^*)$. Then for all $u in D(A)$, $0 = bangle((0, y), (A u, -u))_(fH times fH) = bangle(y, -u).$ As $D(A)$ is dense this implies $u=0$. So (ii) is also OK. Finally for (iii): recall $D:={x in fH : exists y in fH "such that" (x,y) in G}$. We want that $D^perp = {0}.$ But note $v in D^perp$ iff $(v,0) in G^perp$ (zeroing out the second inner product in the product space), and
    $ (v,0) in G^perp = {(A u, -u): u in D(A)}^(perp perp) = overline({(A u, -u): u in D(A)}) $
    i.e. iff $(0,v) in overline(G(A))$, which is precisely the condition needed for closability. It follows:
    - density of $D(A)$ allows a definition of $A^*$, but $D(A^*)$ may not be dense. And it is dense iff $A$ is closeable. So we will henceforth only use closeable d.d. operators.
  - Once upon a time I learned that we should define $ D(A^*) = {v in fH : exists w "such that for all" x in D(A), bangle(v, A x) = bangle(w, x)} $
    this is a reformulation of the graph definition above, which you can see by projecting $G(A^*)$ to the first coordinate.
- If $A$ is closeable then $A^*$ is closed. Also, $overline(A) = A^(**)$ and $A^* = overline(A)^*$.
- If $(A, D(A))$ is a closeable operator, then $ker(A^* - overline(z)) = ran(A- z)^perp = ran(overline(A)- z)^perp$.
- Exercise: If $A in B(fH)$ then $D(A^*)=fH$ also. [this is an application of Riesz representation. The start of proof: Let $v$ be fixed, and consider $f_v (x) = bangle(v, A x)$...]

= Symmetry

- $(A, D(A))$ is *symmetric* if $bangle(v, A w) = bangle(A v, w)$ for all $v,w in D(A)$. Equivalently $G(A) subset G(A^*)$.
- Exercise: show that if $A$ is symmetric then its closure is as well. [This is trivial as $G(A) subset G(overline(A)) subset G(A^*)$ by minimality]
- Theorem (Spectrum of symmetric operators): Let $(A, D(A))$ be a symmetric operator. Then its spectrum is either: #[
    #set enum(numbering: "(i)")
    +
  ]
