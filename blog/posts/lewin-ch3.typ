// date: 2026-05-15
// tags: maths, functional-analysis, notes, rough
// hidden: false


#set par(justify: true)
#set math.equation(numbering: "(1)")
// #set page(fill: red.darken(70%))
// #set text(fill: white.darken(10%))

#title("Notes on Lewin Ch3: Self-adjointness Criteria: Rellich, Kato
and Friedrichs")

#import "../templates/math.typ": html_fmt
// #show: html_fmt

#import "@preview/quick-maths:0.2.1": shorthands

#show: shorthands.with(
  ($+-$, $plus.minus$),
  ($-+$, $minus.plus$),
  ($=<$, $arrow.double.l$),
  ($<~$, $≲$),
  ($>~$, $≳$),
)
#let hbar = [\u{0127}]
#let grad = $nabla$
#let dd = $dif$
#let del = $partial$
#let infty = $oo$ // for the poor LLM that keeps trying to  use latex's \infty
#let Subset = $subset.double$
#let ran = math.op("ran")
#let fH = $frak(H)$

#let bangle(..xs) = {
  $
    lr(
      chevron.l
      #xs.pos().intersperse([, #math.thin]).join()
      chevron.r
    )
  $
}

= Rellich--Kato

- Let $(A,D(A))$ be a self-adjoint operator and $0<=alpha <1$. We say that an operator $B$ defined on $D(A)$ is *$A$-bounded with relative bound $alpha$* if there exists $C$ such that
$
  norm(B v) <= alpha norm(A v) + C norm(v).
$
- $B$ is infinitesimally $A$-bounded if it is *A* bounded with relative bound $alpha$ for all $alpha>0$.
- *Theorem (Rellich--Kato)* Suppose that $B$ is $A$-bounded with relative bound $alpha$. Then $A+B$ is self-adjoint on $D(A)$.

  Moreover, if $cal(D) subset D(A)$ is a dense subspace such that $overline(A|_cal(D))=A$, then we also have $A+B = overline((A+B)|_cal(D))$, i.e. $(A+B)|_cal(D)$ is essentially self-adjoint.

  Finally, if $sigma(A) subset [a,oo)$ for some $a in RR$, then $sigma(A+B) subset [a - C/(1-alpha), oo)$.
  - $cal(D)$ in the above theorem is called the *core* of the operator $A$.
  - Proof uses the identity $ A+B+i mu = (1 + B(A + i mu)^(-1))(A+i mu) $ and then exploits
   $alpha < 1$ to get invertibility of $(1 + B(A + i mu)^(-1))$ for large enough $mu$.
- *Theorem* Let $V in L^p + L^oo$ where
  $
    cases(p=2 "if" p<4, p>2 "if" p=4, p=d/2 "otherwise")
  $
  Then $V$ is infinitesimally $(-Delta)$-bounded, and
  $
    abs(integral_(RR^d) V |f|^2)
    <= epsilon integral_(RR^d) |nabla f|^2 + C_epsilon integral_(RR^d) |f|^2
  $
- As a corollary, we have that $-Delta+V$ is self-adjoint on $D(Delta)=H^2(RR^d)$ with spectrum that is bounded below.

= Friedrichs

Let $phi(dot, dot)$ be a sesquilinear form on a dense domain $cal(Q) subset fH$. Let $q$ denote the associated real-valued quadratic form.

- *Definition (Coercivity and Closure)* We say $q$ an $phi$ are _bounded from below_, or _semi-bounded_, if there is an $alpha in RR$ such that $q(u) >= alpha norm(u)^2$.

  If we can take $alpha>0$, we say $q$ and $phi$ are _coercive_.

  We say that $q$ and $phi$ are _closed_ if they are coercive and $(cal(Q), phi)$ is a Hilbert space.

  We say that $q$ and $phi$ are _closable in $fH$_ when they admit a closed extension, in which case there is a minimal closed extension which we denote $(overline(cal(Q)), overline(phi))$ and call the _closure_.
- *Lemma* Let $phi$ be a coercive sesquilinear form on $cal(Q) subset fH$. Then $phi$ is closable iff for any Cauchy sequence $v_n in cal(Q)$ satisfying in addition $v_n -> 0$ in $fH$, we have $q(v_n) -> 0$.
== Symmetric Operators
- Let $(A, D(A))$ be a symmetric operator. The quadratic form associated with $A$ is the form
  $
    q_A(v) := bangle(v, A v), quad cal(Q) := D(A).
  $
The associated sesquilinear form is $phi_A(v,w) := bangle(v, A w)$.
- A symmetric operator $(A,D(A))$ is bounded from below/semi-bounded, or coercive, if the associated form $q_A$ is, and in which case we will write $A >= alpha$.

- *Theorem* Let $A >= alpha > 0$ be a coercive symmetric operator. Then $q_A$ is closable to a form $overline(q_A)$ defined on
  $
    cal(Q)_A:= {v in fH: exists v_n in D(A) "such that" v_n -> v, lim_(n,m->oo) q(v_n - v_m) = 0}
  $
  Furthermore, we have
  - $D(A)$ is dense in $cal(Q)_A$ with respect to the norm $sqrt(overline(q_A))$
  - $cal(Q)_A$ is dense in $fH$
  - For all $u in D(A)$ and all $v in cal(Q)_A$, $overline(phi_A)(v,u) = bangle(v, A u)$
  - the embedding $cal(Q)_A arrow.hook fH$ is continuous, i.e. $alpha norm(v)^2 <= overline(q_A)(v)$ for all $v in cal(Q)_A$.
  - If $A$ is closed, then the embedding $D(A) arrow.hook cal(Q)_A$ is also continuous, i.e. for all  $v in D(A)$,
  $
    overline(q_A)(v) = bangle(v, A v) <= 1/2 norm(v)^2_(D(A)) = norm(v)^2/2 + norm(A v)^2/2.
  $
  If $A>=alpha$ is only bounded below we can apply the above with $A+alpha+epsilon$ to get a closed form.

  == Self-adjoint Operators

  - *Theorem* Let $A >= alpha$ and let $overline(phi_A)$ be the associated closed form defined in the previous Theorem. For any $v,z in fH$, the following are equivalent:
    + $v in cal(Q)_A$ and $overline(phi_A)(v,h) = bangle(z,h)$ for all $h in cal(Q)_A$.
    + $v in D(A)$ and $A v = z$.
    In particular we can reconstruct $A$ from the closure of its quadratic form.
    - The equation $overline(phi_A)(v,h) = bangle(z,h)$ is the _weak formulation_ of the equation $A v = z$. It is "weak" because we only suppose that $v$ belongs to $cal(Q)_A$. $D(A)$ is the subset 
    $
      D(A) = {v in cal(Q)_A : exists z in fH : overline(phi_A)(v,h) = bangle(z,h), forall h in cal(Q)_A}.
    $
  - As a self-adjoint operator is fully characterized by the closure $overline(q_A)$, we will abusively write $q_A eq.def overline(q_A)$, $phi_A eq.def overline(phi_A),$ $Q(A) eq.def cal(Q)_A$.

  == Friedrichs Realisation
  - Theorem 3.14 showed that every semi-bounded self-adjoint operator is given by a closed quadratic form. Below we show that every closed quadratic form that is bounded below is given by a self-adjoint operator.
    - this allows us to define the Friedrichs extension of any bounded below symmetric operator $A$: from $A$ compute $q_A$. Since it is bounded below, we can close it. Then the Theorem gives us a self-adjoint operator that extends $A$. 
  - *Theorem* Let $cal(Q) subset fH$ be Hilbert spaces such that $cal(Q)$ is dense and continuously embedded in $fH$. Then there is a unique self-adjoint operator $A$ on $D(A) subset fH$, with
  $
    D(A) = {v in cal(Q) : exists v in fH : bangle(v,h)_cal(Q) = bangle(z,h)_fH, forall h in fH}
  $ such that $q_A = norm(dot)^2_cal(Q),$ $phi_A = bangle(dot,dot)_(cal(Q))$, and $cal(Q) = Q(A)$.

  Moreover, if $B$ is a self-adjoint operator on $D(B) subset cal(Q)$ such that $D(B)$ is dense on $cal(Q)$ and $q_B = q$ on $D(B)$, then $B = A$.

  *Theorem* (Kato-Lions-Milgram-Nelson) Let $A$ be a coercive self-adjoint operator and let $q_A$ be its associated closed quadratic form with domain $Q(A)$. Let $b$ be another quadratic form on $Q(A)$ such that for some $eta in [0,1)$, $kappa>0$ and for all $v in Q(A)$, 
  $
    |b(v)| ≤ eta q_A (v) + kappa norm(v)^2 
  $
  Then $q_A + b$ is closed and coercive on $Q(A)$, and hence it is associated with a unique self-adjoint operator $C$, with $Q(C) = Q(A)$.

  If in particular $b$ is the quadratic form of a symmetric operator $B$ defined on  $D(A)$, then $C$ is the unique self-adjoint extension of $A+B$ defined on $D(A+B) = D(A)$, such that $D(A) subset D(C) subset Q(A)$.

Theres more on specific examples and exercises which I didn't get to.