// date: 2026-06-02
// tags: maths, fluid-dynamics, notes, transcription, ai-assisted


#set document(title: "Navier--Stokes Existence or Breakdown")
#title()
<navierstokes-existence-or-breakdown>
== Notes from a lecture by Javier Gómez-Serrano
<notes-from-a-lecture-by-javier-gómez-serrano>
(These notes started as an AI-cleaned transcript of the talk.)


== 1. Introduction
<introduction>
This lecture concerns the Navier--Stokes existence or breakdown problem,
one of the seven Millennium Prize Problems posed by the Clay Mathematics
Institute around the year 2000.

The problem asks, roughly:

given smooth initial data for the 3D incompressible Navier--Stokes
  equations,
  - do smooth solutions exist for all time?
  - or can singularities form in finite time?

The talk emphasizes that, although the Clay problem remains open, the
field has seen substantial activity and major conceptual progress in
recent years.


== 2. Historical background
<historical-background>
=== 2.1. Leonardo da Vinci and early observations
<leonardo-da-vinci-and-early-observations>
Leonardo da Vinci studied fluid motion and apparently coined the term
#emph[turbulence] (Italian: #emph[turbolenza]). His observations already
captured a multiscale picture of fluid flow: large eddies feeding into
smaller ones.

He wrote:

#quote(block: true)[
Observe the motion of the surface of the water, which resembles that of
hair. The water has eddying motions, one part of which is due to the
principal current and the other to the random and reverse motion.
]

So, already around 1500, there was a qualitative awareness of the
cascade-like structure of fluid motion.

=== 2.2. Bernoulli, d'Alembert, Euler, Prandtl
<bernoulli-dalembert-euler-prandtl>
A few milestones:

- #strong[Bernoulli] (Daniel Bernoulli, 1700--1782) related higher fluid velocity to lower pressure,
  leading to explanations such as lift on airplane wings. He published *Hydrodynamica* in 1738.
- #strong[d'Alembert] (Jean le Rond d'Alembert, 1717--1783) considered drag and argued that an inviscid fluid
  should produce zero drag, in contradiction with physical observations (1752).
  This is the famous #emph[d'Alembert paradox].
- #strong[Euler] (Leonhard Euler, 1707--1783) wrote the incompressible Euler equations (~1757), describing
  ideal fluids without viscosity.
- #strong[Prandtl] (Ludwig Prandtl, 1875--1953) explained the paradox through #emph[boundary layer
  theory] (1904): even very small viscosity can produce substantial drag near
  boundaries.

Thus the mathematical theory of fluid mechanics emerged from a
combination of physical observation and formal modeling.



== 3. The Euler and Navier--Stokes equations
<the-euler-and-navierstokes-equations>
Let $u = u(x,t)$ denote the velocity field, $p = p(x,t)$ the pressure,
$rho$ the density, $nu$ the viscosity, and $f = f(x,t)$ an external force.

The incompressible fluid equations are

$ partial_t u + (u dot nabla) u = - nabla p + nu Delta u + f $

together with the incompressibility condition

$ nabla dot u = 0 . $

- If $nu = 0$, one obtains the incompressible Euler equations.
- If $nu > 0$, one obtains the incompressible Navier--Stokes
  equations.

These equations express Newton's law $F = m a$ for a fluid parcel.

=== 3.1. The equations

The incompressible Navier--Stokes equations above combine the local acceleration $partial_t u$,
the nonlinear advection $(u dot nabla) u$, the pressure gradient $nabla p$, and the viscous
diffusion $nu Delta u$. Together they govern the evolution of a fluid velocity field.

=== 3.2. The nonlinear term
<the-nonlinear-term>
The main mathematical difficulty comes from the nonlinear advection term

$ (u dot nabla) u . $

This term means that the velocity field affects its own evolution. The
equation is therefore nonlinear, and this raises the possibility of
dramatic phenomena such as growth of gradients or formation of
singularities.

=== 3.3. Incompressibility
<incompressibility>
The condition

$ nabla dot u = 0 $

means the fluid is incompressible: parcels preserve volume. This
prevents simple compression-type blowup mechanisms that might occur in
compressible flow.



== 4. The Clay Millennium problem
<the-clay-millennium-problem>
The 3D incompressible Navier--Stokes problem, in one standard
formulation, is:

Given smooth divergence-free initial data $u_0$ on either $RR^3$ or the
torus $TT^3$, consider the evolution

$ partial_t u + (u dot nabla) u = - nabla p + nu Delta u quad nabla dot u = 0 quad u(dot,0) = u_0 . $

The question is whether one of the following holds:

+ #strong[Global regularity:] for every smooth initial datum, there
  exists a smooth solution for all time.
+ #strong[Finite-time breakdown:] there exists smooth initial datum for
  which a singularity forms in finite time.

A singularity means that some norm of the solution, typically involving
$u$ or its derivatives, becomes unbounded in finite time.



== 5. Three broad scenarios
<three-broad-scenarios>
The speaker described three conceptual possibilities:

+ #strong[Global smoothness and uniqueness] \ Smooth solutions remain
  smooth for all time.

+ #strong[Singularity formation, but uniqueness persists] \
  Singularities may form, yet the evolution remains uniquely determined
  in an appropriate sense.

+ #strong[Singularity formation and nonuniqueness] \ Singularities
  occur, and beyond them there may be multiple solutions.

The Clay problem is usually presented as distinguishing scenario 1 from
scenarios 2 or 3 combined.

A different emphasis, associated with Ladyzhenskaya, is to distinguish
uniqueness from nonuniqueness.



== 6. Weak solutions
<weak-solutions>
To discuss global existence, one introduces weaker notions of solution.

=== 6.1. Definition of weak solution
<definition-of-weak-solution>
A #strong[weak solution] is a function $u$ that satisfies the
Navier--Stokes equations only after testing against smooth
divergence-free test functions.

For simplicity, consider the unforced equation on $RR^3$ or $TT^3$:

$ partial_t u + (u dot nabla) u + nabla p = nu Delta u quad nabla dot u = 0 . $

Then $u$ is a weak solution if for every smooth compactly supported
divergence-free test field $phi$,

$ integral_0^oo integral ( u dot partial_t phi + (u ⊗ u) : nabla phi + nu nabla u : nabla phi ) d x d t + integral u_0(x) dot phi(x, 0) d x = 0 . $

This is obtained by multiplying the PDE by $phi$ and integrating by parts.

A strong solution is always a weak solution, but the converse need not
hold.

=== 6.2. Leray--Hopf weak solutions
<lerayhopf-weak-solutions>
A #strong[Leray--Hopf weak solution] is a weak solution that also
satisfies the energy inequality

$ 1 / 2 norm(u(t))_(L^2)^2 + nu integral_0^t norm(nabla u(s))_(L^2)^2 d s <= 1 / 2 norm(u_0)_(L^2)^2 $

for all $t$.

This means the kinetic energy is nonincreasing, except for dissipation
through viscosity.

=== 6.3. Leray--Hopf theorem
<lerayhopf-theorem>
Leray (1934) proved the foundational existence result for 3D
incompressible Navier--Stokes: for any divergence-free initial data
$u_0 in L^2(RR^3)$, there exists at least one global weak solution

$ u in L_t^oo L_x^2 & L_t^2 dot(H)_x^1 $

satisfying the energy inequality for all $t$. Moreover, the solution is
smooth except possibly on a small exceptional set; in particular, the
set of singular times has zero $1/2$-dimensional Hausdorff
measure.#footnote[J. Leray, "Sur le mouvement d'un liquide visqueux emplissant l'espace," *Acta Math.* 63, 193--248 (1934). #link("https://doi.org/10.1007/BF02547354")[DOI] #link("https://zbmath.org/60.0726.05")[Zbl]] Hopf (1951) later extended this to bounded
domains with no-slip boundary conditions.#footnote[E. Hopf, "Über die Anfangswertaufgabe für die hydrodynamischen Grundgleichungen," *Math. Nachr.* 4, 213--231 (1951). #link("https://doi.org/10.1002/mana.3210040121")[DOI] #link("https://zbmath.org/0042.10604")[Zbl]]

Thus:

- global weak solutions exist for any $L^2$ initial data;
- but it is unknown whether they remain smooth or unique in full
  generality.

If one could prove that every Leray--Hopf weak solution is actually
smooth, the Clay problem would be solved in the positive direction.



== 7. The two-dimensional case
<the-two-dimensional-case>
In two spatial dimensions, the situation is much better.

=== 7.1. Ladyzhenskaya's theorem
<ladyzhenskayas-theorem>
Ladyzhenskaya (1958, 1969) proved global well-posedness for 2D
incompressible Navier--Stokes: for any divergence-free $u_0 in L^2(RR^2)$,
there exists a unique global solution

$ u in C([0,oo); L^2) & L_("loc")^2((0,oo); H^1) $

that is smooth for all $t > 0$ and depends continuously on the initial
data.#footnote[O. A. Ladyzhenskaya, "Solution 'in the large' of the nonstationary boundary value problem for the Navier-Stokes system in two space variables," *Comm. Pure Appl. Math.* 12, 427--433 (1959). #link("https://doi.org/10.1002/cpa.3160120303")[DOI] #link("https://zbmath.org/0103.19502")[Zbl]; also *The Mathematical Theory of Viscous Incompressible Flow*, 2nd ed., Gordon & Breach (1969).]

The key point is that certain inequalities, now often called
Ladyzhenskaya inequalities, provide a stronger control in two dimensions
than in three. In 2D, the inequality

$ norm(u)_(L^4) <= C norm(u)_(L^2)^(1 / 2) norm(nabla u)_(L^2)^(1 / 2) $

holds, which together with the energy inequality gives enough control
to close the estimates. In 3D, the analogous inequality

$ norm(u)_(L^4) <= C norm(u)_(L^2)^(1 / 4) norm(nabla u)_(L^2)^(3 / 4) $

has a higher exponent on the $nabla u$ term, and the same strategy
breaks down.

So:

- in 2D Navier--Stokes, the global regularity theory is complete;
- in 3D, it remains open.



== 8. Partial regularity
<partial-regularity>
Even if singularities exist, can we say how large the singular set is?

=== 8.1. Suitable weak solutions
<suitable-weak-solutions>
A #strong[suitable weak solution] is a weak solution that additionally
satisfies the #strong[local energy inequality]

$ partial_t ( frac(|u|^2, 2) ) + div( ( frac(|u|^2, 2) + p ) u ) - nu Delta ( frac(|u|^2, 2) ) + nu |nabla u|^2 <= 0 $

in the sense of distributions. This local form of energy dissipation is
a stronger condition than the global energy inequality and is essential
for partial regularity arguments.

=== 8.2. Scheffer
<scheffer>
Scheffer (1977) proved that the singular set of a suitable weak solution
has parabolic Hausdorff dimension at most $5/3$ (later improved to at
most $2$).#footnote[V. Scheffer, "Hausdorff measure and the Navier-Stokes equations," *Comm. Math. Phys.* 55, 97--112 (1977). #link("https://doi.org/10.1007/BF01626512")[DOI] #link("https://zbmath.org/0357.35071")[Zbl]]

=== 8.3. Caffarelli--Kohn--Nirenberg
<caffarellikohnnirenberg>
Caffarelli, Kohn, and Nirenberg (1982) improved this dramatically: the
one-dimensional parabolic Hausdorff measure of the singular set is
zero.#footnote[L. Caffarelli, R. Kohn, and L. Nirenberg, "Partial regularity of suitable weak solutions of the Navier-Stokes equations," *Comm. Pure Appl. Math.* 35, 771--831 (1982). #link("https://doi.org/10.1002/cpa.3160350604")[DOI] #link("https://zbmath.org/0509.35067")[Zbl]]

Concretely, this implies that the singular set $S$ satisfies
$P^1(S) = 0$, meaning its one-dimensional parabolic Hausdorff measure
vanishes. In particular, $S$ cannot contain any curve of positive length
in spacetime, so possible singularities are extremely sparse.

This partial regularity result historically supported optimism for
global regularity: if singularities exist, they must be highly
constrained.



== 9. Vorticity formulation
<vorticity-formulation>
A central derived quantity is the #strong[vorticity]

$ omega = nabla times u . $

- In 2D, $omega$ is effectively a scalar.
- In 3D, $omega$ is a vector field.

Writing the equations in terms of vorticity removes the pressure from
the formulation.

=== 9.1. The 2D vorticity equation
<the-2d-vorticity-equation>
In 2D Navier--Stokes,

$ partial_t omega + u dot nabla omega = nu Delta omega . $

Thus vorticity is simply transported and diffused.

This is a major reason why 2D is tractable.

=== 9.2. The 3D vorticity equation
<the-3d-vorticity-equation>
In 3D Navier--Stokes,

$ partial_t omega + u dot nabla omega = omega dot nabla u + nu Delta omega . $

The extra term

$ omega dot nabla u $

is the #strong[vortex stretching term]. This term can amplify vorticity
and is one of the main mechanisms suspected in any possible singularity
formation.

So:

- in 2D, vorticity is transported;
- in 3D, vorticity can stretch and grow.



== 10. Why energy estimates are not enough
<why-energy-estimates-are-not-enough>
The kinetic energy is the most basic conserved or dissipated quantity.
But for 3D Navier--Stokes, energy is #strong[supercritical] with respect
to the natural scaling of the equations.

That means energy estimates alone do not control the norms relevant to
singularity formation.

Hence any proof of global regularity must use something beyond soft
energy arguments. One needs a deeper structural understanding of the
nonlinearity.

This is reinforced by model equations and modified systems that preserve
many of the same soft features, yet can exhibit blowup.



== 11. What was known classically
<what-was-known-classically>
Before modern developments, one broadly knew:

- Leray--Hopf weak solutions exist globally.
- Smooth solutions exist locally in time.
- If singularities occur, they are very sparse in spacetime.
- 2D Navier--Stokes is globally well-posed.
- 3D global smoothness remained open.

The prevailing community intuition for a long time leaned toward global
regularity, though without proof.



== 12. Regularity criteria
<regularity-criteria>
A common strategy is: if one cannot prove global regularity directly,
perhaps one can identify conditions under which a weak solution must be
smooth.

=== 12.1. Prodi--Serrin--Ladyzhenskaya criteria
<prodiserrinladyzhenskaya-criteria>
If a Leray--Hopf weak solution lies in a mixed space

$ u in L_t^p L_x^q $

with

$ 2 / p + 3 / q <= 1 quad q > 3 $

then the solution is smooth.

The endpoint case (q=3) was much harder and was handled later.

=== 12.2. Escauriaza--Seregin--Šverák
<escauriazasereginšverák>
Escauriaza, Seregin, and Šverák (2003) proved the endpoint $q = 3$
case: if

$ u in L_t^oo L_x^3 $

then the solution is smooth.#footnote[L. Escauriaza, G. Seregin, and V. Šverák, "$L_(3,∞)$-solutions of Navier-Stokes equations and backward uniqueness," *Russ. Math. Surveys* 58, 211--250 (2003). #link("https://doi.org/10.1070/RM2003v58n02ABEH000609")[DOI] #link("https://zbmath.org/1064.35134")[Zbl]] The proof uses a backward uniqueness
argument for the vorticity equation: assuming blowup, one shows that
the vorticity must vanish identically, leading to a contradiction.

These regularity criteria are useful because they imply that any blowup
must violate them in a specific quantitative way.

=== 12.3. Beale--Kato--Majda criterion
<bealekatomajda-criterion>
For Euler, and in related forms for Navier--Stokes, a basic blowup
criterion says that if a smooth solution blows up at time $T$, then

$ integral_0^T norm(omega(dot,t))_(L^oo) d t = oo . $#footnote[J. T. Beale, T. Kato, and A. Majda, "Remarks on the breakdown of smooth solutions for the 3-D Euler equations," *Comm. Math. Phys.* 94, 61--66 (1984). #link("https://doi.org/10.1007/BF01212349")[DOI] #link("https://zbmath.org/0573.76029")[Zbl]]

So finite-time blowup requires vorticity to become sufficiently large.

=== 12.4. Constantin--Fefferman criterion
<constantinfefferman-criterion>
Constantin and Fefferman (1993) refined this by showing that not only
magnitude but also the geometry of vorticity matters.#footnote[P. Constantin and C. Fefferman, "Direction of vorticity and the problem of global regularity for the Navier-Stokes equations," *Indiana Univ. Math. J.* 42, 775--789 (1993). #link("https://doi.org/10.1512/iumj.1993.42.42034")[DOI] #link("https://zbmath.org/0837.35113")[Zbl]] Define the
vorticity direction $xi = omega / |omega|$ wherever $omega != 0$. If

$ integral_0^T norm(nabla xi (dot, t))_(L^oo)^2 d t < oo $

then the solution remains smooth up to time $T$. In other words, a
singularity can form only if the direction field of the vorticity
develops sufficiently rapid spatial oscillations. This geometric
condition complements the BKM magnitude criterion and suggests that
blowup, if it occurs, must be highly structured.



== 13. Sharp well-posedness spaces
<sharp-well-posedness-spaces>
Researchers then sought the largest function spaces in which one can
still prove well-posedness.

=== 13.1. Koch--Tataru
<kochtataru>
Koch and Tataru (2001) proved global well-posedness for small initial
data in the critical space $"BMO"^(-1)$: there exists $epsilon > 0$ such
that for any divergence-free $u_0$ with $norm(u_0)_("BMO"^(-1)) < epsilon$,
there exists a unique global solution

$ u in L_t^oo "BMO"^(-1) & L_t^2 C^(0, 1 / 2) $

that is smooth for $t > 0$.#footnote[H. Koch and D. Tataru, "Well-posedness for the Navier-Stokes equations," *Adv. Math.* 157, 22--35 (2001). #link("https://doi.org/10.1006/aima.2000.1937")[DOI] #link("https://zbmath.org/0972.35084")[Zbl]]

This space is essentially optimal: it is invariant under the natural
scaling of the equations.

=== 13.2. Bourgain--Pavlović
<bourgainpavlović>
Bourgain and Pavlović (2008) showed that the border
case $dot(B)_oo^(-1, oo)$ (a slightly larger space than $"BMO"^(-1)$) is
ill-posed: there exist smooth initial data that are arbitrarily small in
$dot(B)_oo^(-1, oo)$ but produce solutions arbitrarily large in the same
norm after arbitrarily short time---a phenomenon known as
#strong[norm inflation].#footnote[J. Bourgain and N. Pavlović, "Ill-posedness of the Navier-Stokes equations in a critical space in 3D," *J. Funct. Anal.* 255, 2233--2247 (2008). #link("https://doi.org/10.1016/j.jfa.2008.07.008")[DOI] #link("https://arxiv.org/abs/0807.0882")[arXiv] #link("https://zbmath.org/1161.35037")[Zbl]]

Thus $"BMO"^(-1)$ is very close to the threshold for a good theory.

=== 13.3. Germain--Pavlović--Staffilani
<germainpavlovićstaffilani>
Germain, Pavlović, and Staffilani (2007) showed that the Koch--Tataru
solution enjoys higher regularity: it is real analytic in space for
every $t > 0$, with uniform decay estimates

$ norm(partial^alpha u(dot, t))_(L^oo) <= C_alpha t^(-(|alpha| + 1) / 2) $

for any multi-index $alpha$.#footnote[P. Germain, N. Pavlović, and G. Staffilani, "Regularity of solutions to the Navier-Stokes equations evolving from small data in $"BMO"^(-1)$," *Int. Math. Res. Not.* 2007, rnm087 (2007). #link("https://doi.org/10.1093/imrn/rnm087")[DOI] #link("https://arxiv.org/abs/math/0609781")[arXiv] #link("https://zbmath.org/1148.35063")[Zbl]]

This implies, in particular, that solutions starting from small
$"BMO"^(-1)$ data become classical instantaneously.

So the picture is:

- at or below the critical threshold, one has good control;
- above it, the global theory becomes much more delicate.



== 14. Numerical blowup searches
<numerical-blowup-searches>
Given the difficulty of the theoretical problem, it is natural to search
numerically for singularity candidates.

=== 14.1. Kerr's anti-parallel vortex tubes
<kerrs-anti-parallel-vortex-tubes>
In 1993, Kerr numerically studied anti-parallel vortex tubes and found
evidence suggestive of finite-time blowup.

Later, Hou and Li revisited the same scenario with much higher
resolution and found no blowup: the apparent singular behavior was a
numerical artifact of insufficient resolution.

This illustrates a central challenge:

- quantities may grow rapidly and seem to diverge;
- but at later times they may deplete instead.

=== 14.2. Other candidate scenarios
<other-candidate-scenarios>
More complicated constructions, such as folded sheets and multiscale
structures, have also been proposed as possible blowup mechanisms. But
the equations repeatedly resist definitive numerical confirmation.

=== 14.3. Core numerical difficulties
<core-numerical-difficulties>
Numerically detecting blowup is intrinsically hard because:

+ if a true singularity is approached, resolution requirements become
  extreme;
+ truncation and discretization errors can dominate;
+ artificial numerical viscosity may suppress the effect one is trying
  to detect;
+ numerical evidence alone cannot establish a theorem.



== 15. Computer-assisted proofs
<computer-assisted-proofs>
A more rigorous numerical paradigm is the #strong[computer-assisted
proof].

=== 15.1. General strategy
<general-strategy>
The idea is:

+ Compute a highly accurate approximate solution.
+ Show, by a fixed-point or perturbative argument, that a true solution
  exists near it.
+ Track all constants and errors rigorously using interval arithmetic.

Thus one upgrades a numerical candidate into a theorem.

=== 15.2. Interval arithmetic
<interval-arithmetic>
Instead of floating-point numbers, one propagates intervals guaranteed
to contain the true values. This provides rigorous error bounds.

This methodology has become increasingly effective in PDE over the last
decade, thanks to advances in software, hardware, and analysis.



== 16. Tao's perspective on the difficulty
<taos-perspective-on-the-difficulty>
Terence Tao emphasized that any proof of global regularity must go
beyond standard energy methods.

=== 16.1. Logarithmically supercritical models
<logarithmically-supercritical-models>
Tao considered modified Navier--Stokes equations where the Laplacian
$nu Delta$ is replaced by a dissipation operator $D$ that is slightly
stronger than $nu Delta$. Specifically, he proved global regularity for
dissipation of the form $|nabla|^(15/8)$ (which is more regularizing
than $Delta$), and even for $|nabla|^(5/4 + epsilon)$ with a suitable
logarithmic correction. The key threshold is that if the dissipation
scales like $|nabla|^(s)$ with $s > 1$ (this is the
#strong[hyperdissipative] regime), the problem becomes subcritical and
global regularity can be proved for sufficiently large $s$.

This shows that just a bit more damping changes the problem
dramatically.

=== 16.2. Averaged Navier--Stokes and blowup models
<averaged-navierstokes-and-blowup-models>
Tao also constructed modified or averaged Navier--Stokes-type systems
that preserve many soft features of the original equations---energy
identity, Sobolev estimates, symmetries---yet admit finite-time blowup.
In these models, the nonlinear term $(u dot nabla) u$ is replaced by an
averaged or truncated version that retains the same energy estimates and
scaling properties but removes certain cancellations present in the
genuine nonlinearity. The blowup is constructed via a self-similar
ansatz combined with an Ornstein--Uhlenbeck-type stochastic
construction.

Conclusion: soft properties alone cannot distinguish global regularity
from blowup. One must use the precise structure of the genuine
Navier--Stokes nonlinearity.



== 17. Onsager's conjecture and convex integration
<onsagers-conjecture-and-convex-integration>
The talk then turned to a different but related line of development:
very rough solutions to Euler and Navier--Stokes.

=== 17.1. Onsager's conjecture
<onsagers-conjecture>
For weak solutions of 3D Euler with Hölder continuity $C^alpha$ (or,
more generally, Besov regularity $B_(3, oo)^alpha$):

- if $alpha > 1/3$, energy is conserved;
- if $alpha < 1/3$, anomalous dissipation may occur,
  i.e., the time derivative $d / d t integral (1/2) |u|^2 d x$ may be nonzero.

The conservation part was proved by Constantin, E, and Titi: if
$u in L^3((0,T); B_(3, oo)^alpha)$ with $alpha > 1/3$, then the kinetic
energy $frac(1,2) norm(u(t))_(L^2)^2$ is constant in time.#footnote[P.
Constantin, W. E, and E. S. Titi, "Onsager's conjecture on the energy
conservation for solutions of Euler's equation," *Comm. Math. Phys.* 165,
207--209 (1994). #link("https://doi.org/10.1007/BF02099744")[DOI]]

=== 17.2. Convex integration
<convex-integration>
The flexibility part was developed through the method of #strong[convex
integration], introduced into fluid dynamics by De Lellis and
Székelyhidi, drawing on ideas of Nash and Gromov.

A sequence of works improved the regularity threshold, culminating in
Isett's (2018) proof of Onsager's conjecture: for every $alpha < 1/3$,
there exists a nonzero weak solution $u in C_t C_x^alpha$ of the 3D
Euler equations that has compact support in time and therefore fails to
conserve energy.#footnote[P. Isett, "A proof of Onsager's conjecture," *Ann. of Math.* 188, 871--963 (2018). #link("https://doi.org/10.4007/annals.2018.188.3.4")[DOI] #link("https://arxiv.org/abs/1608.08301")[arXiv] #link("https://zbmath.org/06976275")[Zbl]]

The proof combines the method of convex integration with a
#strong[gluing approximation] technique using #strong[Mikado flows]
(introduced by Daneri and Székelyhidi). Later, Buckmaster, De Lellis,
Székelyhidi, and Vicol strengthened this: for any prescribed nonnegative
energy profile $e(t)$, there exists a weak solution of the 3D Euler
equations whose kinetic energy equals $e(t)$ for almost every $t$.

Thus very rough Euler solutions can behave wildly.



== 18. Nonuniqueness for Navier--Stokes
<nonuniqueness-for-navierstokes>
A striking modern development is that rough weak solutions to 3D
Navier--Stokes can be nonunique.

=== 18.1. Buckmaster--Vicol
<buckmastervicol>
Buckmaster and Vicol (2019) proved nonuniqueness for weak solutions of
3D Navier--Stokes: there exist at least two distinct global weak
solutions $u, v in L_t^oo L_x^2 & L_t^2 dot(H)^1$ with the same
finite-energy initial data $u_0 in L^2$. Moreover, these solutions can
be chosen to be Hölder continuous with exponent $alpha < 1/3$ and to
satisfy the energy equality (not just the inequality).#footnote[T.
Buckmaster and V. Vicol, "Nonuniqueness of weak solutions to the
Navier-Stokes equation," *Ann. of Math.* 189, 101--144 (2019).
#link("https://doi.org/10.4007/annals.2019.189.1.3")[DOI]
#link("https://arxiv.org/abs/1709.10033")[arXiv]
#link("https://zbmath.org/07003146")[Zbl]]

The construction uses convex integration with #strong[intermittent
Beltrami flows]---a refinement of the Mikado flows used for Euler that
incorporates a third scale parameter to control the nonlinear term at
the level of the Navier--Stokes equations.

However, these solutions are too rough to be Leray--Hopf weak solutions
(they do not satisfy the energy inequality). So this does not directly
settle the classical uniqueness question for Leray--Hopf solutions.

=== 18.2. Jia--Šverák program
<jiašverák-program>
Jia and Šverák (2014, 2015) proposed a program to prove nonuniqueness
for Leray--Hopf solutions. They gave sufficient conditions for
nonuniqueness in terms of the spectral properties of the linearized
operator around a self-similar, scale-invariant solution of the
Navier--Stokes equations. If the linearized operator has an unstable
eigenvalue, one can construct a second solution lying on the unstable
manifold, branching off from the self-similar background solution. The
verification of these spectral conditions is in principle approachable
by numerical simulation, since they involve only smooth
functions.#footnote[H. Jia and V. Šverák, "Are the incompressible 3D
Navier-Stokes equations locally ill-posed in the natural energy space?"
*J. Funct. Anal.* 268, 3730--3766 (2015).
#link("https://doi.org/10.1016/j.jfa.2015.01.008")[DOI]
#link("https://arxiv.org/abs/1306.2136")[arXiv]
#link("https://zbmath.org/1321.81011")[Zbl]]

=== 18.3. Albritton--Brue--Colombo
<albrittonbruecolombo>
Albritton, Brué, and Colombo (2022) realized the Jia--Šverák program
and proved nonuniqueness for forced Leray--Hopf solutions: there exist
two distinct Leray--Hopf weak solutions of 3D Navier--Stokes, both with
zero initial velocity $u_0 = 0$ and driven by the same smooth body
force $f$, that coincide at $t = 0$ but differ at later times. The
construction uses a self-similar, compactly supported vortex ring as the
background solution and demonstrates that it is unstable under the
Navier--Stokes dynamics in similarity variables.#footnote[D. Albritton,
E. Brué, and M. Colombo, "Non-uniqueness of Leray solutions of the
forced Navier-Stokes equations," *Ann. of Math.* 196, 415--455 (2022).
#link("https://doi.org/10.4007/annals.2022.196.1.3")[DOI]
#link("https://arxiv.org/abs/2112.03116")[arXiv]
#link("https://zbmath.org/07583008")[Zbl]]

So with forcing, nonuniqueness at the Leray--Hopf level is known. The
solutions live precisely on the borderline of the known well-posedness
theory.

=== 18.4. Announcement by Hou--Wang--Yang
<announcement-by-houwangyang>
In 2025, Hou, Wang, and Yang announced a computer-assisted proof of
nonuniqueness for unforced Leray--Hopf solutions, building on the
Jia--Šverák program. They construct a self-similar Leray--Hopf solution
and rigorously certify the existence of an unstable eigenpair of the
linearized operator by combining high-precision numerical computation
with a decomposition of the operator into a coercive part plus a compact
perturbation approximated by a finite-rank operator. The result
establishes the existence of a second solution---indeed, infinitely many
distinct Leray--Hopf solutions---for the same smooth, compactly
supported initial data with zero external force.#footnote[T. Hou, Y.
Wang, and C. Yang, "Nonuniqueness of Leray-Hopf solutions to the
unforced incompressible 3D Navier-Stokes equation," arXiv:2509.25116
(2025). #link("https://arxiv.org/abs/2509.25116")[arXiv]]

If fully confirmed, this would represent a major breakthrough:
nonuniqueness at the Leray--Hopf level without external forcing.



== 19. Finite-time blowup for Euler with boundary
<finite-time-blowup-for-euler-with-boundary>
A landmark result concerns 3D incompressible Euler in a cylindrical
domain.

=== 19.1. Luo--Hou numerical scenario
<luohou-numerical-scenario>
In 2014, Luo and Hou numerically studied axisymmetric 3D Euler in a
cylinder and observed strong vorticity growth near the boundary,
suggesting a finite-time singularity.#footnote[G. Luo and T. Y. Hou, "Potentially singular solutions of the 3D axisymmetric Euler equations," *PNAS* 111, 12968--12973 (2014). #link("https://doi.org/10.1073/pnas.1405238111")[DOI] #link("https://arxiv.org/abs/1310.0497")[arXiv] #link("https://zbmath.org/1431.35115")[Zbl]]

The geometry of the boundary appeared to play an essential role.

=== 19.2. Chen--Hou theorem
<chenhou-theorem>
In a series of papers beginning in 2023, Chen and Hou proved finite-time
blowup for the 3D incompressible Euler equations in a cylindrical
domain with no-slip boundary. Specifically, there exists smooth,
finite-energy initial data $(u_0, p_0)$ such that the corresponding
solution of the 3D axisymmetric Euler equations develops a singularity
in finite time. The velocity field remains $C^(1, alpha)$ and has finite
energy up to the singularity time.#footnote[J. Chen and T. Y. Hou,
"Finite time blowup of 2D Boussinesq and 3D Euler equations with
$C^(1,alpha)$ velocity and boundary," *Ann. PDE* 9, 14 (2023).
#link("https://arxiv.org/abs/1910.00173")[arXiv]
#link("https://zbmath.org/1485.35071")[Zbl]; see also J. Chen and T. Y.
Hou, *PNAS* 122, e2500940122 (2025).
#link("https://doi.org/10.1073/pnas.2500940122")[DOI]]

The proof is computer-assisted and follows the dynamic rescaling
framework developed by Elgindi. The key steps are: (1) construct an
approximate self-similar profile numerically; (2) linearize the rescaled
equations around this profile and prove spectral stability; (3) upgrade
to nonlinear stability via a fixed-point argument with rigorous error
bounds using interval arithmetic.

=== 19.3. Why this does not solve the Clay problem
<why-this-does-not-solve-the-clay-problem>
This is a major theorem, but it does not resolve the Clay problem
because:

- it concerns Euler, not Navier--Stokes;
- it takes place in a bounded domain with boundary;
- the boundary is crucial to the blowup mechanism.

So it does not answer the whole-space or periodic 3D Navier--Stokes
regularity question.



== 20. Other blowup scenarios and dimension as a parameter
<other-blowup-scenarios-and-dimension-as-a-parameter>
The lecture also mentioned numerical studies by Hou suggesting possible
blowup scenarios for Navier--Stokes, including tornado-type structures
with large vorticity amplification.

Another interesting idea is to treat the spatial dimension as a
parameter in a generalized model. Numerically, one may find self-similar
singularities in a noninteger dimension, such as (3.188). This suggests
that 3D may lie near a threshold, and that one missing cancellation
might separate regularity from blowup.

This is suggestive, not definitive.



== 21. AI and neural networks in singularity discovery
<ai-and-neural-networks-in-singularity-discovery>
The lecture then discussed neural-network-based discovery methods.

=== 21.1. Neural networks as nonlinear ansätze
<neural-networks-as-nonlinear-ansätze>
A neural network represents a function by composing affine maps with
nonlinear activation functions, for example ReLU. Because this is a highly
nonlinear parametrization, such networks can approximate complicated
structures with relatively few parameters.

=== 21.2. Physics-informed neural networks
<physics-informed-neural-networks>
In a physics-informed neural network (PINN), one minimizes a loss
function based on the PDE residual and possibly its derivatives or
constraints.

Thus the PDE itself guides the search for candidate solutions.

=== 21.3. Applications to singularity discovery
<applications-to-singularity-discovery>
The speaker described joint work using neural-network-based methods to
discover self-similar blowup profiles for equations related to fluid
dynamics, such as:

- axisymmetric 3D Euler models,
- the CCF equation,
- incompressible porous media equations.

These methods are good at discovering candidate singularity profiles,
but they do not by themselves prove anything about Navier--Stokes.



== 22. Self-similar singularities
<self-similar-singularities>
A major conceptual motif is the search for self-similar blowup.

=== 22.1. Self-similar ansatz
<self-similar-ansatz>
Suppose blowup occurs at time $T$. One seeks solutions of the form

$ u(x,t) = frac(1, (T - t)^beta) U ( frac(x - x_0, (T - t)^gamma) ) $

or in a more general time-dependent rescaled form. For the
Navier--Stokes equations, scaling invariance forces the relation

$ 2 beta + 1 = gamma . $

Here:

- $beta$ is the amplitude blowup exponent,
- $gamma$ is the spatial concentration exponent,
- $U$ is the profile. The energy-critical case corresponds to
  $beta = 1/2$, $gamma = 1$ (the Leray self-similar scaling), for
  which $U$ is expected to belong to $L^3$.

Under suitable rescaling variables

$ xi = frac(x - x_0, (T - t)^gamma) quad tau = - log(T - t) $

a self-similar singularity corresponds to convergence to a stationary
profile in $(xi, tau)$-coordinates.

This is attractive because the complicated singular behavior in physical
variables becomes a fixed-point problem in rescaled variables.

=== 22.2. Program for proving blowup
<program-for-proving-blowup>
A possible route to a theorem is:

+ Find an approximate self-similar profile numerically.
+ Linearize around it.
+ Prove good spectral or stability properties.
+ Upgrade this to nonlinear control.
+ Use a computer-assisted argument to make every estimate rigorous.
+ Translate back to physical variables and conclude blowup.

=== 22.3. Restrictions on self-similarity
<restrictions-on-self-similarity>
Not every self-similar ansatz is admissible.

Caffarelli, in earlier lectures on the Millennium problems, emphasized
that one cannot expect the simplest self-similar Navier--Stokes
singularities directly, due to exclusion results such as those of Nečas,
Růžička, and Šverák (1996). They proved that there are no nontrivial
self-similar solutions of the form

$ u(x, t) = frac(1, (T - t)^(1 / 2)) U ( frac(x, (T - t)^(1 / 2)) ) $

with $U in L^3(RR^3)$ (the natural energy space for the profile).
More precisely, if $U$ is divergence-free and $U in L^3(RR^3)$, then the
only solution of this self-similar form is $U equiv 0$.#footnote[J.
Nečas, M. Růžička, and V. Šverák, "On Leray's self-similar solutions of
the Navier-Stokes equations," *Acta Math.* 176, 283--294 (1996).
#link("https://doi.org/10.1007/BF02551584")[DOI]
#link("https://zbmath.org/0884.35115")[Zbl]]

This rules out the most naive self-similar blowup scenario for
Navier--Stokes.

Hence, if one seeks singularity for Navier--Stokes, one may need first
to understand Euler-type singularity formation and then show viscosity
is lower order near the singularity.

Recent work of Constantin, Ignatova, and Vicol also places restrictions
on possible self-similar exponents for Euler. The lecture stated,
roughly, that one must have

$ gamma >= 2 / 5 $

in general, and in the axisymmetric case

$ gamma >= 1 / 2 . $

These constraints matter because they interact with the Navier--Stokes
scaling.



== 23. Blowup from rough data for Euler
<blowup-from-rough-data-for-euler>
Another direction is to lower the regularity of the initial data.

=== 23.1. Elgindi's theorem
<elgindis-theorem>
Elgindi (2021) proved finite-time blowup for 3D Euler in the whole
space $RR^3$ (without boundaries). Starting from initial data
$u_0 in C^(1, alpha)(RR^3)$ (Hölder continuous gradient) that is
axisymmetric and has no swirl, the corresponding solution develops a
singularity at a finite time $T < oo$. The vorticity blows up like
$omega(t) approx (T - t)^(-1)$ as $t -> T^-$, and the velocity
gradient blows up like $nabla u approx (T - t)^(-1)$.#footnote[T. M.
Elgindi, "Finite-time singularity formation for $C^(1,alpha)$ solutions
to the incompressible Euler equations on $RR^3$," *Ann. of Math.* 194,
647--727 (2021). #link("https://doi.org/10.4007/annals.2021.194.3.2")[DOI]
#link("https://arxiv.org/abs/1904.04795")[arXiv]
#link("https://zbmath.org/07441733")[Zbl]]

The proof uses a dynamic rescaling formulation: the solution is written
in self-similar variables, and the problem is reduced to proving
convergence to a stable, nontrivial stationary profile of the rescaled
equations.

This was a major breakthrough: it showed singularity formation in the
whole space without boundaries, though not from smooth data (the
initial velocity is $C^(1, alpha)$ but not $C^2$).

=== 23.2. Stability and related works
<stability-and-related-works>
This was further developed by Elgindi, Ghoul, and Masmoudi, who studied
stability of the profile.

Other related works used multiscale constructions and analogous
mechanisms.

An important open question remains:

Can one upgrade these rough-data blowup constructions to smooth-data
blowup?



== 24. Where we stand
<where-we-stand>
The landscape today is far richer than it was 25 years ago.

We now know:

- global existence of Leray--Hopf weak solutions;
- complete global theory in 2D;
- strong partial regularity theory;
- many conditional regularity criteria;
- nonuniqueness for very rough Navier--Stokes solutions;
- nonuniqueness for forced Leray--Hopf solutions;
- major announcements toward unforced Leray--Hopf nonuniqueness;
- finite-time blowup for 3D Euler in a cylinder;
- finite-time blowup for 3D Euler from rough initial data in the whole
  space;
- new numerical and AI-assisted tools for discovering candidate
  singularities.

But we still do not know:

- whether smooth 3D Navier--Stokes solutions can blow up in finite time;
- whether smooth solutions always exist globally;
- whether Leray--Hopf weak solutions are unique in the classical
  unforced setting.



== 25. Outlook
<outlook>
According to the lecture, several broad future directions appear
plausible:

+ #strong[Global regularity via new structure] \ Any proof must go
  beyond energy methods and exploit deep structure specific to
  Navier--Stokes.

+ #strong[Singularity formation through related models] \ Euler and
  modified equations may reveal the mechanisms needed for
  Navier--Stokes.

+ #strong[Leray--Hopf nonuniqueness and weak solution theory] \ New
  notions of solution, or refined understanding of old ones, may reshape
  the problem.

+ #strong[Computer-assisted proofs] \ These are becoming increasingly
  central.

+ #strong[AI-assisted discovery] \ While still exploratory, such methods
  may help identify candidate structures that can later be proved
  rigorously.

The central question remains:

#quote(block: true)[
Do there exist smooth initial data for 3D incompressible Navier--Stokes
that produce a finite-time singularity, or are smooth solutions always
global?
]

After more than 200 years of study, this remains unknown.



== 26. Clean mathematical summary
<clean-mathematical-summary>
For reference, here is a concise statement of the main mathematical
objects mentioned.

=== 26.1. 3D incompressible Navier--Stokes
<d-incompressible-navierstokes>
On $RR^3$ or $TT^3$,

$ partial_t u + (u dot nabla) u + nabla p = nu Delta u + f $

$ nabla dot u = 0 $

$ u(dot,0) = u_0 . $

=== 26.2. 3D incompressible Euler
<d-incompressible-euler>
Set $nu = 0$:

$ partial_t u + (u dot nabla) u + nabla p = f quad nabla dot u = 0 . $

=== 26.3. Vorticity
<vorticity>
$ omega = nabla times u . $

In 3D Navier--Stokes,

$ partial_t omega + u dot nabla omega = omega dot nabla u + nu Delta omega . $

In 2D Navier--Stokes,

$ partial_t omega + u dot nabla omega = nu Delta omega . $

=== 26.4. Energy inequality for Leray--Hopf solutions
<energy-inequality-for-lerayhopf-solutions>
$ 1 / 2 norm(u(t))_(L^2)^2 + nu integral_0^t norm(nabla u(s))_(L^2)^2 d s <= 1 / 2 norm(u_0)_(L^2)^2 . $

=== 26.5. Prodi--Serrin criterion
<prodiserrin-criterion>
If

$ u in L_t^p L_x^q quad 2 / p + 3 / q <= 1 quad q > 3 $

then $u$ is smooth.

=== 26.6. Beale--Kato--Majda criterion
<bealekatomajda-criterion-1>
If a smooth solution blows up at time $T$, then

$ integral_0^T norm(omega(dot,t))_(L^oo) d t = oo . $
