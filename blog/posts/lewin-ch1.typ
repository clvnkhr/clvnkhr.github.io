// date: 2026-04-30
// tags: maths, quantum-mechanics, notes, rough, hamiltonian-operators
// hidden: true

#set par(justify: true)
// #set page(fill: red.darken(70%))
// #set text(fill: white.darken(10%))

#title("Notes on Lewin Ch1: Introduction to Quantum Mechanics")

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
#let infty = $oo$ // for the poor LLM that keeps trying to use latex's \infty
#let Subset = $subset.double$

#let bangle(..xs) = {
  math.lr(
    math.chevron.l + xs.pos().intersperse([, #math.thin]).join() + math.chevron.r,
  )
}




Important notation
- $bangle(f, g) := integral overline(f) g$, so it is antilinear in the first index and linear in the second.
- $bangle(A) := bangle(psi, A psi)$.

Also -  as I am playing on my own I will try to use $V("x")$ (note the upright x) to indicate the multiplication operator by $V(x)$.

The reader was asked to verify Ehrenfest's relations, which states that $dif/(dif t) bangle(x) = bangle(p)$ and $dif/(dif t) bangle(p) = -bangle(V')$. This comes out of the commutator relation $[H, "x"] = i P$ and $[H, P] = -i V'$. For the first, we have that $[V,"x"] = 0$, so
$
  -[H, x_j]f = [partial_i partial_i, x_j]f = partial_i x_j partial_i f = delta_(i j) partial_i f = i P_j f.
$
For the second,
$
  [H, P_j]f = [-partial_i partial_i, i partial_j]f + [V, i partial_j]f = i nabla V f .
$

- Quote: #quote[Heisenberg [Hei25] started from the axiom that,
    in dimension .d=1, the position and momentum are described by two self-adjoint
    operators X and P satisfying the commutation relation.
    $ [X,P]= "i"hbar. $
    Such operators do not exist in finite dimension (to see this, take the trace)
  ]
  - minor elaboration: The trace of any commutator of matrices is zero as $tr(A B) = tr(B A)$.
- For the quantum hydrogen atom, the Hamiltonian is $H = -Delta - 1/abs(x)$ and the corresponding energy is
  $
    cal(E)(psi) = integral_(RR^3) abs(grad psi)^2 dd x - integral_(RR^3) abs(psi)^2/abs(x) dd x
  $
- Proposition 1.1 is that $cal(E)(psi)>=C$ for $psi in H^1$ with $||psi||_(L^2)=1$, and some $C<0$.  The proof: Sobolev embedding in dimension 3 is $H^1(RR^3) subset L^6(RR^3)$, whic lower bounds the first term.   Splitting the second term into near and far parts, we can use Holder's inequality and the integrability of $1/|x|$ to bound the near part by $C_r ||psi||_(L^6)^2$ and the far part by $1/r ||psi||_(L^2)^2$. Choosing $r$ appropriately gives the result.
  - curiously the next result is a proof that the infimum is attained without this stability result. Presumably this is because the author wanted to show the proof, not the result.
- The "negligible at infinity" spaces $L^p + L^oo_epsilon$ are defined, properties proven in exercises
- In Lemma 1.10 the strong convergence is not proven explicitly but it is simple (just Holder). For the weak convergence,  $psi_n harpoon^(H^1) psi$ implies by Rellich-Kondrachov that $psi_n stretch(->)^(L^2 (K)) psi$, and then interpolating we get strong convergence of $psi_n$ in $L^r (K)$ for $r<2p'$, i.e. strong convergence of $|psi_n|^2$ in $L^r (K)$ for $r<2p'$. Then, since $|psi_n|^2$ is bounded in $L^p'$, we get weak convergence along a subsequence of $|psi_n|^2$ in $L^p'$ (testing against $f in C^oo_c (RR^d)$ and the strong local convergence to identify the limit). Since this is true for arbitrary subsequences, we have weak convergence along the full sequence.
- In Corollary 1.11 there is no mentioned split of $V$ into $V_+ + V_-$ but the remark sort of implies it, and anyway it is obvious from the proof.
- The (sequential) wlsc is not written out separately from the proof. it is the following - we say $J$ is wlsc if $f_n harpoon f$ implies $J(f) <= liminf_(n -> oo) J(f_n)$.

== Exercises
1. 1. $X+Y$ is Banach: this is actually routine so I will not write the details.
  2. Show the dual of $X+Y$ is $X' inter Y'$ argument is standard.
  3. Question is to show that for $f in L^p + L^oo$, TFAE: #[#set enum(numbering: "(i)")
      + $f in L^p + L^oo_epsilon$
      + $|{|f|>eta}|<oo$ for all $eta>0$.
      + $lim_(R->oo) norm(bb(1)_(B_R^c) f)_(L^p+L^oo) = 0.$
    ]
    Proof of $"(i)" ==> "(ii)"$: By definition we can find a decomposition $f = f_p + f_eta$ with $norm(f_eta)_(L^oo)<eta/2$. Then $mu(|f|>eta) = mu(|f_p|>eta) <= norm(f_p)^p_(L^p)/eta^p$ just by Markov's inequality, so it is finite.


    Proof of $"(ii)" ==> "(iii)"$: Let $f = f_p + f_oo$ be a decomposition of $f$ with $f_p in L^p$ and $f_oo in L^oo$. Fix $epsilon > 0$. We need to show that for $R$ large enough, $norm(bb(1)_(B_R^c) f)_(L^p + L^oo) < epsilon$. We can split $bb(1)_(B_R^c) f = (bb(1)_(B_R^c) f_p + bb(1)_(B_R^c) f_oo bb(1)_(|f_oo|>epsilon/2)) + bb(1)_(B_R^c) f_oo bb(1)_(|f_oo|<=epsilon/2)$, and the first term is in $L^p$ and the second term is in $L^oo$ with norm at most $epsilon/2$. Since $f_p in L^p$, we can choose $R$ large enough so that $norm(bb(1)_(B_R^c) f_p)_(L^p)<epsilon/2$, and then we are done.

    Proof of $"(iii)" ==> "(i)"$: Let $epsilon > 0$. We need to show that we can write $f = f_p + f_oo$ with $f_p in L^p$ and $norm(f_oo)_(L^oo)<epsilon$. By assumption we can find $R$ large enough so that $norm(bb(1)_(B_R^c) f)_(L^p + L^oo) < epsilon$. So we can write $bb(1)_(B_R^c) f = g_p + g_oo$ with $g_p in L^p$ and $norm(g_oo)_(L^oo)<epsilon/2$. Then we can write $f = (bb(1)_(B_R) f + g_p) + g_oo$, which provides the required decomposition.
  + Q: Let $h_n,h in L^oo, h_n ->^(L^oo) h$ and suppose $mu(|h_n|>eta) < oo$ for all $eta>0$. Show that $mu(|h|>eta) < oo$ for all $eta>0$.
    Proof: Let $eta > 0$. By assumption there is an $n$ such that $norm(h_n - h)_(L^oo)<eta/2$. Then $mu(|h|>eta) <= mu(|h_n|>eta/2)$, which is finite by assumption.
  + Show that $L^p + L^oo_epsilon$ is a closed subspace of $L^p + L^oo$.
    Proof: Let $f_n in L^p + L^oo_epsilon$ be a sequence converging to $f in L^p + L^oo$. We need to show that $f in L^p + L^oo_epsilon$. We can decompose $f_n = f_p_n + f_oo_n$ with $f_p_n in L^p$ and $norm(f_oo_n)_(L^oo)<epsilon/2$. Since $f_n -> f$ in $L^p + L^oo$, we can find a decomposition $f - f_n = g_p_n + g_oo_n$ with $g_p_n in L^p$ and $ norm(g_oo_n)_(L^oo)<inf_(f - f_n = a_p + a_oo) norm(a_p)_(L^p) + norm(a_oo)_(L^oo) + epsilon/2 < epsilon. $ Then we can write $f = (f_p_n + g_p_n) + (f_oo_n + g_oo_n)$, which provides the required decomposition.
  + Q: show that the closure of $C^oo_c$ in $L^p+L^oo$ is $L^p + L^oo_epsilon$.
    Proof: by the previous question we know that $overline(C^oo_c) subset.eq L^p + L^oo_epsilon$. For the reverse inclusion, just find a negligible decomposition of $f in L^p + L^oo_epsilon$, drop the negligible part and approximate the $L^p$ part by a compactly supported function.
+ (Hardy's inequality)
  + Let $d>=3$. Show that for all $psi in H^1(RR^d)$, we have $integral_(RR^d) abs(psi)^2/abs(x)^2 dd x <= 4/(d-2)^2 integral_(RR^d) abs(grad psi)^2 dd x$ by expanding the square $integral_(RR^d) abs(grad psi + alpha x/abs(x)^2 psi)^2 dd x$ and optimizing over $alpha$. Proof:
    $
      #let intr = $integral_(RR^d)$
      0 <= intr abs(grad psi + alpha x/abs(x)^2 psi)^2 dd x = intr abs(grad psi)^2 dd x + alpha^2 intr abs(psi)^2/abs(x)^2 dd x + 2 alpha intr Re(overline(psi) x/abs(x)^2 dot grad psi) dd x.
    $
    Then we write $nabla|psi|^2 =Re(2overline(psi) nabla psi)$ and integrate by parts to see
    $
      intr Re(overline(psi) x/abs(x)^2 dot grad psi) dd x = intr x/abs(x)^2 dot nabla|psi|^2 dd x = -intr nabla dot (x/abs(x)^2) |psi|^2 dd x = -(d-2) intr abs(psi)^2/abs(x)^2 dd x.
    $
    This implies
    $
      (alpha(d-2)-alpha^2) intr abs(psi)^2/abs(x)^2 dd x <= intr abs(grad psi)^2 dd x.
    $
    By completing the square we see that the quadratic is maximized with value $(d-2)^2/4$,  which gives the result.
  + Q is to show above result extends to $H^1$ functions - standard density argument.
  + Q is to use  $u(x) = f(abs(x))$ with $f(r) = r^(-alpha) 1_(r <= 1) + (2-r) 1_(1 <= r <= 2)$, where $alpha < (d-2)/2$ to show optimality of the above constant. Proof: For radial functions, $integral_(RR^d) g(abs(x)) dif x = abs(S^(d-1)) integral_0^oo g(r) r^(d-1) dif r$ Hence
    $
      integral_(RR^d) abs(u(x))^2 / abs(x)^2 dif x
      = abs(S^(d-1)) lr(integral_0^1 r^(d-3-2 alpha) dif r + integral_1^2 (2-r)^2 r^(d-3) dif r)
      = abs(S^(d-1)) lr(1/(d-2-2 alpha) + A_d),
    $

    where
    $A_d := integral_1^2 (2-r)^2 r^(d-3) dif r < oo$.
    Also,
    $f'(r) = -alpha r^(-alpha-1)$ on $(0,1)$ and $f'(r) = -1$ on $(1,2)$, so
    $integral_(RR^d) abs(grad u(x))^2 dif x
    = abs(S^(d-1)) lr(alpha^2 integral_0^1 r^(d-3-2 alpha) dif r + integral_1^2 r^(d-1) dif r)
    = abs(S^(d-1)) lr(alpha^2/(d-2-2 alpha) + B_d)$,

    where $B_d := integral_1^2 r^(d-1) dif r < oo$. Therefore
    $ (integral_(RR^d) abs(u(x))^2 / abs(x)^2 dif x)
    / (integral_(RR^d) abs(grad u(x))^2 dif x)
    = (1/(d-2-2 alpha) + A_d) / (alpha^2/(d-2-2 alpha) + B_d) $.

    Letting $alpha -> (d-2)/2$,
    $ (integral_(RR^d) abs(u(x))^2 / abs(x)^2 dif x)
    / (integral_(RR^d) abs(grad u(x))^2 dif x)
    -> 1 / ((d-2)/2)^2 = (2/(d-2))^2 $, which shows optimality of the constant.
  + Q is to show the stability of the hydrogen atom - i.e. that $cal(E)(psi) >= -C$ for some $C>0$. Proof: By Hardy's inequality we have
    $
      cal(E)(psi) = integral_(RR^3) abs(grad psi)^2 dd x - integral_(RR^3) abs(psi)^2/abs(x) dd x >= 1/4 integral_(RR^3) abs(psi)^2/abs(x)^2 dd x - integral_(RR^3) abs(psi)^2/abs(x) dd x.
    $
    Then we complete the square $t^2 - 4 t = (t-2)^2 - 4$ to obtain the bound
    $
      cal(E)(psi) >= -1 integral_(RR^3) abs(psi)^2 dd x = -1.
    $
    Curiously worse than the result from Sobolev inequality.
+ (Particle confined in $RR^d$)
  Let $V$ be a real-valued measurable function such that
  $V_- = max(-V, 0) in L^p (RR^d, RR) + L^infty (RR^d, RR)$, where $p$ satisfies (1.37)
  and $V_+ = max(V, 0) in L_"loc"^1(RR^d)$ with $V_+(x) -> +infty$ when
  $abs(x) -> +infty$. We consider the energy

  $
    cal(E)(psi) = integral_(RR^d) abs(grad psi(x))^2 dif x
    + integral_(RR^d) V(x) abs(psi(x))^2 dif x
  $

  and the space
  $cal(V) := { psi in H^1(RR^d) : sqrt(V_+) psi in L^2(RR^d) }$
  equipped with the norm

  $
    norm(psi)^2_(cal(V)) = norm(psi)^2_(H^1(RR^d))
    + integral_(RR^d) V_+(x) abs(psi(x))^2 dif x.
  $

  1. Show that $cal(V)$ is complete. Proof: Let $psi_n$ be a Cauchy sequence in $cal(V)$. Then $psi_n$ is a Cauchy sequence in $H^1(RR^d)$, so there is a $psi in H^1(RR^d)$ such that $psi_n harpoon^(H^1) psi$.  As $psi_n$ is bounded in $cal(V)$, $sqrt(V_+) psi_n$ is bounded in $L^2(RR^d)$, so by Fatou's lemma, $intr V_+|psi|^2 <= liminf_n intr V_+|psi_n|^2 <= C < oo$. It follows that $psi in cal(V)$. So $cal(V)$ is a closed subspace of $H^1$, hence complete.
  2. Show that $cal(E)$ is well defined and continuous on $cal(V)$. Proof: well-definedness follows immediately from the previous part, with the bound $cal(E)(psi) <= norm(psi)^2_(cal(V))$ and $abs(cal(E)(psi)) <= C norm(psi)^2_(cal(V))$ (using Sobolev inequality and the definition of $p$). For the continuity let $psi_n ->^cal(V) psi$ and let $M = sup_n norm(psi_n)_cal(V)$. Then
  $
    |cal(E)(psi_n) - cal(E)(psi)| & <= intr abs(nabla psi_n + nabla psi)abs(nabla psi_n - nabla psi) + intr V abs(psi_n + psi)abs(psi_n - psi) \
    & <= norm(psi_n + psi)_(cal(V)) norm(psi_n - psi)_(cal(V)) <= (C+2 M) norm(psi_n - psi)_(cal(V))
    -> 0.
  $
  3. Show that
    $I = inf { cal(E)(psi) : psi in cal(V), integral_(RR^d) abs(psi)^2 = 1 }$
    is finite. Proof: this is immediate from the case given in lectures by just dropping the positive part of $V$.
  4. Show that $cal(V)$ is compactly embedded into $L^2(RR^d)$. Proof: As a subspace of $H^1$, we have local compactness, but we have more due to $V_+$. Let $norm(v_n)_cal(V) <= C$. For any $R$, we have up to a subsequence that $v_n bb(1)_(B_R (0))$ converges strongly in $L^2$, which defines a limit $v in L^2_"loc"$. Let $K_R = inf_(B_R(0)^c) V stretch(->)_(R->oo) oo$. Then from $(a+b)^2 ≤ 2a^2 + 2b^2$, we get the bound
    $
      4C>integral_(|x|>R) V abs(v_n - v)^2 > K_R norm(v_n - v)_(L^2(B_R (0)^c))
    $
    We can combine these as follows. Let $epsilon > 0$. Choose $R$ so that $C/K_R < epsilon/2$. Then up to a subsequence, we get that for large enough $n$, $norm(v_n - v)_(L^2(RR^d)) <= epsilon/2 + C/K_R = epsilon$, whence the result.
  5. Deduce that $I$ is attained and write the equation satisfied by any minimizer.

    Proof: As in the case provided in the text, it is clear that $cal(E)$ is coercive (in the sense defined in the text, i.e. subsets of bounded $cal(E)$ are bounded in $cal(V) subset H^1$ and wlsc. So if we take a minimizing sequence in $cal(V)$ with unit $L^2$ norm, we find (up to a subsequence) that it weakly converges to $psi in cal(V)$, with $norm(psi)_(L^2) <= 1$. But as $cal(V) Subset L^2$, we find in fact strong convergence in $L^2$, so in fact $norm(psi)_(L^2) = 1$ as needed.

    As for the equation, it comes from showing that the energy has zero derivative at the minimizer along a path of admissible functions as in the text. One gets the Schrödinger equation.

  Haven't solved the below yet...

  6. Show the uniqueness of the minimizer up to a phase when
    $V_+ in L_"loc"^1(RR^d)$. You can follow the arguments of Sect. 1.6 and use
    [LL01, Thm. 9.10] instead of (1.63) to show the strict positivity of $psi$,
    locally.
  7. We now consider the harmonic oscillator
    $V(x) = omega^2 abs(x)^2$ which corresponds to attaching our quantum
    particle to a spring nailed at the origin, $omega$ being related to the
    stiffness of the spring.

    a. Show that

    $
      cal(E)(psi) = integral_(RR^d) abs(grad psi(x) + omega x psi(x))^2 dif x
      + omega d integral_(RR^d) abs(psi(x))^2 dif x
    $

    for all $psi in cal(V)$. This formula is the equivalent, for the harmonic
    oscillator, of the relation (1.28) for the hydrogen atom and of the ground
    state resolution (1.64).

    b. Deduce that $I = omega d$ and that the minimizers are all of the form

    $
      psi(x) = (omega/pi)^(d/4) e^(i theta) e^(-omega abs(x)^2 / 2), quad theta in RR.
    $

    c. Show Heisenberg's inequality (1.21) by optimizing over $omega$.
