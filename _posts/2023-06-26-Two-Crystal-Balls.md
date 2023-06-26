---
layout: post
title: Comments on the Two Crystal Balls problem
date: 2023-06-26
# updated: 2023-06-26
tags: [coding, maths]
splash_img_source: /assets/img/hellojekyll.png
splash_img_caption: Editing the repo in Neovim.
usemathjax: true
---

The Two Crystal Balls problem, as mentioned in e.g. [this course](https://frontendmasters.com/courses/algorithms/two-crystal-balls-problem/), is the following problem:


> You are given two identical crystal balls that will break if dropped from high enough. You are allowed to repeatedly drop them from different (integer) heights. Find the lowest distance (less than a given maximum) from which the balls will break. What is the optimal time complexity?

The breaking condition is significant and rules out binary search, as once the first ball breaks, you are forced to linearly search through the heights in sequence. This would make it seem as the complexity is O(n), but it is actually O(sqrt(n)).

The optimal algorithm is to first linearly search with jumps of size S=O(sqrt(n)) until the first ball breaks. If it doesn't break, then we have finished by making N=O(sqrt(n)) jumps. Otherwise, take the previous known safe position and progressively increment the height by 1 until it breaks; in the worst case, this causes us to check an additional S balls. The final complexity is S+N=O(sqrt(n)).

This much was in the course. There are two comments I'd like to make.

## Optimality

Firstly, it is possible to show that this is the optimum. From http://www.tanyakhovanova.com/Puzzles/solballs.html:

Suppose we have a strategy which always terminates in at most N throws. Then the floor is defined by two numbers: the number of throws before first ball breaks, and similarly for the the second ball. The sum of these two numbers should be less than or equal to N. Hence, the number of floors we can distinguish is the number of different pairs of such numbers, which is equal to N(N+1)/2.

## Generalisation 

Secondly, this can be generalised to the case of any finite number K of balls: the time complexity is `O(n^{1/K})`. The required modification is simply to take the first jump length to be S1=O(n^{1-1/K}), which results in N=O(n^{1/K}) jumps. 
With the second ball, take S2=O(n^{1-2/K}) jumps. it again takes N jumps to cover a distance of length S1. 
With the third ball, take S3=O(n^{1-3/K}), and so on, until with the Kth ball, you linearly search 
(i.e. SK = O(1) = O(n^{1-K/K}).) 
We use each ball to make N jumps, so the total number of jumps is KN=O(n^{1-1/K}). 

The fact that this algorithm is optimal up to constants is also by a similar argument: the number of K tuples is a polynomial of order K.

It is amusing that in the limit of infinite balls K\to\infty, we formally obtain O(1) which is off by a log (binary search). This "n^0=log(n)" appears in many places in mathematics. The simplest instance of this that I know of is the fact that the integral of x^k is x^{k+1} (times a constant) unless k=-1, in which case it is log x. 
