// date: 2026-05-19
// tags: maths, functional-analysis, self-adjointness, notes, rough
// hidden: false

#set par(justify: true)
#set math.equation(numbering: "(1)")
#set heading(numbering: "1.1")

#import "@preview/quick-maths:0.2.1": shorthands
#import "@preview/theofig:0.2.0": *

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
#let infty = $oo$
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

#title("Notes on Lewin Ch4: Spectral Theorem and Functional Calculus")

= Multiplication Operators

Let $B subset RR^d$ be Borel, and let $mu$ be a locally finite Borel measure on $B$. We set $fH = L^2 (B, dd mu; CC)$. Local finiteness implies that $L^oo_c subset fH$.

#example[
  Let $B = {x_1, ..., x_k} subset RR^d$ and $mu = sum_i delta_(x_i)$. Then $L^2 (B, dd mu) ~= CC^k$, so every operator $T$ identifies under the obvious choice of basis $e_i = bb(1)_{x_i}$ with a matrix $M in CC^(k times k)$, with $M_(i j) = bangle(e_i, T e_j) = (T e_j) (x_i)$. Then $g = T f$ is the element $g(x_i) = sum_j M_(i,j) f(x_j)$.

  - A diagonal matrix $M$ corresponds to $f mapsto a f$ where $a(x_i) = M_(i i)$.
  - Every Hermitian matrix $M = M^*$ can be diagonalized (possibly under a different basis).
]<ex-finite-dim>

- Let $a in L^2_"loc" (B, dd mu)$, then $M_a$ is the operator defined by
$
  M_a f(x) = a(x) f(x), quad D(M_a) = {v in L^2 (B, dd mu) : a v in L^2 (B, dd mu)}.
$

#theorem[
  Let $a in L^2_"loc" (B, dd mu)$.
  + $(M_a, D(M_a))$ is closed.
  + $sigma(M_a) = essran(a)$, where the essential range of $a$ is
  $
    essran(a) = {y in CC : mu(|a(dot) - y| <= epsilon) > 0 "for all" epsilon > 0}.
  $
  + The eigenvalues of $M_a$ are the $lambda in essran(a)$ such that $mu(a = lambda) > 0$, with the corresponding eigenspace $L^2 ({a = lambda}, dd mu)$, the space of all square-integrable functions with support in the set ${a = lambda}$, defined $mu$-a.e.
  + $(M_a, D(M_a))$ is bounded iff $a in L^oo (B, dd mu)$.
  + $(M_a, D(M_a))$ is self-adjoint iff $a$ is real-valued (bounded or not).
]<thm-M_a>

- Bits of the proof.
  For $lambda in.not essran(a)$, there is $epsilon > 0$ such that $|a - lambda| > epsilon$ $mu$-a.e. Thus, $1 / (a - lambda) in L^oo (B, dd mu)$, and the map $v mapsto v(a - lambda)^(-1)$ is bounded $L^2 (B, dd mu) -> D(M_a)$ (using $a / (a - lambda) = 1 + lambda / (a - lambda)$) and is an inverse for $M_a - lambda$. For $lambda in essran(a)$, there exists $R_n > 0$ such that $mu({|a - y| < 1 / n} inter BB_(R_n)) in (0, oo)$ for all $n$. Then with $u_n := bb(1)_({|a - y| < 1 / n} inter BB_(R_n))$ we have
  $
    norm((M_a - lambda) u_n)^2 <= 1 / n^2 norm(u_n)^2.
  $
  So $M_a - lambda$ cannot be invertible.

#theorem[Theorem 4.4: Spectral Theorem][
  Let $(A, D(A))$ be self-adjoint on $fH$. Then there exists $d >= 1$, a Borel set $B subset RR^d$, a locally finite measure $mu$ on $B$, a real-valued locally bounded function $a in L^oo_"loc" (B, dd mu)$, and an isomorphism $U : fH -> L^2 (B, dd mu)$ such that
  $
    U A U^(-1) = M_a, quad U D(A) = D(M_a).
  $
  One can take $d = 2, B = sigma(A) times NN subset RR^2, a(s, n) = s$, and $mu$ a finite measure on $B$.
]<thm-spectral>

#corollary[resolvent bound][
  $
    norm((A - z)^(-1)) = 1 / d(z, sigma(A)).
  $
]<cor-resolvent-norm>

#corollary[isolated eigenvalues][
  Every isolated point of the spectrum is an eigenvalue.
]<cor-isolated-point>

- Define $f(A) := U^(-1) M_(f(a)) U, quad D(f(A)) = U^(-1) D(M_(f(a)))$ for any such isomorphism. We need to show this is independent of the choice of $U$.

#theorem[Theorem 4.8: Functional Calculus for bounded Borel functions][
  #set enum(numbering: "(i)")
  Let $(A, D(A))$ be self-adjoint. There exists a unique map
  $
    f in scr(L)^oo (RR, CC) mapsto f(A) in cal(B) (fH)
  $
  defined on the $C^*$-algebra $scr(L)^oo (RR, CC)$ of bounded Borel functions on $RR$, with values in the algebra $cal(B) (fH)$ of bounded operators on $fH$, such that:
  + it is a morphism of $C^*$-algebras ($CC$-linear, preserves product and star operation).
  + it is continuous, with $norm(f(A)) <= sup_(x in RR) abs(f)$.
  + if $f(x) = (x - z)^(-1)$ with $z in CC \\ RR$, then $f(A) = (A - z)^(-1)$.
  + if $f|_(sigma(A)) == 0$ then $f(A) = 0$.
  + if $|f_n (x)| <= C$ and $f_n -> f$ pointwise on $RR$, then $f_n (A) v -> f(A) v$ for all $v in fH$.
]<thm-borel-func-calc>

#remark[Remark 4.9: Spectral measure][
  Let $v$ be a unit vector of $H$. By @thm-borel-func-calc, the map
  $
    f in C^0_b (RR, RR) mapsto phi_v (f) := bangle(v, f(A) v) in RR
  $
  is a continuous linear form. If in addition $f >= 0$ we can write
  $
    f(A) = sqrt(f) (A)^2,
  $
  which shows that $phi_v$ is a positive linear form on $C^0_b$. Hence by Riesz--Markov, there is a unique Borel probability measure $mu_(A, v)$ on $RR$ such that
  $
    bangle(v, f(A) v) = integral_RR f(s) dd mu_(A, v) (s).
  $

  With $(B, mu) = (sigma(A) times NN, mu)$ and $a(s, n) = s$ from @thm-spectral, if $U : H -> L^2 (B, mu)$ is the corresponding unitary map, we can write
  $
    bangle(v, f(A) v)
    = bangle(U v, f(a) U v)_(L^2 (B, mu))
    = integral_B f(a) abs(U v)^2 dd mu
    = integral_(sigma(A) times NN) f(s) abs(U v(s, n))^2 dd mu(s, n).
  $
  Therefore $mu_(A, v)$ is the pushforward measure#footnote[
    The book writes
    $ dd mu_(A, v) (s) = sum_(n in NN) |U v(s, n)|^2 dd mu(s, n) $
    but this is a little fast and loose with notation; the sum is a partial integration of $dd mu(s, n)$ that comes from the pushforward. The proper way is to define the slice measures $mu_n (E) = mu(E times {n})$, then we can write $dd mu_(A, v) (s) = sum_(n in NN) |U v(s, n)|^2 dd mu_n (s)$.
  ]
  $
    mu_(A, v) = a_* (abs(U v)^2 mu),
  $
  i.e. for every Borel set $E subset RR$,
  $
    mu_(A, v) (E) = integral_(a^(-1) (E)) abs(U v(x))^2 dd mu(x)
    = integral_(E times NN) abs(U v(s, n))^2 dd mu(s, n).
  $
  In words, $mu_(A, v)$ is the cylindrical projection on $sigma(A)$ of the probability measure $|U v(s, n)|^2 dd mu(s, n)$ on $sigma(A) times NN$. We then have $v in D(A)$ iff $mu_(A, v)$ has a moment of order two, and in this case
  $
    integral_RR s^2 dd mu_(A, v) = norm(A v)^2.
  $
  We also have
  $
    integral_RR s dd mu_(A, v) (s) = bangle(v, A v).
  $

  We will in fact need this construction in the proof of @thm-spectral.

  For every bounded Borel function $f$, $f(A)$ is defined by @thm-borel-func-calc. By setting $E_A (B) := bb(1)_B (A)$ we obtain the spectral theorem in terms of projection-valued measures:
]<rem-spectral-measure>

#theorem[Projection-valued spectral measure][
  #set enum(numbering: "(i)")
  Let $(A, D(A))$ be self-adjoint. There exists a unique map
  $
    E_A : cal(B) (RR) -> cal(B) (H)
  $
  from the Borel subsets of $RR$ to the orthogonal projections on $H$, such that:
  + $E_A (emptyset) = 0$ and $E_A (RR) = I$.
  + if $(B_n)_n$ are pairwise disjoint Borel subsets of $RR$, then
    $
      E_A (union_n B_n) v = sum_n E_A (B_n) v
    $
    for every $v in H$, where the series converges in $H$.
  + for every pair of Borel subsets $B, C subset RR$,
    $
      E_A (B inter C) = E_A (B) E_A (C).
    $
  + for every bounded Borel function $f in scr(L)^oo (RR, CC)$,
    $
      f(A) = integral_RR f(s) dd E_A (s).
    $
  + We can recover
    $
      A = integral_RR s dd E_A (s).
    $
]<thm-proj-spectral>

#definition[Scalar spectral measure][
  Let $v$ be a unit vector of $H$. Then $mu_(A, v)$ and $E_A$ are related by
  $
    mu_(A, v) (B) = bangle(v, E_A (B) v).
  $
]<scalar-spectral-measure>

#corollary[Corollary 4.10: Functional Calculus for locally bounded Borel functions][
  Let $(A, D(A))$ be self-adjoint and let $f : RR -> CC$ be a locally bounded Borel function. Then $f(A)$ defined above is independent of the isomorphism $U$ used to represent $A$ as a multiplication operator.

  This follows from the functional calculus for bounded functions because we can describe $D(f(A))$ and $f(A) v$ in terms of the corresponding functional calculus for $f_n = f bb(1)_{|f| < n}$,
  $
    v in D(f(A)) <==> limsup_(n -> oo) norm(f_n (A) v) < oo,\
    f(A) v = lim_(n -> oo) f_n (A) v.
  $
]<cor-loc-bdd-func-calc>

= Proof of Theorems 4.4 and 4.8

- Structure of the proof:
  + First we prove the functional calculus for the "resolvent algebra" $cal(A)$ of resolvents. This gives @thm-continuous-func-calc using the Stone--Weierstrass theorem. This calculus is for functions in $C^0_lim := CC + C^0_0 (RR, CC)$ (continuous functions with equal limits at $+-oo$).
  + Deduce @thm-spectral.
  + Use the monotone class theorem to deduce uniqueness and hence @thm-borel-func-calc (the other properties of @thm-borel-func-calc follow directly from the definition).

- $C^0_lim$ is a unital $C^*$-algebra.

#theorem[Theorem 4.11: Continuous functional calculus][
  #set enum(numbering: "(i)")
  Let $(A, D(A))$ be self-adjoint. There exists a unique map
  $
    f in C^0_lim (RR, CC) mapsto f(A) in cal(B) (fH)
  $
  such that:
  + it is a morphism of $C^*$-algebras ($CC$-linear, preserves product and star operation).
  + it is continuous, with $norm(f(A)) <= sup_(x in RR) abs(f)$.
  + if $f(x) = (x - z)^(-1)$ with $z in CC \\ RR$, then $f(A) = (A - z)^(-1)$.
]<thm-continuous-func-calc>

#proof[
  Define the resolvent algebra $cal(A)$ as the algebra generated by constant functions and the rational maps $x |-> (x - z)^(-1)$ for $z in CC \\ RR$. By the Stone--Weierstrass theorem, $cal(A)$ is dense in $C^0_lim$. It is clearly a $C^*$-algebra.

  We first show that there is a unique morphism of $C^*$-algebras $cal(A) -> cal(B) (fH)$ sending $(x - z)^(-1)$ to $(A - z)^(-1)$. We are forced to directly map $(x - z)^(-1)$ to $(A - z)^(-1)$ by (iii) and similarly for linear combinations of products by (i). That this assignment is unique and well-defined follows from
  - $( (A - z)^(-1))^* = (A - overline(z))^(-1)$, and
  - the resolvent identity
    $
      (A - z)^(-1) - (A - w)^(-1) = (w - z) (A - z)^(-1) (A - w)^(-1),
    $
    which demonstrates commutativity.

  For (ii) we will use @lem-square-root.

  @lem-square-root gives us (ii) by using
  $
    norm(f)^2_oo - |f(x)|^2 in cal(A).
  $
  This continuity allows us to well-define $f(A)$ for all $f in C^0_lim$ by approximating by elements of $cal(A)$ (via Stone--Weierstrass) and using the continuity to show that the limit is independent of the choice of approximating sequence. Uniqueness follows from the density of $cal(A)$ in $C^0_lim$.
]

#lemma[Lemma: Stability under the square root][
  Let $f in cal(A)$ be non-negative on $RR$. Then there is a unique $g in cal(A)$ such that $g^2 = f$ and $g >= 0$ on $RR$. In particular,
  $
    f(A) = g(A)^2 >= 0.
  $
]<lem-square-root>

#proof[
  Let us write bold letters $bold(alpha\, p\, q\, ...)$ to denote vectors / multiindices of some length and set $(f(bold(alpha)))^bold(beta)$ to mean $product_i (f(alpha_i))^(beta_i)$ when $bold(alpha)$ and $bold(beta)$ are the same length.

  Note that every $f in cal(A)$ can be written as a reduced rational function $f = P / Q$ where $P$ and $Q$ are polynomials with no common roots, and $Q$ has no real roots. Conversely every such rational function is in $cal(A)$ by decomposing as partial fractions.

  Let for $f = P / Q in cal(A)$,
  $
    P = c(x - bold(alpha))^bold(p) (x - bold(z))^(bold(p)'),
    quad
    Q = (x - bold(xi))^bold(q),
  $
  with $alpha_i in RR$, $z_i in CC$, $xi_i in CC$.

  Next suppose that $f >= 0$ on $RR$. In particular then $f(x) in RR$ when $x in RR$, so
  $
    P overline(Q) = Q overline(P),
  $
  which implies that $c in RR$ by comparing the leading term, and also that
  $
    (x - bold(z))^(bold(p)') (x - overline(bold(xi)))^bold(q)
    = (x - bold(xi))^bold(q) (x - overline(bold(z)))^(bold(p)').
  $
  Since the fraction $P / Q$ is reduced, none of the $z_i$ can equal the $xi_i$, so each $(x - z_i)^(p'_i)$ must be a factor of $(x - overline(bold(z)))^bold(q)$. Similarly, each $(x - overline(xi_i))^(q_i)$ must be a factor of $(x - bold(xi))^bold(q)$. It follows that the complex numbers appear with their conjugates with equal multiplicity, so
  $
    f(x) = c(x - bold(alpha))^bold(p)
    abs(x - bold(z))^(2 bold(p'))
    / abs(x - bold(xi))^(2 bold(q)).
  $
  Now, using that $f >= 0$ on $RR$, we have $c >= 0$ and $p_i$ are even. So we can take
  $
    g(x) = sqrt(c) (x - bold(alpha))^(bold(p) / 2)
    abs(x - bold(z))^(bold(p'))
    / abs(x - bold(xi))^(bold(q)),
  $
  as required.
]

#proof[of the Spectral Theorem, @thm-spectral][
  As in @rem-spectral-measure, we can construct the scalar spectral measure $mu_(A, v)$ for some unit vector $v$, as follows. By the Riesz--Markov representation theorem, there is a unique Borel probability measure $mu_(A, v)$ on $RR$ such that
  $ bangle(v, f(A) v) = integral_RR f(s) dd mu_(A, v) (s) $
  for every bounded continuous function $f$. Now observe that
  $
    bangle(g(A) v, f(A) v) = integral_RR overline(g(s)) f(s) dd mu_(A, v) (s)
  $
  so that the map $f mapsto f(A)v$ is an isometry  $C^0_lim (RR, CC) -> fH$ with respect to the inner product. By taking the closure, this gives an isometry
  $
    U : L^2 (RR, dd mu_(A, v)) -> cal(X)_v := overline({f(A) v: f in C^0_lim (RR, CC)}), quad f mapsto f(A) v.
  $
  Note that
  $
    bangle(g(A)v, (A-z)^(-1) f(A)v) = bangle(v, (overline(g) (bullet-z)^(-1) f) (A)v) = integral_RR(overline(g(s)) f(s))/ (s - z) dd mu_(A, v) (s)
  $
  Thus, extending by continuity, we see that $(A-z)^(-1)$ restricted to $cal(X)_v$ is unitarily equivalent to multiplication by $(s-z)^(-1)$. It follows that $A$ is unitarily equivalent to multiplication by $s$. Indeed, let
  $
    B := U A U^(-1)
  $
  Then $(B-z)^(-1) = U(A-z)^(-1) U^(-1) = M_( (s-z)^(-1))$.
  At the same time, from
  $
    (s-z) (M_s - z)^(-1) f = (M_s - z) (M_s - z)^(-1) f = f
  $
  we see that $(M_s - z)^(-1) = M_( (s-z)^(-1))$ as well. In particular the resolvents' ranges are the same, so $D(B) = D(M_s)$, and $I = (B-z) (M_s - z)^(-1)$ gives that $B = M_s$.

  If there exists $v$ such that $cal(X)_v = fH$, then we are done. If not, we need to iterate the argument.
  #lemma([Invariance of $cal(X)_v$])[
    The subspace $cal(X)_v$ is invariant under $(A-z)^(-1)$, and $cal(X)_v^perp$ is also invariant under $(A-z)^(-1)$, for every $z in CC \\ RR$.
  ]
  #proof("of lemma")[
    $(A-z)^(-1) cal(X)_v subset cal(X)_v$ is because $(A-z)^(-1) f in C^0_lim (RR, CC)$
    for every $f in C^0_lim (RR, CC)$, and $(A-z)^(-1)$ is continuous.

    And for a similar reason,$(A-z)^(-1) cal(X)_v^perp subset cal(X)_v^perp$, as
    $bangle(f(A) v, (A-z)^(-1) w) = bangle((A-overline(z))^(-1) f(A) v, w) = bangle(( (bullet-overline(z))^(-1) f) (A) v, w) = 0.$
  ]
  Now, we can write
  $
    fH = plus.o.big_(n in NN) cal(X)_(v_n)
  $
  as follows - let $e_n$ be an orthonormal basis for $fH$,
  and put $v_1 = e_1$.
  Then, let $v_2 = P^perp_(cal(X)_(v_1)) e_j$ (orthogonal projection) where $e_j$ is the first basis vector not in $cal(X)_(v_1)$.
  Note that $cal(X)_(v_2) perp cal(X)_(v_1)$, since $v_2 perp cal(X)_(v_1)$, and
  $
    bangle(f(A)v_1, g(A) v_2) = bangle(v_1, (overline(f) g) (A) v_2) = 0.
  $
  Continuing in this way gives the desired decomposition of $fH$ into a direct sum of invariant subspaces.

  We now have that $(A-z)^(-1)$ on each invariant subspace $cal(X)_(v_n)$ is unitarily equivalent to multiplication by $(s-z)^(-1)$ on $L^2 (RR, dd mu_(A, v_n))$. We can combine them into a single isomorphism to $L^2 (B, dd mu)$ with $B = RR times NN$ and $mu(V times {n}) = 2^(-n) mu_(A, v_n) (V)$, and define $a(s, n) = s$. It follows as before that $A$ is unitarily equivalent to multiplication by $s$. This completes the proof of @thm-spectral, apart from the special form claimed that we can take in fact $B = sigma(A) times NN$. This is covered in the next lemma.
]
#lemma[Support of the spectral measure][
  Let $v in H$ with $norm(v) = 1$. Then  $mu_(A, v)(RR \\ sigma(A)) = 0$.
]
#proof[
  Suppose $RR \\ sigma(A) != emptyset$ and let $lambda_0 in RR \\ sigma(A)$. Then $(A-z)^(-1)$ is bounded on a small ball (in $CC$) around $lambda_0$. For concreteness we take
  $
    r = 1/(2 norm((A - lambda_0)^(-1))).
  $
  Then $norm((A - z)^(-1)) <= 2$ for $z in BB_(lambda_0, r)$.

  Let $lambda in [lambda_0 - r/2, lambda_0 + r/2]$. Put $z_n = lambda + i/n$ for $n >= 2/r$ so that $z_n in BB_(lambda_0, r)$. Then
  $
    4 >= norm((A - z_n)^(-1))^2 >= bangle(v, (A - z_n)^(-1) v) = integral_RR 1 / (abs(s - lambda)^2 + 1/n^2) dd mu_(A, v) (s).
  $
  Integrating over $lambda in [lambda_0 - r/2, lambda_0 + r/2]$ and using Tonelli's theorem gives
  $
    4 r &>= integral_(lambda_0 - r/2)^(lambda_0 + r/2) integral_RR 1 / (abs(s - lambda)^2 + 1/n^2) dd mu_(A, v) (s) dd lambda \
    &= integral_RR integral_(lambda_0 - r/2)^(lambda_0 + r/2) 1 / (abs(s - lambda)^2 + 1/n^2) dd lambda dd mu_(A, v) (s) \
    &>= integral_(lambda_0 - r/4)^(lambda_0 + r/4) integral_(s - r/4)^(s + r/4) 1 / (abs(s - lambda)^2 + 1/n^2) dd lambda dd mu_(A, v) (s) \
    &= mu_(A, v)([lambda_0 - r/4, lambda_0 + r/4]) integral_(-r/4)^(r/4) 1 / (t^2 + 1/n^2) dd t \
    &= 2 n arctan((r n)/4) mu_(A, v)([lambda_0 - r/4, lambda_0 + r/4]).
  $
  It follows from $n arctan((r n)/4) stretch(->)_(n->oo) oo$ that $mu_(A, v)([lambda_0 - r/4, lambda_0 + r/4])=0$. Since $lambda_0$ was arbitrary, we have $mu_(A, v)(RR \\ sigma(A)) = 0$ as claimed.
]

#proof[of @thm-borel-func-calc][
  Given the spectral theorem we have already above the construction of the functional calculus for measurable functions satisfying the required properties, save uniqueness.

  So consider a second functional calculus $f mapsto f(A)'$ satisfying the same properties. Then since they agree for $f(x) = (x-z)^(-1)$, they agree on the resolvent algebra $cal(A)$, and by continuity they agree on $C^0_lim$.

  Now fix $v in fH$ and consider the two linear forms
  $
    ell(f) = bangle(v, f(A) v) = integral_(sigma(A)) f(s) dd mu_(A, v) (s),
    quad
    ell'(f) = bangle(v, f(A)' v)
  $
  $ell=ell'$ would imply $f(A)=f(A)'$ by polarization. Riesz--Markov gives us uniqueness of the corresponding Borel measure, but this is not the same as uniqueness of the functional (for instance if the measure was $delta_0$ the linear functional could a Banach limit given by some ultrafilter.). For this, we invoke

  #theorem("Functional Monotone Class Theorem")[
    Let $cal(A)$ be a unital algebra of bounded real-valued functions on X. Let $cal(H)$ be a vector space of bounded functions such that
    $cal(A) subset.eq cal(H)$,
    and suppose $cal(H)$ is closed under bounded monotone pointwise limits:
    $ 0 <= f_n arrow.t f, quad sup_x f(x)< infty, quad f_n in cal(H) ==> f in cal(H). $

    Then $cal(H)$ contains every bounded function measurable with respect to $sigma(cal(A))$.
  ]
  With this theorem and (v) of @thm-borel-func-calc, we have that $ell=ell'$ on all bounded Borel functions, and hence $f(A)=f(A)'$ for all bounded Borel functions, as needed.
]

= Spectral Projections

As always let $A$ be self-adjoint on $fH$. To each Borel $F subset RR$, the functional calculus gives us the associated spectral projection $bb(1)_F (A)$.

#proposition[
  We have the following properties:
  + $bb(1)_F (A) = bb(1)_F (A)^* = bb(1)_F (A)^2$
  + $bb(1)_emptyset (A) = 0, bb(1)_(RR) (A) = 1(A) = "Id"_fH$,
  + If $F = union.big_(n >= 1) F_n$, then $bb(1)_F (A) = sum_(n >= 1) bb(1)_(F_n) (A)$,
  + $bb(1)_(F_1 inter F_2) (A) = bb(1)_(F_1) (A) bb(1)_(F_2) (A)$,

  In addition, using the specific representation of $A$ as a multiplication operator $M_a$ by $a(s,n) = s$ on $L^2 (sigma(A) times NN, dd mu)$, we have
  $
    bb(1)_F (A) = U^(-1) M_(bb(1)_(F)(a)) U = U^(-1) M_(bb(1)_(F times NN)) U,
  $
  so $ran bb(1)_F (A) = U^(-1)(L^2(F times NN, dd mu)$, and $op("rank")(bb(1)_F (A)) = dim L^2(F times NN, dd mu)$.
]

#lemma[
  + $lambda in sigma(A)$ iff $bb(1)_(lambda - epsilon, lambda + epsilon) (A) != 0$ for all $epsilon > 0$.
  + $lambda$ is an eigenvalue of $A$ iff $bb(1)_{lambda} (A) != 0$, in which case $bb(1)_{lambda} (A)$ is the orthogonal projection to the corresponding eigenspace $ker(A - lambda)$.
]
