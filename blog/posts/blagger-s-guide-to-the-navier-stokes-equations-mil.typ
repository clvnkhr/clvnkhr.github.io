// date: 2024-04-24
// tags: maths
// hidden: true

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "Blagger's guide to the Navier-Stokes Equations Millenium Problem")
#title()

The point of this note is to allow non-experts to have a feeling for the Navier--Stokes Equations Millenium problem (hereafter NSEMP) the same way people can understand e.g. Fermat's Last Theorem. Being a statement in number theory, it is easy to explain. It is also famously hard to prove. NSEMP is currently open but it seems most people do not even comprehend what the problem is.

= The incompressible Navier-Stokes equations
For \$d = 2\$ or \$3\$, \$x \in \mathbb R^d \$, and \$t \in \mathbb R\$, the incompressible Navier--Stokes equation describes the velocity \$u=u(x,t) \in \mathbb R^d\$ and pressure \$p=p(x,t) \in \mathbb R\$ of a fluid at each position \$x\$ and time \$t\$:
\begin{align}
\begin{cases} \partial_t u + u \cdot \nabla u &= - \nabla p + \Delta u \\\\\\\\
\nabla \cdot u &= 0
\end{cases}
\end{align}
We have set the viscosity \$\nu=1\$ for simplicity. There are 4 unknown functions: one vector field \$u = (u_1, u_2, u_3)\$ and one scalar function \$p\$. The first equation is the 'main' equation derives from conservation of momentum (\$F=ma\$) and the second is a incompressiblity constraint that \$u\$ has to satisfy.

== A word on modelling
This equation assumes that there are no external forces acting on the fluid. In addition, we assume that there is only a single body of fluid, that stretches infinitely far. In particular this situation does not model water in a cup; this is a bounded volume of water in a hard container surrounded by air. Splashing and bubbles are hard to describe (for instance, what happens topologically?). Boundaries can be accounted for but make the problem more complicated.

In fact (just skip this paragraph), when one says Navier-Stokes, some might say you are referring to the compressible equations, which one usually first derives. The compressible equations are two equations, one stemming from conservation of momentum, and one stemming from conservation of mass. These involve the density \$\rho\$ and certain stress tensors. The incompressiblity assumption is that the stress tensor assumes a certain simple form, which converts the mass equation into the divergence-free condition, and the momentum equation to take the above form. The details can be found on #link("https://en.wikipedia.org/wiki/Derivation_of_the_Navier–Stokes_equations#Continuity_equations")[Wikipedia].

== The Problem Statement
Cauchy Problem

= Simpler problems we do understand
Burger's equation
Heat equation

= Problems closer to 3D Navier-Stokes we still understand

= What we do know about 3D Navier-Stokes
Basic sources for Navier-Stokes

Classic references
- Majda-Bertozzi
- Constantin-Foias

See also
- Jose Book

Sources from Fields Institute on problem statement
-

Why the problem is hard
-
-

What we know

Recent progress
- convex integration
- + forcing
- Euler
