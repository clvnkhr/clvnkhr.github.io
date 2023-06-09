---
layout: post
title: Hello Jekyll -  A log of my experience setting this site up.
date: 2023-06-09
tags: [Jekyll]
splash_img_source: /assets/img/books-1204029_1920.jpg
splash_img_caption: Representative image. Image by <a href="https://pixabay.com/users/luboshouska-198496/">LubosHouska</a> on Pixabay.
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

Most things seem to work. Exceptions:
  - I tried to simply write a new tag into existence by using it ('maths') but it does not automatically work. 
Will need to fix next time I have time to work on this.
  - Somehow, mousing over some of the project cards makes them disappear. 
  Not entirely sure I can fix it myself, but maybe I can disable the mouseover animation.
