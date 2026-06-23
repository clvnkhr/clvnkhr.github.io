// date: 2026-06-02
// tags: maths, fluid-dynamics, notes, transcription, ai-assisted
// hidden: false


#set document(title: [Navier--Stokes Existence or Breakdown])
#title()

This is an AI-generated survey distilled from #link("https://www.youtube.com/watch?v=3j1VW9REm7s&pp=ygUNZ29tZXogc2VycmFubw%3D%3D")[a talk by Javier Gómez-Serrano], lightly edited but not independently checked line by line. Treat it as a dense orientation map, not as a reference text.

== Problem

The #link("https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_existence_and_smoothness")[Navier--Stokes existence and smoothness problem] asks whether smooth divergence-free data for 3D incompressible Navier--Stokes on $RR^3$ or $TT^3$ generate smooth solutions for all time, or whether some smooth datum develops a finite-time singularity. It is one of the Clay Millennium Prize Problems.

For velocity $u(x,t)$, pressure $p(x,t)$, density $rho$, viscosity $nu$, and force $f$,

$ partial_t u + (u dot nabla) u = - nabla p + nu Delta u + f, quad nabla dot u = 0. $

With $nu = 0$ this is incompressible Euler; with $nu > 0$ it is incompressible Navier--Stokes. The nonlinear term $(u dot nabla)u$ lets the flow advect itself. Incompressibility removes simple compression blowup. Pressure is nonlocal: taking divergence gives

$ - Delta p = nabla dot ((u dot nabla) u) = sum_(i,j=1)^3 partial_i partial_j (u_i u_j), $

and hence, in $RR^3$,

$
  p(x,t) = frac(1, 4 pi) integral (frac(3 (x_i - y_i)(x_j - y_j), abs(x - y)^5) - frac(delta_(i j), abs(x - y)^3)) u_i (y,t) u_j (y,t) d y .
$

Thus $p$ is determined instantaneously by $u$ through a singular integral.

The Clay alternatives are:

- #strong[global regularity:] every smooth divergence-free $u_0$ yields a smooth solution for all time;
- #strong[finite-time breakdown:] some smooth divergence-free $u_0$ yields blowup of $u$ or its derivatives in finite time.

One can also separate three logical possibilities: global smooth uniqueness; singularity with uniqueness; singularity with nonuniqueness. Ladyzhenskaya's emphasis was often uniqueness versus nonuniqueness.

== Historical scale

Da Vinci already described eddies nested across scales and used #emph[turbolenza]. Bernoulli's *Hydrodynamica* (1738) linked velocity and pressure; d'Alembert's inviscid drag calculation led to the 1752 #emph[d'Alembert paradox]; Euler wrote the inviscid incompressible equations around 1757; Prandtl's 1904 boundary layer theory explained how small viscosity can still produce drag near boundaries. The modern problem sits on this tension: inviscid structure, viscous smoothing, boundary effects, and multiscale transfer.

== Weak solutions

For unforced Navier--Stokes,

$ partial_t u + (u dot nabla) u + nabla p = nu Delta u, quad nabla dot u = 0, $

a weak solution satisfies the equation after testing against smooth compactly supported divergence-free fields $phi$:

$
  integral_0^oo integral ( u dot partial_t phi + (u ⊗ u) : nabla phi + nu nabla u : nabla phi ) d x d t + integral u_0 (x) dot phi(x, 0) d x = 0 .
$

A strong solution is weak; not conversely.

A Leray--Hopf weak solution also satisfies the energy inequality

$ 1 / 2 norm(u(t))_(L^2)^2 + nu integral_0^t norm(nabla u(s))_(L^2)^2 d s <= 1 / 2 norm(u_0)_(L^2)^2 . $

Leray (1934) proved global existence for divergence-free $u_0 in L^2(RR^3)$:

$ u in L_t^oo L_x^2 inter L_t^2 dot(H)_x^1, $

with the energy inequality and smoothness away from a small exceptional set; the set of singular times has zero $1/2$-dimensional #link("https://en.wikipedia.org/wiki/Hausdorff_measure")[Hausdorff measure].#footnote[J. Leray, "Sur le mouvement d'un liquide visqueux emplissant l'espace," *Acta Math.* 63, 193--248 (1934). #link("https://doi.org/10.1007/BF02547354")[DOI] #link("https://zbmath.org/60.0726.05")[Zbl]] Hopf (1951) extended the theory to bounded domains with no-slip boundary conditions.#footnote[E. Hopf, "Über die Anfangswertaufgabe für die hydrodynamischen Grundgleichungen," *Math. Nachr.* 4, 213--231 (1951). #link("https://doi.org/10.1002/mana.3210040121")[DOI] #link("https://zbmath.org/0042.10604")[Zbl]] Global weak solutions exist; smoothness and uniqueness in 3D remain open.

== Two dimensions

Ladyzhenskaya proved global well-posedness for 2D incompressible Navier--Stokes: for divergence-free $u_0 in L^2(RR^2)$ there is a unique global solution

$ u in C([0,oo); L^2) inter L_("loc")^2 ((0,oo); H^1), $

smooth for $t > 0$ and continuous in the data.#footnote[O. A. Ladyzhenskaya, "Solution 'in the large' of the nonstationary boundary value problem for the Navier-Stokes system in two space variables," *Comm. Pure Appl. Math.* 12, 427--433 (1959). #link("https://doi.org/10.1002/cpa.3160120303")[DOI] #link("https://zbmath.org/0103.19502")[Zbl]; also *The Mathematical Theory of Viscous Incompressible Flow*, 2nd ed., Gordon & Breach (1969).]

The 2D estimate

$ norm(u)_(L^4) <= C norm(u)_(L^2)^(1 / 2) norm(nabla u)_(L^2)^(1 / 2) $

closes the energy method. In 3D the analogous

$ norm(u)_(L^4) <= C norm(u)_(L^2)^(1 / 4) norm(nabla u)_(L^2)^(3 / 4) $

puts too much weight on $nabla u$; the same proof fails.

== Partial regularity

A suitable weak solution satisfies the local energy inequality

$
  partial_t ( frac(abs(u)^2, 2) ) + op("div")(( frac(abs(u)^2, 2) + p ) u) - nu Delta ( frac(abs(u)^2, 2) ) + nu abs(nabla u)^2 <= 0
$

in distributions. Scheffer (1977) proved the singular set has parabolic Hausdorff dimension at most $5/3$ (later improved to at most $2$).#footnote[V. Scheffer, "Hausdorff measure and the Navier-Stokes equations," *Comm. Math. Phys.* 55, 97--112 (1977). #link("https://doi.org/10.1007/BF01626512")[DOI] #link("https://zbmath.org/0357.35071")[Zbl]] Caffarelli--Kohn--Nirenberg (1982) proved its one-dimensional parabolic Hausdorff measure is zero.#footnote[L. Caffarelli, R. Kohn, and L. Nirenberg, "Partial regularity of suitable weak solutions of the Navier-Stokes equations," *Comm. Pure Appl. Math.* 35, 771--831 (1982). #link("https://doi.org/10.1002/cpa.3160350604")[DOI] #link("https://zbmath.org/0509.35067")[Zbl]] Thus singularities, if present, cannot contain a spacetime curve of positive parabolic length.

== Vorticity

Let

$ omega = nabla times u . $

Using

$ (u dot nabla) u = frac(1, 2) nabla abs(u)^2 - u times omega $

and

$
  nabla times (u times omega) = (omega dot nabla) u - (u dot nabla) omega + u (nabla dot omega) - omega (nabla dot u),
$

with $nabla dot u = 0$ and $nabla dot omega = 0$, the curl equation is

$ partial_t omega + (u dot nabla) omega = (omega dot nabla) u + nu Delta omega . $

The term $(omega dot nabla)u$ is vortex stretching.

The Biot--Savart law recovers velocity from vorticity:

$ u(x,t) = frac(1, 4 pi) integral frac((x - y) times omega(y, t), abs(x - y)^3) d y . $

Hence $nabla u$ is a Calderón--Zygmund singular integral of $omega$, and stretching has the schematic form $omega dot T(omega)$: quadratic, nonlocal, and sign-indefinite.

In 2D, $u = (u_1,u_2,0)$ is independent of $x_3$ and

$ omega = (0, 0, partial_1 u_2 - partial_2 u_1). $

Then $(omega dot nabla)u = omega_3 partial_3 u = 0$, so

$ partial_t omega + u dot nabla omega = nu Delta omega . $

2D vorticity is transported and diffused. In 3D, stretching is active. Writing $alpha = omega / abs(omega)$,

$
  (partial_t + u dot nabla - nu Delta) abs(omega) = (alpha dot nabla) u dot alpha abs(omega) + nu abs(nabla alpha)^2 abs(omega) .
$

The first right-hand term is strain-driven amplification; the second records geometric variation of vorticity direction.

== Scaling and energy

Navier--Stokes is invariant under

$ u_lambda (x,t) = lambda u(lambda x, lambda^2 t). $

Then

$
  norm(u_lambda (dot, t))_(L^2) = lambda^(-1/2) norm(u(dot, lambda^2 t))_(L^2).
$

Energy is supercritical: it becomes weaker under zooming. Critical norms include $dot(H)^(1/2)$, $L^3$, and $"BMO"^(-1)$. The energy inequality controls $u in L_t^oo L_x^2$ and $nabla u in L_t^2 L_x^2$, but not the critical quantities needed to rule out concentration. Energy methods alone are therefore structurally insufficient; model systems with the same soft energy properties can blow up.

== Classical local theory and criteria

Fujita--Kato local well-posedness gives, for $u_0 in dot(H)^(1/2)(RR^3)$, a unique mild solution on $[0,T)$,

$ u in C([0,T); dot(H)^(1/2)) inter L^2 ((0,T); dot(H)^(3/2)), $

with Duhamel formula

$ u(t) = e^(nu t Delta) u_0 - integral_0^t e^(nu (t - s) Delta) PP (u(s) dot nabla) u(s) d s, $

where $PP$ is the #link("https://en.wikipedia.org/wiki/Leray_projection")[Leray projection]. For $u_0 in H^s$, $s > 1/2$, one has $u in C([0,T); H^s) inter L^2 ((0,T); H^(s+1))$. If $T_max < oo$, then

$ integral_0^(T_max) norm(nabla u(dot,t))_(L^oo) d t = oo, $

equivalently by Beale--Kato--Majda type criteria,

$ integral_0^(T_max) norm(omega(dot,t))_(L^oo) d t = oo . $

The Prodi--Serrin--Ladyzhenskaya criterion: a Leray--Hopf solution is smooth if

$ u in L_t^p L_x^q, quad 2 / p + 3 / q <= 1, quad q > 3. $

For $q < 6$ one combines

$ norm(u)_(L^q) <= C norm(u)_(L^2)^(1 - theta) norm(nabla u)_(L^2)^theta, quad theta = 3(1/2 - 1/q), $

with Gronwall estimates. Escauriaza--Seregin--Šverák (2003) proved the endpoint $u in L_t^oo L_x^3$ implies smoothness, using backward uniqueness for vorticity.#footnote[L. Escauriaza, G. Seregin, and V. Šverák, "$L_(3,∞)$-solutions of Navier-Stokes equations and backward uniqueness," *Russ. Math. Surveys* 58, 211--250 (2003). #link("https://doi.org/10.1070/RM2003v58n02ABEH000609")[DOI] #link("https://zbmath.org/1064.35134")[Zbl]]

Beale--Kato--Majda for Euler says blowup at $T$ forces

$ integral_0^T norm(omega(dot, t))_(L^oo) d t = oo . $#footnote[J. T. Beale, T. Kato, and A. Majda, "Remarks on the breakdown of smooth solutions for the 3-D Euler equations," *Comm. Math. Phys.* 94, 61--66 (1984). #link("https://doi.org/10.1007/BF01212349")[DOI] #link("https://zbmath.org/0573.76029")[Zbl]]

Constantin--Fefferman adds geometry: for $xi = omega / abs(omega)$, if

$ integral_0^T norm(nabla xi(dot,t))_(L^oo)^2 d t < oo, $

then no singularity occurs by time $T$.#footnote[P. Constantin and C. Fefferman, "Direction of vorticity and the problem of global regularity for the Navier-Stokes equations," *Indiana Univ. Math. J.* 42, 775--789 (1993). #link("https://doi.org/10.1512/iumj.1993.42.42034")[DOI] #link("https://zbmath.org/0837.35113")[Zbl]] Blowup requires not only large vorticity but sufficiently violent directional oscillation.

== Critical spaces

Koch--Tataru (2001) proved global well-posedness for small data in $"BMO"^(-1)$: if $norm(u_0)_("BMO"^(-1)) < epsilon$, then there is a unique global mild solution

$ u in L_t^oo "BMO"^(-1) inter L_t^2 C^(0, 1 / 2) $

solving

$ u(t) = e^(nu t Delta) u_0 - B(u,u)(t), $

where

$ B(u,v)(t) = integral_0^t e^(nu (t-s) Delta) PP (u(s) dot nabla) v(s) d s. $

Moreover $t^(1/2) norm(u(dot,t))_(L^oo) <= C norm(u_0)_("BMO"^(-1))$, and $u$ is smooth for $t > 0$.#footnote[H. Koch and D. Tataru, "Well-posedness for the Navier-Stokes equations," *Adv. Math.* 157, 22--35 (2001). #link("https://doi.org/10.1006/aima.2000.1937")[DOI] #link("https://zbmath.org/0972.35084")[Zbl]]

Bourgain--Pavlović (2008) showed ill-posedness in the larger critical Besov space $dot(B)_oo^(-1, oo)$: for every $delta, epsilon > 0$, smooth $u_0$ can satisfy $norm(u_0)_(dot(B)_oo^(-1, oo)) < delta$ while $norm(u(epsilon))_(dot(B)_oo^(-1, oo)) > 1/delta$.#footnote[J. Bourgain and N. Pavlović, "Ill-posedness of the Navier-Stokes equations in a critical space in 3D," *J. Funct. Anal.* 255, 2233--2247 (2008). #link("https://doi.org/10.1016/j.jfa.2008.07.008")[DOI] #link("https://arxiv.org/abs/0807.0882")[arXiv] #link("https://zbmath.org/1161.35037")[Zbl]] This norm inflation comes from high-frequency data near $N$ whose quadratic interaction transfers energy to frequencies near $N^2$ before viscosity dominates. Thus $"BMO"^(-1)$ is essentially the largest critical well-posedness space.

Germain--Pavlović--Staffilani (2007) proved that Koch--Tataru solutions are real analytic in space for $t > 0$ and satisfy

$ norm(partial^alpha u(dot, t))_(L^oo) <= C_alpha t^(-(abs(alpha) + 1) / 2) $

for every multi-index $alpha$.#footnote[P. Germain, N. Pavlović, and G. Staffilani, "Regularity of solutions to the Navier-Stokes equations evolving from small data in $"BMO"^(-1)$," *Int. Math. Res. Not.* 2007, rnm087 (2007). #link("https://doi.org/10.1093/imrn/rnm087")[DOI] #link("https://arxiv.org/abs/math/0609781")[arXiv] #link("https://zbmath.org/1148.35063")[Zbl]] The proof expands the mild solution as a convergent power series in $u_0$ using the heat semigroup. They also proved any self-similar solution in $"BMO"^(-1)$ is smooth, complementing Nečas--Růžička--Šverák.

== Numerical and computer-assisted singularity search

Kerr (1993) simulated perturbed anti-parallel vortex tubes and saw rapid maximum-vorticity growth consistent with Euler blowup; the BKM integral appeared divergent.#footnote[R. M. Kerr, "Evidence for a singularity of the three-dimensional, incompressible Euler equations," *Phys. Fluids A* 5, 1725--1746 (1993). #link("https://doi.org/10.1063/1.858849")[DOI]] Hou--Li later used adaptive high-resolution computation and found depletion rather than blowup; Kerr's growth was an underresolution artifact near the vortex core, saturating later with algebraic scaling.#footnote[T. Y. Hou and R. Li, "Dynamic depletion of vortex stretching and non-blowup of the 3-D incompressible Euler equations," *J. Nonlinear Sci.* 16, 639--664 (2006). #link("https://doi.org/10.1007/s00332-006-0802-9")[DOI]]

Other numerical scenarios include folded vortex sheets, interacting vortex rings, multiscale structures, axisymmetric Euler with swirl (Grauer--Sideris; Cichocki), and tornado-type Navier--Stokes boundary structures. The obstacles are resolution, truncation error, artificial viscosity, and the fact that numerics alone do not prove blowup.

Computer-assisted proof strategy: compute an approximate solution $overline(u)$; write the PDE as $F(u)=0$ in a Banach space; verify Newton--Kantorovich hypotheses by bounding $F(overline(u))$ and $F'(overline(u))^(-1)$; use #link("https://en.wikipedia.org/wiki/Interval_arithmetic")[interval arithmetic] so floating-point operations enclose exact values. This turns a numerical candidate into a theorem when the analytic estimates close.

== Tao's model warnings

Hyperdissipative Navier--Stokes replaces $nu Delta$ by $nu (-Delta)^alpha$. In 3D the critical threshold is $alpha = 5/4$: $alpha > 5/4$ is subcritical and globally regular by standard methods; $alpha = 1$ is classical Navier--Stokes and supercritical. Tao (2009) proved global regularity at a logarithmically supercritical borderline, using a Fourier multiplier with symbol

$ m(xi) = abs(xi)^(5/4) / log(2 + abs(xi)^2)^(1/4), $

just stronger than critical dissipation.#footnote[T. Tao, "Global regularity for a logarithmically supercritical hyperdissipative Navier--Stokes equation," *Anal. PDE* 2, 361--366 (2009). #link("https://doi.org/10.2140/apde.2009.2.361")[DOI] #link("https://arxiv.org/abs/0906.3070")[arXiv]]

Tao also built averaged Navier--Stokes-type systems preserving energy identity, Sobolev estimates, symmetries, and scaling, yet blowing up in finite time. The nonlinearity is averaged/truncated, retaining soft features while removing cancellations; the blowup uses a self-similar ansatz and an Ornstein--Uhlenbeck-type stochastic construction. Moral: any proof for classical Navier--Stokes must use the exact nonlinearity, not only soft estimates.

== Onsager and convex integration

Onsager's conjecture for 3D Euler: weak solutions with Hölder/Besov regularity above $1/3$ conserve energy; below $1/3$ anomalous dissipation can occur. Constantin--E--Titi proved conservation if

$ u in L^3((0,T); B_(3, oo)^alpha), quad alpha > 1/3. $#footnote[P. Constantin, W. E, and E. S. Titi, "Onsager's conjecture on the energy conservation for solutions of Euler's equation," *Comm. Math. Phys.* 165, 207--209 (1994). #link("https://doi.org/10.1007/BF02099744")[DOI]]

De Lellis--Székelyhidi imported convex integration into fluids from Nash--Gromov geometry. Subsequent work reached Isett's theorem: for every $alpha < 1/3$, there exists a nonzero compactly time-supported weak Euler solution $u in C_t C_x^alpha$, hence with nonconserved energy.#footnote[P. Isett, "A proof of Onsager's conjecture," *Ann. of Math.* 188, 871--963 (2018). #link("https://doi.org/10.4007/annals.2018.188.3.4")[DOI] #link("https://arxiv.org/abs/1608.08301")[arXiv] #link("https://zbmath.org/06976275")[Zbl]] The proof uses convex integration, gluing approximation, and Mikado flows (Daneri--Székelyhidi). Buckmaster--De Lellis--Székelyhidi--Vicol further prescribed arbitrary nonnegative energy profiles $e(t)$.

== Navier--Stokes nonuniqueness

Buckmaster--Vicol (2019) proved nonuniqueness for rough weak 3D Navier--Stokes solutions: two distinct global weak solutions

$ u, v in L_t^oo L_x^2 inter L_t^2 dot(H)^1 $

can share the same finite-energy initial data $u_0 in L^2$. They may be $C^alpha$ for $alpha < 1/3$ and satisfy energy equality.#footnote[T. Buckmaster and V. Vicol, "Nonuniqueness of weak solutions to the Navier-Stokes equation," *Ann. of Math.* 189, 101--144 (2019). #link("https://doi.org/10.4007/annals.2019.189.1.3")[DOI] #link("https://arxiv.org/abs/1709.10033")[arXiv] #link("https://zbmath.org/07003146")[Zbl]] The construction uses convex integration with intermittent Beltrami flows: periodic, divergence-free, almost Beltrami fields satisfying $nabla times v approx lambda v$, frequency-separated, spatially intermittent, and equipped with a third scale to handle diffusion and nonlinear errors. The solutions are too rough to be Leray--Hopf because they do not satisfy the energy inequality.

Jia--Šverák proposed Leray--Hopf nonuniqueness via self-similar scale-invariant solutions: if the linearized operator around such a profile has an unstable eigenvalue, one constructs another solution on the unstable manifold.#footnote[H. Jia and V. Šverák, "Are the incompressible 3D Navier-Stokes equations locally ill-posed in the natural energy space?" *J. Funct. Anal.* 268, 3730--3766 (2015). #link("https://doi.org/10.1016/j.jfa.2015.01.008")[DOI] #link("https://arxiv.org/abs/1306.2136")[arXiv] #link("https://zbmath.org/1321.81011")[Zbl]]

Albritton--Brué--Colombo (2022) realized this for forced Leray--Hopf solutions: two distinct Leray--Hopf weak solutions with $u_0 = 0$ and the same smooth force $f$, built around an unstable self-similar compactly supported vortex ring in similarity variables.#footnote[D. Albritton, E. Brué, and M. Colombo, "Non-uniqueness of Leray solutions of the forced Navier-Stokes equations," *Ann. of Math.* 196, 415--455 (2022). #link("https://doi.org/10.4007/annals.2022.196.1.3")[DOI] #link("https://arxiv.org/abs/2112.03116")[arXiv] #link("https://zbmath.org/07583008")[Zbl]]

Hou--Wang--Yang announced in 2025 a computer-assisted proof of unforced Leray--Hopf nonuniqueness: a self-similar Leray--Hopf solution plus rigorous unstable eigenpair certification for the linearized operator, using high-precision computation and a decomposition into a coercive part plus compact finite-rank perturbation. The announced conclusion is infinitely many Leray--Hopf solutions for the same smooth compactly supported initial data and zero force.#footnote[T. Hou, Y. Wang, and C. Yang, "Nonuniqueness of Leray-Hopf solutions to the unforced incompressible 3D Navier-Stokes equation," arXiv:2509.25116 (2025). #link("https://arxiv.org/abs/2509.25116")[arXiv]]

== Euler blowup and boundaries

Luo--Hou (2014) numerically studied axisymmetric 3D Euler in a cylinder with no-flow solid wall and axial periodicity. A hybrid sixth-order Galerkin/finite-difference adaptive method saw a $3 times 10^8$ increase in maximum vorticity and predicted $t_s approx 0.0035056$, checked against BKM, Constantin--Fefferman, and Deng--Hou--Yu criteria.#footnote[G. Luo and T. Y. Hou, "Potentially singular solutions of the 3D axisymmetric Euler equations," *PNAS* 111, 12968--12973 (2014). #link("https://doi.org/10.1073/pnas.1405238111")[DOI] #link("https://arxiv.org/abs/1310.0497")[arXiv] #link("https://zbmath.org/1431.35115")[Zbl]] The boundary creates a shear layer driving amplification.

Chen--Hou proved finite-time blowup for 3D incompressible Euler in a cylindrical domain with no-penetration boundary: smooth finite-energy initial data develop a singularity while the velocity remains $C^(1, alpha)$ and finite-energy up to blowup.#footnote[J. Chen and T. Y. Hou, "Finite time blowup of 2D Boussinesq and 3D Euler equations with $C^(1,alpha)$ velocity and boundary," *Ann. PDE* 9, 14 (2023). #link("https://arxiv.org/abs/1910.00173")[arXiv] #link("https://zbmath.org/1485.35071")[Zbl]; see also J. Chen and T. Y. Hou, *PNAS* 122, e2500940122 (2025). #link("https://doi.org/10.1073/pnas.2500940122")[DOI]] The proof is computer-assisted: approximate self-similar profile; spectral stability of the rescaled linearized equation; nonlinear stability via fixed point; interval arithmetic. This does not solve Clay: it is Euler, bounded-domain, and boundary-driven.

Elgindi (2021) proved finite-time blowup for 3D Euler in $RR^3$ from rough data: axisymmetric no-swirl $u_0 in C^(1,alpha)$ produces blowup with $omega(t) approx (T-t)^(-1)$ and $nabla u(t) approx (T-t)^(-1)$.#footnote[T. M. Elgindi, "Finite-time singularity formation for $C^(1,alpha)$ solutions to the incompressible Euler equations on $RR^3$," *Ann. of Math.* 194, 647--727 (2021). #link("https://doi.org/10.4007/annals.2021.194.3.2")[DOI] #link("https://arxiv.org/abs/1904.04795")[arXiv] #link("https://zbmath.org/07441733")[Zbl]] The proof uses dynamic rescaling and convergence to a stable nontrivial stationary profile. Elgindi--Ghoul--Masmoudi proved stability under small $C^(1,alpha)$ perturbations within axisymmetric no-swirl data, using spectral analysis in similarity variables and weighted nonlinear estimates.#footnote[T. M. Elgindi, T.-E. Ghoul, and N. Masmoudi, "On the stability of self-similar blow-up for $C^(1,alpha)$ solutions to the incompressible Euler equations on $RR^3$," *Camb. J. Math.* 9, 1035--1075 (2021). #link("https://doi.org/10.4310/CJM.2021.v9.n4.a4")[DOI] #link("https://arxiv.org/abs/1910.14071")[arXiv]] Huang, Chen, Hou, and collaborators proved related blowup results for models including 2D #link("https://en.wikipedia.org/wiki/Boussinesq_approximation")[Boussinesq] and axisymmetric Euler with boundary. The open upgrade is smooth-data $C^oo$ Euler blowup in the whole space.

== Dimension, neural search, self-similarity

Hou's generalized axisymmetric Navier--Stokes numerics analytically continue dimension $d$ by replacing the Biot--Savart kernel $abs(x-y)^(-(d-1))$ with a $d$-dependent kernel. Self-similar singularities appear numerically above $d_c approx 3.188$, while $d < d_c$ appears regular; 3D may lie just below a critical dimension, with nonlinear depletion/cancellation separating regularity from blowup.#footnote[T. Y. Hou, "Nearly self-similar blowup of generalized axisymmetric Navier-Stokes equations," arXiv:2405.10916 (2024). #link("https://arxiv.org/abs/2405.10916")[arXiv]]

Neural networks and PINNs use nonlinear parametrizations and PDE-residual losses to discover candidate self-similar profiles. Applications mentioned include axisymmetric 3D Euler models such as De Gregorio-type 1D models, the Constantin--Cordoba--Fontelos equation, incompressible porous media (IPM), and analogues related to SQG. These methods find profiles; proof still requires Newton--Kantorovich/interval-arithmetic verification or other rigorous analysis.

For a putative singularity at $T$, a general ansatz is

$ u(x,t) = frac(1, (T - t)^beta) U ( frac(x - x_0, (T - t)^gamma) ). $

Balancing $partial_t u$ with $nu Delta u$ gives $2 beta + 1 = gamma$. With

$ xi = frac(x - x_0, (T - t)^gamma), quad tau = - log(T - t), $

the rescaled Navier--Stokes equation is

$
  partial_tau U - gamma xi dot nabla_xi U + beta U + (U dot nabla_xi) U = - nabla_xi P + nu e^(-(2 beta + 1 - gamma) tau) Delta_xi U .
$

At critical scaling this becomes autonomous:

$ partial_tau U - gamma xi dot nabla_xi U + beta U + (U dot nabla_xi) U = - nabla_xi P + nu Delta_xi U . $

Self-similar blowup becomes convergence to a steady profile in similarity variables. A proof program: find approximate $U_("app")$; linearize $partial_tau V = L V + N(V)$; prove one unstable eigenvalue and stable complement; close nonlinear estimates in weighted spaces; verify constants by interval arithmetic; return to physical variables.

Restrictions are severe. Nečas--Růžička--Šverák (1996) ruled out nontrivial Leray self-similar Navier--Stokes blowup

$ u(x, t) = frac(1, (T - t)^(1 / 2)) U ( frac(x, (T - t)^(1 / 2)) ) $

with divergence-free $U in L^3(RR^3)$; then $U equiv 0$.#footnote[J. Nečas, M. Růžička, and V. Šverák, "On Leray's self-similar solutions of the Navier-Stokes equations," *Acta Math.* 176, 283--294 (1996). #link("https://doi.org/10.1007/BF02551584")[DOI] #link("https://zbmath.org/0884.35115")[Zbl]] Thus the naive finite-energy self-similar scenario is excluded. Constantin--Ignatova--Vicol proved restrictions on Euler self-similar exponents: finite-energy data require $gamma >= 2/5$ generally and $gamma >= 1/2$ in axisymmetry.#footnote[P. Constantin, M. Ignatova, and V. Vicol, "On putative self-similarity for incompressible 3D Euler," arXiv:2602.17570 (2026). #link("https://arxiv.org/abs/2602.17570")[arXiv]]

== Status

Known:

- global Leray--Hopf weak solutions in 3D;
- complete global well-posedness in 2D;
- partial regularity of suitable weak solutions;
- conditional regularity criteria: Prodi--Serrin, endpoint $L_t^oo L_x^3$, BKM, Constantin--Fefferman;
- small-data critical well-posedness in $"BMO"^(-1)$ and ill-posedness beyond it;
- nonuniqueness for very rough Navier--Stokes weak solutions;
- nonuniqueness for forced Leray--Hopf solutions;
- announced unforced Leray--Hopf nonuniqueness;
- finite-time Euler blowup in a cylinder;
- finite-time Euler blowup in $RR^3$ from $C^(1,alpha)$ data;
- numerical, computer-assisted, and AI-assisted tools for candidate discovery.

Unknown:

- smooth 3D Navier--Stokes global regularity versus finite-time blowup;
- smooth-data 3D Euler blowup in the whole space;
- classical unforced Leray--Hopf uniqueness, pending confirmation of announced results;
- the exact cancellation/depletion mechanism, if any, separating 3D from nearby blowup models.

== Formula sheet

Navier--Stokes on $RR^3$ or $TT^3$:

$ partial_t u + (u dot nabla) u + nabla p = nu Delta u + f, quad nabla dot u = 0, quad u(dot,0) = u_0 . $

Euler:

$ partial_t u + (u dot nabla) u + nabla p = f, quad nabla dot u = 0 . $

Vorticity:

$ omega = nabla times u . $

3D Navier--Stokes vorticity:

$ partial_t omega + u dot nabla omega = omega dot nabla u + nu Delta omega . $

2D Navier--Stokes vorticity:

$ partial_t omega + u dot nabla omega = nu Delta omega . $

Leray--Hopf energy inequality:

$ 1 / 2 norm(u(t))_(L^2)^2 + nu integral_0^t norm(nabla u(s))_(L^2)^2 d s <= 1 / 2 norm(u_0)_(L^2)^2 . $

Prodi--Serrin:

$ u in L_t^p L_x^q, quad 2 / p + 3 / q <= 1, quad q > 3. $

BKM:

$ integral_0^T norm(omega(dot, t))_(L^oo) d t = oo $

is necessary for blowup at $T$.
