---
layout: post
title: Maxwell's Theorem
date: 2023-07-13
# updated: 2023-06-26
tags: [maths]
usemathjax: true
---

In a [recent 3Blue1Brown video](https://www.youtube.com/watch?v=d_qvLDhkg00&t=621s),
it was mentioned that the 2D (centered) Gaussian are the unique distributions which are radial and has independent marginals.
On a google I found out that this is known as [Maxwell's theorem](https://en.wikipedia.org/wiki/Maxwell%27s_theorem),
but the linked Wikipedia page is a little lacking. [This](https://verzettelung.com/20/10/26/) blogpost does a better job
The blogpost says that the solution to
\\(h(x)h(y) = h(\sqrt{x^2 + y^2})\\) is clearly of the form \\(e^{ax^2}\\).
For anyone else who doesn't want to spend the 5 seconds necessary to unpack this, you should set \\(H(x):=h(\sqrt x)\\)
(without loss of generality \\(x\ge0\\)) to find the equivalent equation \\[ H(x^2) H(y^2) = H(x^2 + y^2),\\]
which is essentially the defining characteristic of the exponential, i.e. \\(H(x)=e^{ax}\\).

However there are some pedantic points that one might bring up. The first is that the exponential is not the only solution:
search for exponential in [this Math.SE post](https://math.stackexchange.com/questions/423492/overview-of-basic-facts-about-cauchy-functional-equation?noredirect=1&lq=1).
This can indeed be ignored since the other solutions will not lead to a probability distribution.
The second is more interesting, and comes back to the rough state of the Wikipedia [page](https://en.wikipedia.org/wiki/Maxwell%27s_theorem).
The proof given there is as follows:

> We only need to prove the theorem for the 2-dimensional case, since we can then generalize it to n-dimensions by applying the theorem sequentially to each pair of coordinates.
> Since rotating by 90 degrees preserves the joint distribution, both \\(X_1, X_2\\) has the same probability measure. Let it be \\(\mu\\). If \\(\mu\\) is a Dirac delta distribution at zero, then it's a gaussian distribution, just degenerate. Now assume that it is not.
> By , we decompose it to a sum of regular measure and an atomic measure: \\(\mu = \mu_r + \mu_s\\). We need to show that \\(\mu_s = 0\\), with a proof by contradiction.
> Suppose \\(\mu_s\\) contains an atomic part, then there exists some \\(x\in \mathbb R\\) such that \\(\mu_s(\{x\}) > 0\\). By independence of \\(X_1, X_2\\), the conditional variable \\(X_2 | \{X_1 = x\}\\) is distributed the same way as \\(X_2\\). Suppose \\(x=0\\), then since we assumed \\(\mu\\) is not concentrated at zero, \\(Pr(X_2 \neq 0) > 0\\), and so the double ray \\(\{(x_1, x_2): x_1 = 0, x_2 \neq 0\}\\) has nonzero probability. Now by rotational symmetry of \\(\mu \times \mu\\), any rotation of the double ray also has the same nonzero probability, and since any two rotations are disjoint, their union has infinite probability, contradiction.
> (As far as we can find, there is no literature about the case where \\(\mu_s\\) is singularly continuous, so we will let that case go.)
> So now let \\(\mu \\) have probability density function \\(\rho\\), and the problem reduces to solving the functional equation
> \\[\rho(x)\rho(y) = \rho(x \cos \theta + y \sin\theta)\rho(x \sin \theta - y \cos\theta)\\]

Ignoring that the proof isn't complete, the Wikipedia article points out that that it is assumed that there is a distribution function.
What the earlier blogpost actually gives a proof for is the following result:

> Theorem (Maxwell) The (centered) gaussians are the only absolutely continuous distributions on \\(\mathbb R^n \\) which are radial and have independent marginals.
> n

Indeed, the Dirac mass at 0 is a different solution, although it is quite natural as a kind of 'degenerate' Gaussian.
But it seems that the possible existence of singular continuous distributions is not settled. Some tangentially related links for if I come back to this (or the interested reader):

- [If \\(f\\) is singular continuous it is possible that \\(f\*f\\) is either singular continuous or absolutely continuous.](https://mathoverflow.net/questions/446600/)
- [Simple example of a singular distribution](https://www.jstor.org/stable/2682772)
- [A paper that discusses singular distributions](http://www.stat.uchicago.edu/~lalley/Papers/indistinguishability.pdf)
- [Another paper that discusses singular continuous distributions](https://www.jstor.org/stable/2238043)
- [A more expository note discussing singular continuous functions](https://sites.math.northwestern.edu/~ehsu/Class%20of%20Singular%20Contnuous%20Functions.pdf)
- [A paper on Brownian motion with singular drift](http://www.jstor.org/stable/3481661?origin=JSTOR-pdf)
- [An example of a singular continuous distribution arising from a random walk](https://web.archive.org/web/20151202055102/http://www.calpoly.edu/~kmorriso/Research/RandomWalks.pdf)
