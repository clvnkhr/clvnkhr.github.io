// date: 2026-05-07
// tags: maths, functional-analysis, notes, rough
// hidden: true


#set par(justify: true)
#set math.equation(numbering: "(1)")
// #set page(fill: red.darken(70%))
// #set text(fill: white.darken(10%))

#title("Notes on Lewin Ch2: Self-adjointness")

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


#let bangle(..xs) = {
  $
    lr(
      chevron.l
      #xs.pos().intersperse([, #math.thin]).join()
      chevron.r
    )
  $
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
- Let $(A,D(A))$ be a d.d. operator with $z in rho(A)$. The ball around $z$ with radius
  $ 1/norm((A-z)^(-1)) $
  is contained in $rho(A)$, and in this ball we have the norm convergent power series for the resolvent,
  $
    (A-z')^(-1) = (A-z)^(-1) sum_(n >= 0) (z'-z)^n (A-z)^(-n)
  $
- Remark: $sigma(A) != emptyset$ if $A$ is bounded.
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
  - proof idea: the operator is clearly closed on $H^1$ and $H^2$ resp. To show that the closure of the operator is this closed operator, we can directly check what the closure of the graph is, which amounts to checking convergence of $C^oo_c$ functions to Sobolev functions.

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
  - Proof:
    Observe that #h(1fr)
    $
      v in ker (A^* - overline(z)) "iff" A^* v = overline(z)v.
    $
    Then note that $(v, z v) in G(A^*)$ iff for all $u in D(A)$, $log (x)$
    $
      bangle(v, A u) = bangle(overline(z) v, u) = bangle(v, z u),
    $
    i.e. iff $v in ran(A-z)^perp$.
- Exercise: If $A in B(fH)$ then $D(A^*)=fH$ also. [this is an application of Riesz representation. The start of proof: Let $v$ be fixed, and consider $f_v (x) = bangle(v, A x)$...]

= Symmetry

- $(A, D(A))$ is *symmetric* if $bangle(v, A w) = bangle(A v, w)$ for all $v,w in D(A)$. Equivalently $G(A) subset G(A^*)$.
- Exercise: show that if $A$ is symmetric then its closure is as well. [This is trivial as $G(A) subset G(overline(A)) subset G(A^*)$ by minimality]
- Theorem (Spectrum of symmetric operators): Let $(A, D(A))$ be a symmetric operator. Then its spectrum is nonempty, and is either: #[
    #set enum(numbering: "(i)")
    + all of $CC$,
    + closed upper half plane ${Im z >= 0}$,
    + closed lower half plane ${Im z <= 0}$,
    + some nonempty subset of $RR$.
  ]
  Furthermore, any eigenvalues must be real, and if $A-z$ is surjective for $z in.not RR$, then $z in rho(A)$, and $sigma(A)$ is contained in the half plane that does not contain $z$.
  - Proof uses the important identity for symmetric operators: for $a,b in RR$,
    $
      norm((A - a - i b) u)^2 = norm((A - a) u)^2 + b^2 norm(u)^2 > b^2 norm(u)^2.
    $
    Hence
    + if $b!=0$ then $(A - a - i b) u = 0$ implies $u=0$. So all eigenvalues must be real.
    + if $b!=0$ and $A - a - i b$ is invertible then it is automatically bounded by $1/b$.
    So the only way to be in the spectrum when $b!=0$ is for $A - a - i b$ to be not surjective.
    - Proof: Suppose that there is a point in $rho(A) inter {Im z > 0}$. Assume for a contradiction that $sigma(A) inter {Im z> 0}$ is not empty. Let $z=a + i b$ on the boundary of this set with $b>0$, and let $z_n = a_n + i b_n in rho(A)$ approach $z$. By the above it follows that the ball of radius $|b_n|$ around $z_n$ is contained in $rho(A)$. But eventually $|b_n|>b/2$ and $|z-z_n|<b/2$, so in fact $z$ is not on the boundary which is absurd. It follows that if $rho(A) inter {Im z > 0}$ has a single point, it is the entire half plane. [If a half plane is excluded then the real line is a subset of $sigma(A)$ since it is closed.]
    - For the fact that the spectrum is always non-empty: we know this already for bounded operators. Suppose not for an unbounded $A$. Then $0 in rho(A)$ so $A^(-1)$ exists and is bounded and symmetric. We know that $sigma(A) = {}$ implies $sigma(A^(-1)) = {0}$. But it turns out that the only bounde symmetric operator with zero spectrum is the trivial operator, which follows form the next exercise:
      - Exercise 2.24 (Bounded Symmetric Operators)

        Let $B$ be a bounded and symmetric operator on $D(B) = H$. Following [Bre11, Prop. 6.9], we will show that

        $
          m := inf_(v in H, norm(v) = 1) chevron.l v, B v chevron.r, quad
          M := sup_(v in H, norm(v) = 1) chevron.l v, B v chevron.r
        $

        both belong to the spectrum of $B$. We recall that $chevron.l v, B v chevron.r$ is always real since $B$ is symmetric. Show that for all $v, w in H$ we have

        $
          abs(chevron.l w"," (B - m) v chevron.r)
          <= chevron.l v, (B - m) v chevron.r^(1/2)
          chevron.l w, (B - m) w chevron.r^(1/2)
        $

        and deduce that

        $
          norm((B - m) v)
          <= chevron.l v, (B - m) v chevron.r^(1/2) norm(B - m)^(1/2).
        $

        Using a minimizing sequence for the minimization problem $m$, deduce that $m in sigma(B)$. Similarly, we have $M in sigma(B)$ (we will see later in Theorem 2.33 that $sigma(B) subset.eq [m, M]$). Deduce from the fact that $m, M in sigma(B)$ that if $sigma(B) = {0}$ then $B equiv 0$. [proof is just Cauchy-Schwarz and reading the outline.]
= Self-adjointness
An operator is *self-adjoint* if $A = A^*$, i.e. if $A$ is symmetric and $D(A) = D(A^*)$. $A$ is *essentially self-adjoint* if $overline(A)$ is self-adjoint.
- Interpretation. For any symmetric operator we always have $A subset A^*$, i.e. we have the inclusion of graphs
  $
    {(v, A v): v in D(A)} subset {(v, A^* v): v in D(A^*)}.
  $
  In finite dimension these two sets coincide (as they are both $d$-dimensional subspaces of $fH times fH$), but in infinite dimension the second can be strictly larger. Self-adjointness is the condition that they coincide,
  $
    {(v, A v): v in D(A)} = {(v, A^* v): v in D(A^*)}.
  $
  An operator is self-adjoint iff it satisfies for any $v,w in fH$
  $
    #[$bangle(v, A z) = bangle(w, z)$ for all $z in D(A)$ implies $v in D(A)$ and $A v = w$]
  $
  the left hand side is a weak formulation of the equation $A v = w$. So a self-adjoint operator is one for which a weak solution is in fact strong.
- All self-adjoint extensions (note: plural) are between $overline(A)$ and $A^*$.
- Exercise: Let $(A,D(A))$ be a symmetric operator. Show that $overline(A)$ is self-adjoint iff $A^*$ is symmetric. [ If $overline(A)$ is self-adjoint, then $A^* = (overline(A))^* = overline(A)$ is symmetric. Conversely, if $A^*$ is symmetric then $overline(A) subset A^* subset A^(**)=overline(A)$ so $overline(A) = A^*$ is self-adjoint.]
- If $D(A)=fH$ and $A$ is symmetric then $A$ is self-adjoint and bounded. [This is because $D(A^*) supset D(A)$. Thus $A$ is a closed operator defined on the full Banach space - by the closed graph theorem it is bounded.]

== Characterisation and Weyl Sequences
- Theorem (Characterisation) Let $(A,D(A))$ be a symmetric operator. Then the following are equivalent:
  + $A$ is self-adjoint.
  + $sigma(A) subset RR$.
  + there exists $lambda in CC$ such that $A - lambda$ and $A - overline(lambda)$ are both surjective from $D(A)$ to $fH$.
  NB 2 is a priori much stronger than 3 as it implies that 3 holds for all $lambda in CC \\ RR$.

- Exercise: Let $(A,D(A))$ be a symmetric operator. Show that $A$ is essentially self-adjoint iff there exists $lambda in CC$ such that $A - lambda$ and $A - overline(lambda)$ have dense range in $fH$.
- Theorem. Let $(A, D(A))$ be self-adjoint. Then TFAE: #[
    #set enum(numbering: "(1)")
    + $lambda in sigma(A)$.
    + $inf_(v in D(A) \ norm(v)=1) norm((A- lambda) v)$ = 0.
    + there exists a sequence $v_n in D(A)$ with $norm(v_n) = 1$ and $norm((A - lambda) v_n) -> 0$.
  ]
  A sequence as in (3) is called a *Weyl sequence* for $A$ and $lambda$.

  Proof: $(2) <==> (3)$ is trivial. For $(2)==>(1)$: if $A-lambda$ is not invertible we are done. If $A - lambda$ is invertible, then (2) implies it cannot be bounded. Indeed, for any $w in fH$ with $v = (A-lambda)^(-1) w$ we would have
  $ norm((A - lambda)^(-1) w) <= C norm(w) "i.e." norm(v) <= C norm((A- lambda)v) $
  which contradicts (2), so (1) holds. Conversely if the infimum is some $epsilon > 0$ then we would have $norm((A - lambda) v) >= epsilon norm(v)$, so injective i.e. $ker(A-lambda)={0}$, and hence has dense range. If $(A - lambda) v_n -> w$ then this inequality implies $v_n$ is Cauchy, so the range is closed. Hence $A-lambda$ is surjective, so $lambda in.not sigma(A)$.
- Theorem. Let $(A,D(A))$ be  self-adjoint. We have
  $
    inf sigma(A) = inf_(v in D(A) \ norm(v)=1) bangle(v, A v), quad
    sup sigma(A) = sup_(v in D(A) \ norm(v)=1) bangle(v, A v).
  $
  In particular, the spectrum is bounded below iff $bangle(v, A v) >~ norm(v)^2$ for all $v in D(A)$.
== Diagonalization
- *Theorem* Let $A$ be a symmetric operator on a domain $D(A) subset H$, such that there exists a Hilbert basis $(e_n)_(n >= 1)$
  of $H$ composed of elements of $D(A)$, which are all eigenvectors:
  $A e_n = lambda_n e_n$ with $lambda_n in RR$. Then, the closure of $A$ is the
  operator

$
  overline(A) v = sum_(n >= 1) lambda_n chevron.l e_n, v chevron.r e_n, quad
  D(overline(A)) := { v in H : sum_(n >= 1) abs(lambda_n)^2 abs(
      chevron.l e_n"," v
      chevron.r
    )^2 < infty }.
$ <eq2.17>

The latter is a self-adjoint operator whose spectrum is

$
  sigma(overline(A)) = overline({ lambda_n, n >= 1 }).
$ <eq2.18>

In other words, $(A, D(A))$ is essentially self-adjoint.

== Momentum and Laplacian on $RR^d$
- $P_j:=-i del_j, A:=-Delta$ with $D(P_j):={f in L^2 : del_j f in L^2} subset fH = L^2$ and $D(A) = H^2$ are self-adjoint. Moreover, $sigma(P_j) = RR$ and $sigma(A) = [0, infty)$, and they have no eigenvalues.
  - Only proof for $Delta$ is given. Symmetry (integration by parts) is easy. Then to check self-adjointness we can check the surjectivity of $A-lambda$ for $lambda=-1=overline(lambda)$, which is convenient as this gives us a japanese bracket on the Fourier side to work with. The claim on the spectrum comes from
== Momentum on $(0,1)$
- Let $D(P^"min") = C^oo_c$, $D(P^"max") = H^1$ and $D(P_0) = H^1_0(0,1)$. Then #h(1fr)
  $
    P^"min" subset (P^"max")^* = P_0 subset.neq P_0^* = (P^"min")^* = P^"max"
  $ <inclusions>
  in particular/addition
  - $P^"min"$ is symmetric but not self-adjoint, and its closure is $P_0$.
  - $P^"max" = (P^"min")^* = P_0^*$, and is not symmetric.
  - $P_0$ is closed and symmetric but not self-adjoint.
    - A symmetric operator has $A subset A^*$. So $A^*$ is always a closed extension of such an operator. But this example shows that the closure of a symmetric operator need not be self-adjoint, and that the adjoint of a symmetric operator need not be symmetric. When we try to compute the adjoint we see the issues: the domain has all functions in $L^2$ satisfying the adjoint equation, and the vanishing of $v in D(P_0)$ gives freedom to have a nonzero value at the boundary for $v in D(P_0^*)$, and breaks symmetry.
  - We have $sigma(P_0) = sigma(P^"min") = sigma(P^"max") = CC$. The spectrum of $P^"max"$ consists only of eigenvalues, while the other spectra have none.
    - this is because all solutions to the eigenvalue equation for $P^"max"$ are $e^(i lambda x)$, and also separately check that $0 != e^(i lambda x) in ran(P_0 - lambda)^perp$.
- #let Pper(f: $P$, t: $theta$) = $#{ f } _("per", #t)$

  The strict symmetric extensions of $P_0$ are defined by $Pper() f = - i f'$ on the domain
  $
    D(Pper()) = {f in H^1 : f(1) = e^(i theta) f(0)}.
  $
  These operators are all self-adjoint, and their spectrum is $sigma(Pper()) = {2 pi n + theta : n in ZZ}$, consisting only of eigenvalues.
  - the condition $f(1) = e^(i theta) f(0)$ is known as the Born-von Karman boundary condition.
  - In the proof it is shown that $H^1_0$ is codimension 1 in $H_("per",theta)$.



== Momentum on $RR_+$
Making the similar definitions of $H^1, H^1_0, P^"min", P^"max"$, and  $P_0$ _mutatis mutandis_ we have @inclusions, but $P_0$ in this case has no self-adjoint extensions, with $sigma(P_0) = CC_- := {z in CC : Im(z) < 0}$, without eigenvalues.

= Exercises
+ ($H^1_("per")$ and Fourier Series) Skipping for now as it seems routine
+ (Beware of Commutators) The issue here is that $P_"per" X$ wont necessarily be defined as $X$ could take you out of $D(P_"per")$.
+ Exercise 2.48 (Deficiency Indices) Let $(A, D(A))$ be a closed symmetric operator.

  1. Show that $norm((A + i)v) = norm((A - i)v)$ for all $v in D(A)$. Deduce that the operator
    $U = (A + i)(A - i)^(-1)$
    is an isometry from $op("ran")(A - i)$ into $op("ran")(A + i)$.
    - This follows from the nice identity from before that $ norm(A - a - i b) u^2 = norm((A-a) u)^2 + b^2 norm(u)^2 $
      with $a=0$ and $b= +- 1$. (GPT tells me the formula for $U$ has the inverse defined only as a map on $ran(A - i)$, not necessarily a proper resolvent.)
  2. What can we conclude in finite dimension?
    - Peeking ahead at the later parts of the exercise, I think we are supposed to see that $dim ker(A - i) = dim ker(A + i)$ (using the finiteness of dimension to conclude from the rank).

  3. Let $B = B^ast$ be a self-adjoint extension of $A$. Show that
    $V = (B + i)(B - i)^(-1)$
    is an isometry from $fH$ into $fH$, which is an extension of $U$, that is, such that
    $V f = U f$
    for all $f in D(A)$.
    - This is easy because we already know that $i in.not sigma(B)$ and that $B+i$ is surjective.

  4. Then show that the image of $op("ran")(A + i)^perp = ker(A^ast - i)$ by $V$ contains
    $op("ran")(A - i)^perp = ker(A^ast + i)$.
    - We want to show that $V (ker(A^ast - i) ) supset ker (A^* + i)$. Let $A^* v = - i v$; we want to show that there is $w$ in $ker (A^* - i)$ such that $V w = v$. Clearly such $w$ would be defined by $w = V^(-1) v = (B-i)(B+i)^(-1)v$. Lets check that $w in ker(A^* + i) = ran(A - i)^perp$. For $u in D(A) subset D(B)$:
    $
      bangle((A-i)u, w) & = bangle(u, (B+i)(B-i)(B+i)^(-1)v) \
                        & = bangle(u, (B-i)(B+i)(B+i)^(-1)v) \
                        & = bangle(u, (B-i)v) \
                        & = bangle((B+i)u, v) \
                        & = bangle((A+i)u, v) = 0.
    $
  5. Deduce that a symmetric operator can only have self-adjoint extensions if
    $dim ker(A^ast - i) = dim ker(A^ast + i)$
    (which can be finite or infinite). [Follows as $V$ is an isometry]

  6. Reinterpret the result of Theorem 2.40 in this perspective.
    - (This theorem concerns the lack of self adjoint extensions for the momentum operator on the half line.) The result on the spectrum $sigma(P) = CC_-$ is enough to show that there can be no self adjoint extension.
