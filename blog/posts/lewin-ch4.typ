// date: 2026-05-19
// tags: maths, functional-analysis, self-adjointness, notes, rough
// hidden: true


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
  M_a f (x) = a(x) f(x), quad D(M_a) = {v in L^2(B, dd mu) : a v in L^2(B, dd mu)}.
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
    U A U^(-1) = M_a, U D(A) = D(M_a).
  $
  One can take $d=2,B=sigma(A)times NN subset RR^2, a(s,n)=s$, and $mu$ a finite measure on $B$.
- *Corollary* $norm((A-z)^(-1)) = 1/d(z, sigma(A))$.
- *Corollary* Every isolated point of the spectrum is an eigenvalue.

- Define $f(A) := U^(-1) M_(f(a)) U$ for any such isomorphism. We need to show this is independent of the choice of $U$.

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
- (Spectral measure) Let $v$ be a unit vector of $fH$. By the functional calculus, the map
  $
    f in C^0_b (RR,RR) mapsto phi_v (f) := bangle(v, f(A)v) in RR
  $
  is a continuous linear form. If in addition $f>=0$ we can write $f(A) = sqrt(f)(A)^2$ which shows that $phi_v$ is a positive linear form on $C^0_b$, so by Riesz--Markov, there is a unique Borel probability measure $mu_(A,v)$ on $RR$ such that
  $
    bangle(v, f(A)v) = integral_RR f(s) dd mu_(A,v)(s).
  $
  With $mu, B=sigma(A) times NN, a(s,n)=s$ from the Spectral Theorem we can write
