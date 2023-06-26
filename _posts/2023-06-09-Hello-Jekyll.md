---
layout: post
title: Hello Jekyll -  A log of my experience setting this site up.
date: 2023-06-09
updated: 2023-06-26
tags: [Jekyll]
splash_img_source: /assets/img/hellojekyll.png
splash_img_caption: Editing the repo in Neovim.
usemathjax: true
---



# 2023-06-09: Setting up site with Jekyll template

I needed `bundle add webrick` as stated in 
 [Github's own docs](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)
 but also `bundle update liquid`, which the good Bing told me about 😊

Colours can be changed in `assets/css/main.css`, but there are also some settings in `_includes/page/dark_mode.html`

Modifications to the header can be made in `_includes/header.html`. At the moment I have added a hard-link to a generated post.

For Mathjax support, I followed [this link](http://webdocs.cs.ualberta.ca/~zichen2/blog/coding/setup/2019/02/17/how-to-add-mathjax-support-to-jekyll.html),
which does allow some math like $$\int_{-\infty}^\infty \mathrm e^{-x^2}\, \mathrm dx = \frac\pi2$$, but I find it a little odd. 
Should probably be possible to copy the setup from Math.SE.

I tried to simply write a new tag into existence by using it ('maths') but it does not seem to automatically work. 
So I have manually added a page for the maths tag at `/pages/tags/maths.html`.
  
Somehow, mousing over some of the project cards makes them disappear. 
Not entirely sure I can fix it myself, but maybe I can disable the mouseover animation.

# 2023-06-10: Fleshing out some pages

The first issue of the day is that I don't know how to override the width setting for images, or how to make them appear inline. 
My current workaround to make the image smaller, since I have multiple to show, is to place the images in a table.

# 2023-06-13: Mathjax doesn't work correctly
In the above the $$\int_{-\infty}^\infty \mathrm e^{-x^2}\, \mathrm dx = \frac\pi2$$ renders fine only locally. Here's a test with the backslash:
\\(\int_{-\infty}^\infty \mathrm e^{-x^2}\, \mathrm dx = \frac\pi2\\)
which also works locally. Display math with `\[...\]` also seems to work locally. \\[\int_{-\infty}^\infty \mathrm e^{-x^2}\, \mathrm dx = \frac\pi2\\]. But only locally.

Need to figure out how to make it work...
