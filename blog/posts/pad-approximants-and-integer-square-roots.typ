// date: 2024-04-14
// tags: coding, maths

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "Padé Approximants and Integer Square Roots")
#title()

The goal of Leetcode 69: Sqrt (Easy) is to provide your own implementation of integer square roots (rounded down), without appealing to a built in power operator or function.

One standard solution is binary search. But I was very amused to discover that one can avoid this with a mathematical device called a #link("https://en.wikipedia.org/wiki/Padé_approximant")[Padé approximant], obtaining a reasonable run time without any knowledge of basic algorithms.
#link("https://clvnkhr.github.io/assets/img/pade-runtime.png")[test]

I was reminded of Padé approximants by this #link("https://www.youtube.com/watch?v=szMaPkJEMrw")[YouTube video]. Essentially, it is a variant Taylor series expansion that takes into account the asymyptotic order of the function, which improves accuracy away from the expansion point. Specifically, for any sufficiently nice function $f$, its Padé approximant at $x=0$ of order $(N,M)$ is the rational polynomial
$ ( sum_(n=0)^N a_n x^n )/(1 + sum_(n=1)^M b_n x^n) $
whose first $N+M$ derivatives at $x=0$ agree with those of $f$.

There is #link("https://shop.elsevier.com/books/essentials-of-pade-approximants/baker/978-0-12-074855-6")[much to be said] about #link("https://mathoverflow.net/questions/122539/the-unreasonable-effectiveness-of-padé-approximation")[the magic of Padé approximants], and I certainly haven't read it all. Some questions about it can be found #link("(https://math.stackexchange.com/questions/1474035/rigorous-rationale-for-the-pade-approximant")[here]).

Going back to Leetcode 69, the sketch of my solution is as follows. In order to compute the rounded square root of some number $x$,

1. Find an approximate square $s=r^2$ below $x$ but not too far from the true answer
2. use the percentage difference $dif s = (s-x)/s$ in the Padé approximation of order $(3,1)$ of $(1+t)^(1/2)$, which is
$ (-t^3/64 + 3t^2/16 + 9t/8 + 1)/(5t/8 + 1) $
This is related to computing $x^(1/2)$ via $x^(1/2) = r (1 + dif s)^(1/2).$
3. Round down and check answer. If its not right, then fallback to something else (to emphasise how good the approximation is, I implemented a naive linear search from the point predicted by the Padé approximant.)

Here's the code. #link("https://leetcode.com/problems/sqrtx/")[do try it out]:

```python
class Solution:
    def eh(self, x, g):
        '''eh wtv'''
        gg = g * g
        return (gg == x) or (gg < x and (g+1) * (g+1) > x)

    def mySqrt(self, x: int) -> int:
        if x==0:
            return 0
        if x<4:
            return 1
        g1, g2 = 1,2
        while g2 * g2 < x:
            g1, g2 = g2, 2 * g2

        if g2*g2 == x:
            return g2
        if self.eh(x,g1):
            return g1

        # to get sqrt(x) we put x = g^2 ( 1 + ds) and use a Padé approximant
        # where g is the closest guess

        g = g1 if abs(x - g1) < abs(x - g2) else g2
        gg = g*g
        ds = (x - gg)/(gg)
        # pade approximation to sqrt(1+x) of order (3,1) seems 'best'
        pade_g = g * (1 + (9 * ds)/8 + (3 * ds * ds)/16 - ds * ds * ds/64)/(1 + (5 * ds)/8)

        # order (2,2):
        # pade_g = g * ((5 * ds * ds)/16 + (5 * ds)/4 + 1)/(ds * ds/16 + (3 * ds)/4 + 1)

        ipg = int(pade_g)

        # i've run out of math magic so just fumble around like a linear fool
        while not self.eh(x, ipg):
            if ipg*ipg < x:
                ipg = ipg + 1
            else: #else if itg*itg > x:
                ipg = ipg - 1
        return ipg
```

Time permitting, I will come back to this and properly analyse the code, and see how well it performs if I fall back to say binary search instead.
