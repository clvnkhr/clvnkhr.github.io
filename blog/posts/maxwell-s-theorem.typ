// date: 2023-07-13
// tags: maths

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set quote(block: true)
#show quote: set text(weight: 100)

#set document(title: "Maxwell's Theorem")
#title()

In a #link("https://www.youtube.com/watch?v=d_qvLDhkg00&t=621s")[recent 3Blue1Brown video],
it was mentioned that the 2D (centered) Gaussian are the unique distributions which are radial and have independent marginals.
On a google I found out that this is known as #link("https://en.wikipedia.org/wiki/Maxwell%27s_theorem")[Maxwell's theorem],
but the linked Wikipedia page is a little lacking. #link("https://verzettelung.com/20/10/26/")[This] blogpost does a better job.
The blogpost says that the solution to
$h(x)h(y) = h(sqrt(x^2 + y^2))$ is clearly of the form $e^(a x^2)$.
For anyone else who doesn't want to spend the 5 seconds necessary to unpack this, you should set $H(x):=h(sqrt(x))$
(without loss of generality $x>=0$) to find the equivalent equation $H(x^2) H(y^2) = H(x^2 + y^2),$
which is essentially the defining characteristic of the exponential, i.e. $H(x)=e^(a x)$.

However there are some pedantic points that one might bring up. The first is that the exponential is not the only solution:
search for exponential in #link("https://math.stackexchange.com/questions/423492/overview-of-basic-facts-about-cauchy-functional-equation?noredirect=1&lq=1")[this Math.SE post].
This can indeed be ignored since the other solutions will not lead to a probability distribution.
The second is more interesting, and comes back to the rough state of the Wikipedia #link("https://en.wikipedia.org/wiki/Maxwell%27s_theorem")[page].
The proof given there is as follows:

#quote[
  We only need to prove the theorem for the 2-dimensional case, since we can then generalize it to n-dimensions by applying the theorem sequentially to each pair of coordinates.

  Since rotating by $90$ degrees preserves the joint distribution, both $X_1, X_2$ has the same probability measure. Let it be $mu$. If $mu$ is a Dirac delta distribution at zero, then it's a gaussian distribution, just degenerate. Now assume that it is not.

  By Lebesgue's decomposition theorem, we decompose it to a sum of regular measure and an atomic measure: $mu = mu_r + mu_s$. We need to show that $mu_s = 0$, with a proof by contradiction.

  Suppose $mu_s$ contains an atomic part, then there exists some $x in RR$ such that $mu_s ({x}) > 0$.
  By independence of $X_1, X_2$, the conditional variable $X_2 | \{X_1 = x\)$ is distributed the same way as $X_2$.
  Suppose $x=0$, then since we assumed $mu$ is not concentrated at zero, $"Pr"(X_2 \neq 0) > 0$, and so the double ray ${(x_1, x_2): x_1 = 0, x_2 \neq 0}$ has nonzero probability.
  Now by rotational symmetry of $mu times mu$, any rotation of the double ray also has the same nonzero probability, and since any two rotations are disjoint, their union has infinite probability, contradiction.


  So now let $mu$ have probability density function $rho$, and the problem reduces to solving the functional equation
  $ rho(x)rho(y) = rho(x cos theta + y sin theta)rho(x sin theta - y cos theta) $
]


Ignoring that the proof isn't complete, the Wikipedia article points out that that it is assumed that there is a distribution function.
What the earlier blogpost actually gives a proof for is the following result:

#quote[
  *Theorem (Maxwell)* The (centered) gaussians are the only absolutely continuous distributions on $RR^n$ which are radial and have independent marginals.
]


Indeed, the Dirac mass at $0$ is a different solution, although it is quite natural as a kind of 'degenerate' Gaussian.
It seems that the possible existence of singular continuous distributions is not settled. Some tangentially related links for if I come back to this (or the interested reader):

- #link(
    "https://mathoverflow.net/questions/446600/",
  )[If $f$ is singular continuous it is possible that $f\*f$ is either singular continuous or absolutely continuous.]
- #link("https://www.jstor.org/stable/2682772")[Simple example of a singular distribution]
- #link(
    "http://www.stat.uchicago.edu/~lalley/Papers/indistinguishability.pdf",
  )[A paper that discusses singular distributions]
- #link("https://www.jstor.org/stable/2238043")[Another paper that discusses singular continuous distributions]
- #link(
    "https://sites.math.northwestern.edu/~ehsu/Class%20of%20Singular%20Contnuous%20Functions.pdf",
  )[A more expository note discussing singular continuous functions]
- #link("http://www.jstor.org/stable/3481661?origin=JSTOR-pdf")[A paper on Brownian motion with singular drift]
- #link(
    "https://web.archive.org/web/20151202055102/http://www.calpoly.edu/~kmorriso/Research/RandomWalks.pdf",
  )[An example of a singular continuous distribution arising from a random walk]
