// date: 2026-05-19
// tags: maths, functional-analysis, self-adjointness, notes, rough
// hidden: false


#set par(justify: true)
#set math.equation(numbering: "(1)")
// #set page(fill: red.darken(70%))
// #set text(fill: white.darken(10%))

#title("Notes on Lewin Ch4: Spectral Theorem and Functional Calculus")

#import "@preview/quick-maths:0.2.1": shorthands

#show: shorthands.with(
  ($+-$, $plus.minus$),
  ($-+$, $minus.plus$),
  ($=<$, $arrow.double.l$),
  ($==$, $equiv$),
  ($<~$, $≲$),
  ($>~$, $≳$),
  ($~=$, $tilde.equiv$),
)
#let hbar = [\u{0127}]
#let grad = $nabla$
#let dd = $dif$
#let del = $partial$
#let infty = $oo$ // for the poor LLM that keeps trying to  use latex's \infty
#let Subset = $subset.double$
#let Supset = $supset.double$
#let ran = math.op("ran")
#let fH = $frak(H)$
#let essran = math.op("ess" + math.thin + "ran")

#let bangle(..xs) = {
  $
    lr(
      chevron.l
      #xs.pos().intersperse([, #math.thin]).join()
      chevron.r
    )
  $
}

= Multiplication Operators
Let $B subset RR^d$ be Borel, and let $mu$ be a locally finite Borel measure on $B$. We set $fH = L^2(B, dd mu; CC)$. Local finiteness implies that that $L^oo_c subset fH$.
- *Example* Let $B = {x_1, ..., x_k} subset RR^d$ and let $mu = sum_i delta_(x_i)$. Then $L^2(B,dd mu) ~= CC^k$, so every operator $T$ identifies under the obvious choice of basis $e_i = bb(1)_{x_i}$ with a matrix $M in CC^(k times k)$, with $M_(i j) = bangle(e_i, T e_j) = (T e_j)(x_i)$. Then $g = T f$ is the element $g(x_i) = sum_j M_(i,j) f(x_j)$.
  - A diagonal matrix $M$ corresponds to the operator $f mapsto a f$ where $a(x_i) = M_(i i)$.
  - Every Hermitian matrix $M=M^*$ can be identified with a diagonal matrix (possibly under a different basis).


- Let $a in L^2_"loc" (B, dd mu)$, then $M_a$ is the operator defined by
$
  M_a f (x) = a(x) f(x), quad D(M_a) = {v in L^2(B, dd mu) : a v in L^2(B, dd mu)).
$
- *Theorem* Let $a in L^2_"loc" (B, dd mu)$.
  + $(M_a, D(M_a))$ is closed.
  + $sigma(M_a) = essran(a)$, where the essential range of $a$ is
  $
    essran(a) = {y in CC : mu(|a(dot) - y| <= epsilon)>0 "for all" epsilon > 0}.
  $
  + The eigenvalues of $M_a$ are the $lambda in essran(a)$ such that $mu(a=lambda) > 0$, with the corresponding eigenspace $L^2({a=lambda}, dd mu)$, the space of all square-integrable functions with support in the set ${a=lambda}$, defined $mu$-a.e.
  + $(M_a, D(M_a))$ is bounded iff $a in L^oo (B, dd mu)$.
  + $(M_a, D(M_a))$ is self-adjoint iff $a$ is real-valued (bounded or not).
  - Bits Of The Proof.
    For $lambda in.not essran(a)$, there is $epsilon > 0$ such that $|a-lambda| > epsilon$ $mu$-a.e. Thus, $1/(a-lambda) in L^oo (B, dd mu)$, and the map  $v mapsto v (a - lambda)^(-1)$ is bounded $L^2(B, dd mu) -> D(M_a)$ (using $a/(a-lambda) = 1 + lambda/(a-lambda)$) and is an inverse for $M_a - lambda$. For $lambda in essran(a)$, there exists $R_n>0$ such that $mu({|a-y|<1/n} inter BB_(R_n)) in (0, oo)$ for all $n$. Then with $u_n := bb(1)_({|a-y|<1/n} inter BB_(R_n))$ we have
    $ norm((M_a - lambda) u_n)^2 <= 1/n^2 norm(u_n)^2. $ So $M_a - lambda$ cannot be invertible.

- *Theorem 4.4: Spectral Theorem*
  Let $(A,D(A))$ be self-adjoint on $fH$. Then there exists $d>=1$, a Borel set $B$, a locally finite measure $mu$ on $B$, a real-valued locally bounded function $a in L^oo_"loc" (B, dd mu)$, and an isomorphism $U : fH -> L^2(B, dd mu)$ such that
  $
    U A U^(-1) = M_a, quad U D(A) = D(M_a).
  $
  One can take $d=2,B=sigma(A)times NN subset RR^2, a(s,n)=s$, and $mu$ a finite measure on $B$.
- *Corollary* $norm((A-z)^(-1)) = 1/d(z, sigma(A))$.
- *Corollary* Every isolated point of the spectrum is an eigenvalue.

- Define $ f(A) := U^(-1) M_(f(a)) U, quad D(f(A)) = U^(-1) D(M_(f(a))) $ for any such isomorphism. We need to show this is independent of the choice of $U$.

- *Theorem 4.8: Functional Calculus for bounded Borel functions*
  #[
    #let Loo = $scr(L)^oo$
    #set enum(numbering: "(i)")
    Let $(A,D(A))$ be self-adjoint. There exists a unique map
    $
      f in Loo(RR, CC) mapsto f(A) in cal(B)(fH)
    $
    defined on the $C^*$-algebra $Loo(RR, CC)$ of bounded Borel functions on $RR$, with values in the algebra $cal(B)(fH)$ of bounded operators on $fH$, such that:
    + it is a morphism of $C^*$-algebras ($CC$-linear, preserves product and star operation).
    + it is continuous, with $norm(f(A)) <= sup_(x in RR) abs(f)$.
    + if $f(x) = (x-z)^(-1)$ with $z in CC\\RR$, then $f(A) = (A-z)^(-1)$.
    + if $f|_(sigma(A)) == 0$ then $f(A) = 0$.
    + if $|f_n (x)| <= C$ and $f_n -> f$ pointwise on $RR$, then $f_n (A)v -> f(A)v$ for all $v in fH$.
  ]
- (Spectral measure) Let $v$ be a unit vector of $H$. By the functional calculus, the map
  $
    f in C^0_b (RR,RR) mapsto phi_v(f) := bangle(v, f(A)v) in RR
  $
  is a continuous linear form. If in addition $f >= 0$ we can write
  $
    f(A) = sqrt(f)(A)^2,
  $
  which shows that $phi_v$ is a positive linear form on $C^0_b$. Hence by Riesz--Markov, there is a unique Borel probability measure $mu_(A,v)$ on $RR$ such that
  $
    bangle(v, f(A)v) = integral_RR f(s) dd mu_(A,v)(s).
  $

  With $(B,mu) = (sigma(A) times NN, mu)$ and $a(s,n)=s$ from the Spectral Theorem, if $U : H -> L^2(B,mu)$ is the corresponding unitary, we can write
  $
    bangle(v, f(A)v)
    = bangle(U v, f(a) U v)_(L^2(B,mu))
    = integral_B f(a) abs(U v)^2 dd mu
    = integral_(sigma(A) times NN) f(s) abs(U v(s, n))^2 dd mu(s, n).
  $
  Therefore $mu_(A,v)$ is the pushforward measure#footnote[The book writes
    $dd mu_(A,v)(s) = sum_(n in NN) |U v(s,n)|^2 dd mu(s, n)$
    but this is a little fast and loose with notation; the sum is a partial integration of $dd mu(s, n)$ that comes from the pushforward. The Proper Way is to define the slice measures $mu_n (E) = mu(E times {n})$, then we can write $dd mu_(A,v)(s) = sum_(n in NN) |U v(s,n)|^2 dd mu_n (s)$.]
  $
    mu_(A,v) = a_*(abs(U v)^2 mu),
  $
  i.e. for every Borel set $E subset RR$,
  $
    mu_(A,v)(E) = integral_(a^(-1)(E)) abs(U v(x))^2 dd mu(x)
    = integral_(E times NN) abs(U v(s, n))^2 dd mu(s, n).
  $
  In words - $mu_(A,v)$ is the cyllindrical projection on $sigma(A)$ of the probability measure $|U v(s,n)|^2 dd mu(s, n)$ on $sigma(A) times NN$. We then have $v in D(A)$ iff $mu_(A,v)$ has a moment of order two, and in this case $integral_RR s^2 dd mu_(A,v) = norm(A v)^2$. We also have $integral_RR s dd mu_(A,v)(s) = bangle(v, A v)$.
- By setting $E_A (B) = bb(1)_B (A)$ in the calculus we also have the *Spectral Theorem* in terms of  projection-valued measures:
#[
  #set enum(numbering: "(i)")
  Let $(A,D(A))$ be self-adjoint. There exists a unique map
  $
    E_A : cal(B)(RR) -> cal(B)(H)
  $
  from the Borel subsets of $RR$ to the orthogonal projections on $H$, such that:
  + $E_A (emptyset) = 0$ and $E_A (RR) = I$.
  + if $(B_n\)_n$ are pairwise disjoint Borel subsets of $RR$, then
    $E_A (union_n B_n) v = sum_n E_A (B_n) v$
    for every $v in H$, where the series converges in $H$.
  + for every pair of Borel subsets $B,C subset RR$,
    $E_A (B inter C) = E_A (B) E_A (C).$
  + for every bounded Borel function $f in scr(L)^oo (RR, CC)$,
    $f(A) = integral_RR f(s) dd E_A (s).$
  + We can recover
    $A = integral_RR s dd E_A (s).$
]

  - (Scalar spectral measure) Let $v$ be a unit vector of $H$. Then $mu_(A,v)$ and $E_A$ are related by 
   $mu_(A,v)(B) = bangle(v, E_A (B) v)$.


- *Corollary 4.10: Functional Calculus for locally bounded Borel functions* Let $(A, D(A))$ be self-adjoint and let $f: RR -> CC$ be a ocally bounded Borel function. Then $f(A)$ defined above is independent of the isomorphism $U$ used to represent $A$ as a multiplication operator.
  - This follows from the functional calculus for bounded functions because we can describe $D(f(A))$  and $f(A)v$ in terms of the corresponding functional calculus for $f_n = f bb(1)_{|f|<n}$,
  $
    v in D(f(A)) <==> limsup_(n -> oo) norm(f_n (A) v) < oo,\
    f(A) v = lim_(n -> oo) f_n (A) v.
  $
= Proof of Theorems 4.4 and 4.8
- Structure of the proof:
  + First we prove the functional calculus for the 'resolvent algebra' $cal(A)$ of resolvents. This gives the continuous functional calculus using the Stone--Weierstrass theorem. This calculus is for functions in $C^0_lim :=CC + C^0_0 (RR, CC)$ (continuous functions with equal limits at $+-oo$).
  + Deduce the spectral theorem, Theorem 4.4
  + Use the monotone class theorem to deduce uniqueness and hence Theorem 4.8 (the other properties of Theorem 4.8 follow directly from the definition).

  - $C^0_lim$ is a unital $C^*$-algebra.
- #[
    #set enum(numbering: "(i)")
    *Theorem 4.11 (Continuous functional calculus)* Let $(A, D(A))$ be self-adjoint. There exists a unique map
    $
      f in C^0_lim (RR, CC) mapsto f(A) in cal(B)(fH)
    $
    such that:
    + it is a morphism of $C^*$-algebras ($CC$-linear, preserves product and star operation).
    + it is continuous, with $norm(f(A)) <= sup_(x in RR) abs(f)$.
    + if $f(x) = (x-z)^(-1)$ with $z in CC\\RR$, then $f(A) = (A-z)^(-1)$.

    _Proof of Theorem 4.11_: Define the resolvent algebra $cal(A)$ as the algebra generated by constant functions and the rational maps $z |-> (x-z)^(-1)$ for $z in CC\\RR$. By the Stone--Weierstrass theorem, $cal(A)$ is dense in $C^0_lim$. It is clearly a $C^*$-algebra. We first show that there is a unique morphism of $C^*$-algebras $cal(A) -> cal(B)(fH)$ sending $(x-z)^(-1)$ to $(A-z)^(-1)$. We are forced to directly map $(x-z)^(-1)$ to $(A-z)^(-1)$ by (iii) and similarly for linear combinations of products by (i). That this assignment is unique and well-defined follows from
    - $((A-z)^(-1))^* = (A-overline(z))^(-1)$, and
    - the resolvent identity $(A-z)^(-1) - (A-w)^(-1) = (w-z) (A-z)^(-1) (A-w)^(-1)$ which demonstrates commutativity.
  ]
  For (ii) we will use
  - *Lemma (Stability under the square root)* Let $f in cal(A)$ be non-negative on $RR$. Then there is a unique $g in cal(A)$ such that $g^2 = f$ and $g >= 0$ on $RR$. In particular,
  $
    f(A) = g(A)^2 >= 0.
  $
  - _proof of lemma_: lets write bold letters $bold(alpha\,p\,q\,...)$ to denote vectors / multiindices of some length and set $(f(bold(alpha)))^bold(beta)$ to mean $product_(i)(f(alpha_i))^(beta_i)$ when $bold(alpha\,beta)$ are the same length. Note that every $f in cal(A)$ can be written as a reduced rational function $f = P/Q$ where $P$ and $Q$ are polynomials with no common roots, and $Q$ has no real roots. Conversely every such rational function is in $cal(A)$ by decomposing as partial fractions. Lets write for $f=P/Q in cal(A),$
    $
      P = c (x - bold(alpha))^bold(p) (x-bold(z))^(bold(p)'), quad Q = (x-bold(xi))^bold(q), quad alpha_i in RR, z_i in CC, xi_i in CC .
    $
  Next suppose that $f >= 0$ on $RR$. In particular then $f(x) in RR$ when $x in RR$, so $P overline(Q) = Q overline(P),$ which implies that $c in RR$ by comparing the leading term, and also that
  $
    (x - bold(z))^(bold(p)') \(x - overline(bold(xi)))^bold(q) = (x - bold(xi))^bold(q) (x - overline(bold(z)))^(bold(p)').
  $
  Since the fraction $P/Q$ is reduced, none of the $z_i$ can equal the $xi_i$, so each $(x - z_i)^(p'_i)$ must be a factor of $(x - overline(bold(z)))^bold(q)$. Similarly, each $(x - overline(xi_i))^(q_i)$ must be a factor of $(x - bold(xi))^bold(q)$. It follows each of the complex numbers appear with their conjugates with equal multiplicity, so
  $
    f(x) = c (x - bold(alpha))^bold(p) abs(x-bold(z))^(2bold(p'))/abs(x-bold(xi))^(2bold(q)).
  $
  Now, using that $f >= 0$ on $RR$, we have that $c >= 0$ and $p_i$ are even. So we can take $g(x) = sqrt(c) (x - bold(alpha))^(bold(p)/2) abs(x-bold(z))^(bold(p'))/abs(x-bold(xi))^(bold(q))$, QED.
- The lemma gives us (ii) by using $norm(f)^2_oo - |f(x)|^2 in cal(A)$. This continuity allows us to well-define $f(A)$ for all $f in C^0_lim$ by approximating by elements of $cal(A)$ (via Stone--Weierstrass) and using the continuity to show that the limit is independent of the choice of approximating sequence. Uniqueness follows from the density of $cal(A)$ in $C^0_lim$.

- _Proof of Spectral Theorem (Theorem 4.4)_
