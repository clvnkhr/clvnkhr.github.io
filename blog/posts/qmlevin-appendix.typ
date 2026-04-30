// date: 2024-04-24
// tags: maths, notes, quantum-mechanics, sobolev-spaces, functional-analysis
// hidden: true

#import "../templates/math.typ": html_fmt
// #show: html_fmt

#set document(title: "Notes on Lewin's QM book - Appendix")
#title()

#let footnote-ac-w11 = [In fact, $W^(1,1)([0,1]) = "AC"([0,1])$. the space $"AC"$ of absolutely continuous functions is given by the following modification of uniform continuity -- instead of saying that we have $epsilon$ control on any $delta$ interval, we require this control on arbitrary finite collections of disjoint intervals, whose total length is at most $delta$. This helps rule out counterexamples like the Cantor function, where the $epsilon$ control is maintained on each small interval, but not on a null set (which can be approximated by a collection of intervals of small total length).

  One direction is trivial-Given $f in W^(1,1)$, as in this note we have $f(x) = f(0) + integral_0^x f'(t) dif t$. Thus given $epsilon>0$ and any sequence of disjoint intervals $I_k = (a_k, b_k)$ with $sum_k |I_k| ≤ delta$, we have $ sum_k |f(b_k) - f(a_k)| = sum_k abs(integral_(a_k)^(b_k) f'(t) dif t) ≤ sum_k integral_(a_k)^(b_k) |f'(t)| dif t = integral_(union.big_k I_k) |f'(t)| dif t ≤ delta ||f'||_(L^1). $
  The converse is harder. Sketch - AC implies $f in C^0 subset L^1$ obviously. It also implies BV and hence the distributional derivative $f'$ is a finite signed Radon measure $mu$. We can write $mu = g dif x + mu_s$ where $g in L^1$ and $mu_s$ is singular, supported on some Lebesgue null set $E$. By the regularity of Radon measures, we can find a cover of $E$ by disjoint open intervals $(a_k, b_k)$ with arbitrarily small total length $delta$. Then $|mu_s| <= sum_k |f(b_k) - f(a_k)| < epsilon$, showing $mu_s = 0$. Then one can check that $g=f'$, proving the result.
]

= Appendix A: Sobolev Spaces
== Definition

Definition of $W^(k,p)$ is given, and the Meyer-Serrin theorem $H=W$ is stated without proof.

== Sobolev spaces on the interval
Considering $f in L^1$ with distributional derivative $f' in L^1$. Then $g(x) := integral_0^x f(t) dif t$ is continuous#footnote(footnote-ac-w11) on $[0,1]$ and $g'=f'$ in $cal(D)'$, so $f$ is  a.e. equal to a continuous function on $[0,1]$, and we identify $f$ with this continuous representative. This lets us write $f(x) = f(0) + integral_0^x f'(t) dif t$. This implies that $f(x) = f(y) + integral_y^x f'(t) dif t$, which after integrating, implies the estimate
$
  max_(x in [0,1]) |f(x)| ≤ ||f||_(L^1) + ||f'||_(L^1) = ||f||_(W^(1,1)).
$
If $f in H^1$, we can use this estimate on $|f|^2 in L^1$ with the identity
$
  (|f|^2)' = (f overline(f))' = f' overline(f) + f overline(f') = 2 Re(f' overline(f)) in L^1
$
to get the variant inequality
$max_(x in [0,1]) |f(x)|^2 ≤ ||f||^2_(L^2) + 2||f||_(L^2)||f'||_(L^2),$ or after the subadditivity of the square root,
$
  max_(x in [0,1]) |f(x)| ≤ ||f||_(L^2) + sqrt(2 ||f||_(L^2) ||f'||_(L^2)).
$

=== Exercise A.3 - Density of smooth functions

Let $f in H^1$. (1) Construct $f_n$ in $C^oo$ with $f_n -> f$ in $H^1$. (2) If we further assume that $f(0)=f(1)=0$, then do the same with $f_n in C^oo_c$. (3) Finally, extend this result to $H^k$.
Solutions
+ Extend $f$ by zero outside $[0,1]$ to get a function in $H^1(RR)$. Then convolve with a mollifier $phi_n (x)=n phi(n x)$ for $phi in C^oo_c ([-1,1])$ with $phi>=0, integral phi = 1$ to get the desired sequence of smooth functions - one gets
  $
    ||phi_n * f - f||_p <= integral |phi_n (y)| ||f(. - y) - f||_p dif y -> 0
  $
  and similarly with the derivative, whence the result.
+ We use a cutoff $chi in C^oo_c ([0,2/3])$ with $chi|_([0,1/3])=1$ to define $f^1 equiv chi f$ and $f^2 = (1-chi) f$. Then $f = f^1 + f^2$. We focus on $f^1$; how to treat $f^2$ will be clear. We extend $f^1$ to a function on $RR$ that is zero for $x>2/3$ or $x<0$. By the given boundary conditions, $f^1 in H^1$. Indeed, the derivative of the extension by zero will have the term $f(0)delta_0 in.not L^2$ unless $f(0)=0$.
  We next need $f^1_n in C^oo_c$ that converge in $H^1$ to $f^1$.  To do this we modify the convolution formula by setting
  $ f^1_n (x) = integral_(BB_(1/n)(0)) phi_n (y) f^1 (x-y - 2/n) dif y = phi_n * f^1 (x - 2/n). $
  Then $f_n in C^oo$ and is zero if $x<=1/n$ or $x>2/3-1/n$, and for the convergence we have
  $
    ||f^1_n - f^1||_p <= lr(||phi_n * f^1(x - 2/n) - phi_n * f^1||)_p + ||phi_n * f^1 - f^1||_p
  $
  The first term converges by Young's inequality for convolutions and the second by good kernel properties. One can then repeat this for $(f^1)'$ and then symmetrically for $f^2$ to get the result.
+ Exactly the same method works for $H^k$.
=== Elliptic Regularity on $(0,1)$
This is the statement that if $f, f'' in L^2$ then $f' in C^0$ with the estimate
$max_(x in [0,1]) |f'(x)| ≤ C (||f||_(L^2) + ||f''||_(L^2))$.
We recap the proof given on $[0,1]$.
Put $w(y) = y(1-y)$.
First, we know that $f'' in L^2 subset L^1$ implies that $f in C^(1,1/2)$. Then we write $f'(y) = f'(0) + integral_0^y f''(t) dif t$, and integrate it against $w$:
$
  integral_0^1 w(y) f'(y) dif y = f'(0) integral_0^1 w(y) dif y + integral_0^1 w(y) integral_0^y f''(t) dif t dif y.
$
Integrating by parts we get $integral_0^1 w(y) f'(y) dif y = lr(w(y)f(y)#v(1.5em)|)_0^1 - integral_0^1 w'(y) f(y) dif y$. The boundary term vanishes since $w(0)=w(1)=0$. For the second term on the right, we write
$
  & integral_0^1 w(y) integral_0^y f''(t) dif t dif y \
  & = lr(integral_0^y w(t) dif t integral_0^y f''(t) dif t|)_(y=0)^1 - integral_0^1 integral_0^y w(t) dif t f''(y) dif y \
  & = integral_0^1 (integral_y^1 w(t) dif t) f''(y) dif y.
$
This gives the identity
$
  f'(0) = -1/(integral_0^1 w) (integral_0^1 w' f - integral_0^1 (integral_y^1 w) f'').
$
This leads to a bound of $f'$ using only $f$ and $f''$. We see that $w$ was introduced so that we could use $w(0)=w(1)=0$ (and $integral_0^1 w != 0$).

=== Exercise A.4 - Half line $[0,oo)$
+ Show that $H^1 arrow.hook C^0_0$
+ Show that $C^oo$ is dense in $H^1$, and that $H^1_0$ is the space of functions in $H^1$ that vanish at zero.
+ Prove the elliptic estimate (bound $f'$ by $f$ and $f''$.)

Solutions:
+ All the estimates trivially carry over as we can just restrict $f$ to an interval and use the previous estimates. The only new thing we need to show is that $f(x) -> 0$ as $x -> oo$. But this follows from the fact that $sum_n ||f||_(H^1([n,n+1])) = ||f||_(H^1([0,oo))) < oo$ and the $L^oo$ estimate
  $
    sup_(x in [n,n+1]) |f(x)| lt.tilde ||f||_(H^1([n,n+1])) -> 0.
  $
+ Same proof works.
+ The result follows immediately by restricting $f$ to intervals. But we could also redo the proof with some weight $w in L^1$ such that $w' in L^(p')$ and $lim_(abs(x)->oo) w(x) = 0$.

=== The Sobolev Space $H^s (RR^d)$

The usual norm for $s in NN$ is $||f||_(H^s)^2 = sum_(|alpha|≤ k) ||D^alpha f||^2_(L^2)$. Note that we have the trivial inequality
$|xi^alpha|^2 ≤ |xi|^(2|alpha|) ≤ (1 + |xi|^2)^(|alpha|)$, and also by multinomial theorem that $|xi|^(2s) = (xi_1^2 + ... + xi_d^2)^s = sum_(|beta|=s) |xi^beta|^2$. This implies by Fourier transform the equivalence of norms. This is also equivalent to the 'elliptic estimate' $||f||_(H^s) ≤ C (||f||_(L^2) + ||Delta^(s/2) f||_(L^2))$.


=== Trace, Lifting and Extension on a Bounded Open Set
First the half-space $Omega = {x = (x_1, ..., x_d) : x_d > 0}$ is treated. For general spaces the $L^p$ and $H^s$ spaces are defined by local charts and partitions of unity, so the half-space case is the main one to understand.

Recall that if $integral |f| < oo$ then $|f| < oo$ a.e.
So if $f in H^1(Omega)$, then for a.e. $x'=(x_1, ..., x_(d-1))$, the function $g_(x')(x_d) := f(x', x_d)$ belongs to $H^1((0,oo))$ by Fubini's theorem -
$
  integral_(RR^(d-1)) integral_0^oo (|g_(x')(x_d)|^2 + |g'_(x')(x_d)|^2) dif x_d dif x' = integral_(RR^(d-1)) integral_0^oo (|f(x', x_d)|^2 + |partial_(x_d) f(x', x_d)|^2) dif x_d dif x' < oo
$
So for a.e. $x'$, $g_(x')$ coincides a.e. in $x_d$ with a continuous function on $[0,oo)$ that vanishes at infinity by earlier exercise. We can then define the trace of $f$ at $x_d=0$ to be this continuous representative, which is well-defined for a.e. $x'$. This gives us a well-defined and bounded (again, by earlier exercise) trace operator $T : H^1(Omega) arrow L^2(RR^(d-1))$.

For $H^k$, $k>1$, the trace map is
$T: H^k (Omega) -> L^2(partial Omega)^k$, mapping
$
  f mapsto (f|_(partial Omega), partial_n f|_(partial Omega), ..., partial_n^(k-1) f|_(partial Omega))
$
with the bound
$
  sum_(j=0)^(k-1) ||partial_n^j f|_(partial Omega)||_(L^2(partial Omega)) ≤ C ||f||_(H^(k-1) (Omega))||f||_(H^k (Omega)).
$

Stated without proof:
- $f in H^k_0 (Omega)$ iff $f in H^k$ and $T f = 0$.
- Theorem A.10 ("smooth lifting"): Given continuously differentiable boundary values we can find $f in H^k (Omega)$ such that $T f$ equals the given boundary values.
- Fractional Sobolev space defined by weighted integral of difference quotient $H^s (Omega)$ to state that this space is the image of $H^s (RR^d)$ under the restriction map, and that the trace map is (or rather can be) bounded from $H^s (Omega)$ to $H^(s-1/2) (partial Omega)$.

=== Sobolev Embedding and Rellich-Kondrachov Compactness

Interesting version of Sobolev embedding is proven- let $d>=1$ and $0<s<d/2$. For any $f in L^1_"loc"(RR^d) inter cal(S)'$ such that the superlevel sets ${f > M}$ have finite measure for all $M > 0$, then
$
  ||f||_(L^(2^*)) ≤ C ||(-Delta)^(s/2) f||_(L^2).
$
where $p^*$ is the number such that $1/p^* = 1/2 - s/d$. There is a version for Bessel potential spaces with $p != 2$, but the proof
given only extends to $p>=2$ with the Hausdorff-Young inequality.

Then a version o the RK Compactness theorem is given - if $Omega$ is a bounded open set, then the embedding $H^s (Omega) arrow.hook L^2 (Omega)$ is compact for any $s > 0$. (Here $H^s (Omega)$ is the space of restrictions of functions in $H^s (RR^d)$.) The proof uses the Fourier transform and the fact that the Fourier transform of a compactly supported function is smooth and decays at infinity. In particular this lemma is used-
Let $F in L^oo(RR^d)$ decay at infinity, and let $G in L^1(RR^d)$. Then $g mapsto (G * g)F$ is compact on $L^2(RR^d)$.

Here it is used that compactness means upgrading from from weak convergence to strong convergence. This is equivalent to the usual extraction of convergent subsequences on reflexive spaces (so not $L^1$). In one direction it is used that every subsequence has a further subsequence that converges, and in the other direction Banach-Alaoglu is used to get a weakly convergent subsequence, and then the compactness is used to upgrade to strong convergence.

Evans has a slightly sharper version of the theorem, namely that $W^(s,p)$ is compactly embedded in $L^q$ for $1 <= q < p^*$.

=== Elliptic Regularity on bounded domains
Without conditions on $f$ at the boundary, the result is false. The example given is the Fundamental solution of the Laplacian translated to the boundary, which is in $L^2$ and has $Delta f in L^2$, but is not in $H^1$ if the boundary supports a cone. The elliptic regularity result holds under Robin boundary conditions.


