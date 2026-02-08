// date: 2026-02-08
// tags: maths

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "Translation of Prandtl's original paper on the boundary layer")
#title()



#set page(
  paper: "a4",
  // margin: (top: 22mm, bottom: 22mm, left: 22mm, right: 22mm),
)

#set par(justify: true, linebreaks: "optimized", first-line-indent: 2em)

#set text(
  //   font: "Linux Libertine",
  size: 15pt,
)
#set figure(supplement: "Fig", caption: "")
#set figure.caption(separator: ".")

#set table(stroke: 0pt, inset: 0pt)

#set heading(numbering: "1.")

#set math.equation(numbering: "(1)")
#show math.equation: it => {
  if it.block and not it.has("label") and it.numbering != none [
    #counter(math.equation).update(v => v - 1)
    #math.equation(it.body, block: true, numbering: none)
  ] else {
    it
  }
}

#let bv = $bold(v)$
#let bK = $bold(K)$
#let bw = $bold(w)$


// #align(center)[
= On Fluid Motion with Very Small Friction#footnote[I wrote this as a standard typst document compiling to a PDF and let my blog setup compile it to HTML. See source for details.]#footnote[English translation #link("https://t3.chat/share/gmfd91f6ss")[aided by GPT5.2]. Figures were extracted with AI assisted tool use and manual finetuning. Original paper "Über Flüssigkeitsbewegung bei sehr kleiner Reibung." available at #link("https://www.damtp.cam.ac.uk/user/tong/fluids/prandtl.pdf"). In the course of looking for the missing plate of figures, I found that there is an english translation already, at #link("https://ntrs.nasa.gov/citations/19930090813"). Unfortunately the quality of this scan is not very good so I have not bothered to include the plate.]
#text(size: 10pt)[By L. Prandtl (Hannover)]
#text(size: 10pt)[(With one plate of figures.)]
// ]


In classical hydrodynamics, the motion of a _frictionless_ fluid is treated
predominantly. For a _viscous fluid_ we possess the differential equation of
motion, whose formulation is well confirmed by physical observations. Of
solutions of this differential equation—apart from one-dimensional problems
such as those given, among others, by Lord Rayleigh#footnote[Proceedings Lond. Math. Soc. 11, p. 57 = Papers I, p. 474 ff. ]—one has only those in
which the inertia of the fluid is neglected, or at least plays no role. The
two- and three-dimensional problem that takes account of both friction and
inertia still awaits solution. The reason for this lies, no doubt, in the
unpleasant properties of the differential equation. In Gibbs’s vector
notation it reads#footnote[$a dot b$ scalar product, $a times b$ vector product, $nabla$
  Hamiltonian differential operator]:

$ rho ( (partial bv )/(partial t) + bv dot nabla bv ) + nabla (V + p) = k nabla^2 bv $ <1>

($bv$ velocity, $rho$ density, $V$ force potential, $p$ pressure,
$k$ viscosity constant); in addition comes the continuity equation: for
incompressible fluids, which alone are to be treated here, simply

$ nabla dot bv = 0. $

From the differential equation one can easily see that for sufficiently slow
and also slowly varying motions the factor $rho$ becomes arbitrarily small
compared with the other terms, so that here, with sufficient approximation,
the influence of inertia may be neglected. Conversely, for sufficiently rapid
motion the term quadratic in $bv$, $bv dot nabla bv$ (change
of velocity due to change of position), becomes large/compiler large enough
that the viscous action $k nabla^2 bv$ appears entirely negligible. In
the cases of fluid motion that arise in engineering, the latter is almost
always true. It is therefore natural simply to use the equation for an
inviscid fluid. One knows, however, that the familiar solutions of this
equation usually agree very poorly with experience; I need only recall the
Dirichlet sphere, which according to theory should move without resistance.

I have therefore set myself the task of systematically investigating the laws
of motion of a fluid whose friction is assumed to be very small. The friction
is to be so small that it may be neglected everywhere except where large
differences in velocity occur, or where an accumulating effect of friction
takes place. This plan has proved very fruitful, since on the one hand it
leads to mathematical formulations that make it possible to master the
problems, and on the other hand it promises a very satisfactory agreement
with observation. To mention one point at once: if, for example, in steady
flow around a sphere one passes from the viscous motion to the limit of
vanishing viscosity, one obtains something quite different from the Dirichlet
motion. The Dirichlet motion is only an initial state, which is soon
disturbed by the action of even the smallest viscosity.

I now turn to the individual questions. The force on the unit cube that
arises from viscosity is

$ bK = k nabla^2 bv. $<2>

If one denotes by $bw = 1/2 op("rot")bv$ the vorticity, then by a
well-known vector-analytic transformation, taking into account that
$op("div") bv = 0$, one obtains:
$bK = 2 k op("rot") bw.$
From this it follows immediately that for $bw=0$ also $bK=0$;
that is, even with arbitrarily strong viscosity, an irrotational motion is a
possible motion. If nevertheless in certain cases it does not persist, this is
because vortical fluid from the boundary pushes into the irrotational region.

In any periodic or cyclic motion, over a long duration the effect of
viscosity, even if very small, can accumulate.

One must therefore require for the steady (persistent) state that the work of
$bK$, i.e. the line integral $integral bK dot d bold(s)$ along each
streamline, be equal to zero for a complete cycle in cyclic motions; for
flows periodic in space one has

$ integral^P bK dot d bold(s) = (V_2 + p_2) - (V_1 + p_1). $

For two-dimensional motions, for which a stream function $psi$#footnote[Cf. Encyclopedia of the Mathematical Sciences IV 14, 7.] exists, one
can derive from this, with the aid of Helmholtz’s vortex theorems, a general
statement about the distribution of vorticity. For plane motion one obtains#footnote[After Helmholtz, the vorticity of a fluid element remains proportional to
  its length in the direction of the vorticity axis; therefore in steady plane
  motion $w$ is constant on each streamline $(psi = "const".)$, i.e.
  $w = f(psi)$; with this,

  $ integral bK dot d bold(s)
  = 2k integral op("rot")bw dot d bold(s)
  = 2k f'(psi) integral op("rot")psi dot d bold(s)
  = 2k f'(psi) integral bv dot d bold(s). $]:

$ (d w) / (d t) = ((V_2+p_2)-(V_1+p_1)) / (2 k integral^P bv dot d bold(s)). $

For closed streamlines this becomes zero; hence the simple result follows
that within a region of closed streamlines the vorticity takes on a constant
value.

For axisymmetric motions with flow in meridian planes, for closed streamlines
the vorticity is proportional to the radius: $w = c r$; this yields a force
$bK = 4 k c$ in the direction of the axis.

By far the most important question of the problem is the behavior of the
fluid at the walls of solid bodies. The physical processes in the boundary
layer between fluid and solid body are represented sufficiently well if one
assumes that the fluid adheres to the walls, i.e. that there the velocity is
everywhere zero, or equal to the body velocity. If now the viscosity is very
small and the path of the fluid along the wall is not too long, then already
in the immediate vicinity of the wall the velocity will have its normal
value. In the thin transition layer the abrupt differences in velocity then
give rise, despite the small viscosity constant, to noticeable effects.

This problem is best treated by making systematic neglects in the general
differential equation. If one takes $k$ as small of second order, then the
thickness of the transition layer is small of first order, likewise the normal
component of the velocity. Transverse differences of pressure can be
neglected, as can any curvature of the streamlines. The pressure distribution
is imposed on our transition layer by the outer (free) fluid.

For the plane problem, which alone I have treated so far, one obtains in the
steady state ($X$-direction tangential, $Y$-direction normal, $u$ and $v$ the
corresponding velocity components) the differential equation

$ rho ( u partial_x u + v partial_y u ) + (d p) / (d x) = k partial_y^2 u, $

and in addition

$ partial_x u + partial_y v = 0. $

If, as usual, $(d p) / (d x)$ is completely given, and furthermore the profile
of $u$ is given at the initial cross-section, then every such problem can be
handled numerically: by quadratures one can obtain from each $u$ the
corresponding $partial_x u$; with this one can, with the aid of one of the known
approximation methods#footnote[Cf., e.g., Zeitschr. f. Math. u. Physik, vol. 46, p. 435 (Kutta).], repeatedly advance one step in the X-direction. A
difficulty consists, however, in various singularities that occur at the solid
boundary.

The simplest case of the states of motion treated here is that water flows
along a plane thin plate. Here a reduction of variables is possible; one can
set

$ u = f( y / sqrt(x) ). $

By numerical solution of the resulting differential equation one arrives at a
formula for the drag:

$ R = 1.1 b sqrt(k rho) l u_0^(3/2). $

($b$ width, $l$ length of the plate, $u_0$ speed of the undisturbed water
relative to the plate). The course of $u$ is given in @fig1.
#[
  #set image(width: 90%)
  #table(
    columns: (40%, 60%),
    [#figure(
      image("../img/prandtl-trans/figures/fig1.png"),
    )<fig1>],
    [#figure(
      image("../img/prandtl-trans/figures/fig2.png"),
    )<fig2>],
  )
]
But the result most important for applications of these investigations is that
in certain cases, at a location completely determined by the external
conditions, the fluid stream detaches from the wall (cf. @fig2). Thus a layer
of fluid set into rotation by friction at the wall pushes out into the free
fluid and there, effecting a complete transformation of the motion, plays the
same role as Helmholtz’s separation sheets. When the viscosity constant $k$
is changed, only the thickness of the vortex layer changes (it is proportional
to $sqrt(k/(rho u))$); everything else remains unchanged; one may therefore,
if one wishes, pass to the limit $k = 0$ and still retain the same flow
pattern.





As a closer discussion shows, the necessary condition for the detachment of
the jet is that along the wall, in the direction of the flow, a pressure
increase is present. What magnitude this pressure increase must have in
particular cases can only be learned from the numerical evaluation of the
problem still to be carried out. As a plausible reason for separation one may
state that in the presence of a pressure increase the free fluid converts part
of its kinetic energy into potential energy. The transition layers, however,
have already lost a large part of their kinetic energy; they no longer possess
enough to penetrate into the region of higher pressure, and therefore yield
sideways to it.

According to the foregoing, the treatment of a definite flow phenomenon
breaks into two parts that interact with each other: on the one hand the free
fluid, which can be treated as inviscid according to Helmholtz’s vortex laws;
on the other hand the transition layers at the solid boundaries, whose motion
is regulated by the free fluid but which in turn, by emitting vortex sheets,
give the characteristic stamp to the free motion.

I have attempted in a few cases to follow the process more closely by drawing
the streamlines; however, the results make no claim to quantitative
correctness. Insofar as the motion is irrotational, one makes good use in
drawing of the fact that the streamlines and the lines of constant velocity
potential form an orthogonal (square-meshed) curvilinear net.

#[
  #set image(width: 90%)
  #table(
    columns: (50%, 50%),
    [#figure(
      image("../img/prandtl-trans/figures/fig3.png"),
    )<fig3>],
    [#figure(
      image("../img/prandtl-trans/figures/fig5.png"),
    )<fig5>],

    [#figure(
      image("../img/prandtl-trans/figures/fig4.png"),
    )<fig4>],
    table.cell(align: bottom, [#figure(
      image("../img/prandtl-trans/figures/fig6.png"),
    )<fig6>]),
  )
]
@fig3 and @fig4 show the beginning of the motion around a wall projecting into
the stream in two stages. The irrotational initial motion is rapidly
transformed by a separation sheet (dashed) issuing from the edge of the
obstacle and winding up spirally; the vortex moves farther and farther away
and leaves behind, at the finally stationary separation sheet, water at rest.





How the analogous process takes place for a circular cylinder can be seen
from @fig5 and @fig6; the layers of fluid set into rotation by friction are again
indicated by dashes. The separation surfaces extend here too, in the steady
state, to infinity.

All these separation surfaces are known to be unstable; if a small sinusoidal
disturbance is present, then motions arise such as are shown in @fig7 and @fig8.
One sees how, through the interlocking of the streams, distinctly separated
vortices form.



The vortex sheet is rolled up in the interior of these vortices, as indicated
in @fig9. The lines of this figure are not streamlines, but rather such as
would be obtained by adding dyed fluid.

#[
  #set image(width: 90%)
  #table(
    columns: (50%, 50%),
    table.cell(
      align: bottom,
      [#figure(
        image("../img/prandtl-trans/figures/fig7.png"),
      )<fig7>],
    ),
    [#figure(
      image("../img/prandtl-trans/figures/fig8.png"),
    )<fig8>],
  )
]





#let fig9wrap = [I shall now briefly report on experiments I undertook for comparison with the
  theory. The experimental apparatus (shown in @fig10 in elevation and plan)
  consists of a 1½ m long trough with an intermediate floor. The water is set
  into circulation by a paddle wheel and enters the upper channel, ordered and
  calmed by a guide apparatus $a$ and four screens $b$, fairly free of
  vorticity; at $e$ the object to be investigated is installed. Suspended in
  the water is a mineral consisting of fine, shiny flakes (iron mica); thereby
  all regions of the water that are appreciably deformed, especially all
  vortices, become visible through a peculiar sheen produced by the orientation
  of the flakes located there.]




#let fig10wrap = [The photograms assembled on the plate were obtained in this way. In all of
  them the flow goes from left to right.
  Nos. 1–4 treat the motion at a wall projecting into the flow. One recognizes
  the separation surface issuing from the edge; in 1 it is still very small, in 2 it is already covered with strong disturbances; in 3 the vortex extends over the entire picture; 4 shows the "steady state." One also notices a
  disturbance above the wall; since in the corner, owing to the stagnation of
  the water stream, a higher pressure prevails, the fluid stream also detaches
  here with time (cf. p. 488). The various streaks visible in the “irrotational”
  part of the flow (especially in Nos. 1 and 2) arise from the fact that at the
  beginning of the motion the fluid was not completely at rest.]


#[
  #set image(width: 90%)
  #table(
    columns: (50%, 50%),
    table.cell(
      align: bottom,
      [#figure(
        image("../img/prandtl-trans/figures/fig9.png"),
      )<fig9>],
    ),
    [#figure(
      image("../img/prandtl-trans/figures/fig10.png"),
    )<fig10>],
  )
]

#fig9wrap

#fig10wrap

Nos. 5 and 6 give the flow around a circularly curved obstacle, or, if one
prefers, through a gradually constricted and then widened channel. No. 5
shows a stage shortly after the beginning of the motion. The upper separation
surface is wound into a spiral, the lower is stretched out and breaks up into
very regular vortices. On the convex side near the right end one notices the
beginning of a separating flow; No. 6 shows the steady state in which the
flow separates approximately at the narrowest cross-section.

Nos. 7–10 show the flow around a circular cylindrical obstacle (a post). No.
7 shows the beginning of separation, 8 and 9 further stages; between the two
vortices a streak is visible—this consists of water that, before the beginning
of separation, had belonged to the transition layer. No. 10 shows the steady
state. The wake of vortical water behind the cylinder swings to and fro,
hence the asymmetric instantaneous shape.

The cylinder contains a slit running along a generator; if one sets this as in
Nos. 11 and 12 and sucks water out of the cylinder interior with a hose, one
can intercept the transition layer of one side. If it is absent, its effect—
separation—must also fail. In No. 11, which corresponds in time to No. 9, one
sees only one vortex and the streak. In No. 12 (steady state) the flow,
although—as one sees—only a vanishingly small part of the water enters the
interior of the cylinder, nevertheless adheres closely to the cylinder wall up
to the slit; but now a separation surface has formed at the plane outer wall
of the trough (a first indication of this phenomenon is already visible in
11). Since in the widening flow opening the velocity must decrease and hence
the pressure rises#footnote[It holds that $1/2 rho v^2 + V + p = "const".$ along each streamline.], the conditions for separation of the flow from the wall
are given; thus even this striking phenomenon finds its justification in the
theory presented.
