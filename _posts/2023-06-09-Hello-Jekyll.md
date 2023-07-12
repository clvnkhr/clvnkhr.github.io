---
layout: post
title: Hello Jekyll -  A log of my experience setting this site up.
date: 2023-06-09
updated: 2023-07-11
tags: [Jekyll]
splash_img_source: /assets/img/hellojekyll.png
splash_img_caption: Editing the repo in Neovim.
usemathjax: true
---

## 2023-06-09: Setting up site with Jekyll template

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

## 2023-06-10: Fleshing out some pages

The first issue of the day is that I don't know how to override the width setting for images, or how to make them appear inline.
My current workaround to make the image smaller, since I have multiple to show, is to place the images in a table.

## 2023-06-13: Mathjax doesn't work correctly

In the above the $$\int_{-\infty}^\infty \mathrm e^{-x^2}\, \mathrm dx = \frac\pi2$$ renders fine only locally. Here's a test with the backslash:
\\(\int*{-\infty}^\infty \mathrm e^{-x^2}\, \mathrm dx = \frac\pi2\\)
which also works locally. Display math with `\[...\]` also seems to work locally. \\[\int*{-\infty}^\infty \mathrm e^{-x^2}\, \mathrm dx = \frac\pi2\\]. But only locally.

Need to figure out how to make it work...

## 2023-06-26: Mathjax is working correctly

I followed the [Mathjax 3 documentation](https://docs.mathjax.org/en/latest/web/start.html) and it now works.
I'm using the configuration block from [this part](https://docs.mathjax.org/en/latest/options/input/tex.html?highlight=displaymath#the-configuration-block) of the docs.
Specifically, in `_includes/header.html`, I have put

```javascript
<!-- for mathjax support -->
{% if page.usemathjax %}
  <script type="text/x-mathjax-config">
    MathJax = {
      tex: {
        packages: ['base'],        // extensions to use
        inlineMath: [              // start/end delimiter pairs for in-line math
          ['\\(', '\\)']
        ],
        displayMath: [             // start/end delimiter pairs for display math
          ['$$', '$$'],
          ['\\[', '\\]']
        ],
        processEscapes: true,      // use \$ to produce a literal dollar sign
        processEnvironments: true, // process \begin{xxx}...\end{xxx} outside math mode
        processRefs: true,         // process \ref{...} outside of math mode
        digits: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)?|\.[0-9]+)/,
                                   // pattern for recognizing numbers
        tags: 'none',              // or 'ams' or 'all'
        tagSide: 'right',          // side for \tag macros
        tagIndent: '0.8em',        // amount to indent tags
        useLabelIds: true,         // use label name rather than tag for ids
        maxMacros: 1000,           // maximum number of macro substitutions per expression
        maxBuffer: 5 * 1024,       // maximum size for the internal TeX string (5K)
        baseURL:                   // URL for use with links to tags (when there is a <base> tag in effect)
           (document.getElementsByTagName('base').length === 0) ?
            '' : String(document.location).replace(/#.*$/, '')),
        formatError:               // function called when TeX syntax errors occur
            (jax, err) => jax.formatError(err)
      }
    };
  </script>
  <script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
  </script>
{% endif %}
```

Unfortunately, I need to use double slashes in the source i.e. `\\[...\\]`. Small price to pay.

## 2023-06-27: Fixing the projects page

Figured out that `card:hover` was the part not working in Safari. Works nicely in Edge though. Simply turned off the border for now.

## 2023-07-05: Disqus comments turned on

Will need to see if this is useful or just noise.

## 2023-07-11: Math notes

Put links to some math notes up. Also: for consideration in the future:

- perhaps try to recreate [this homepage](https://pme123.github.io/github-pages-demo/develop/2019/04/28/how-to.html) which allows embedding e.g. graphs using Scala.js.
- switch comments to giscus which has support for mathjax natively
