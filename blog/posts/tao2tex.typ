// date: 2023-06-23
// tags: projects, python, latex, web-scraping, maths

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "tao2tex")
#title()

A Python tool that converts HTML versions of mathematical blog posts (primarily from Prof. Terry Tao's WordPress blog) into beautifully formatted LaTeX documents using regex and BeautifulSoup. It serves as a partial inverse to LaTeX2WP, with the added benefit of preserving comment sections which often contain valuable insights. The tool correctly processes hyperlinks, references, theorem boxes, and definitions while supporting multiple usage modes including URL processing, local file conversion, and batch operations. Output can be customized through the preamble.tex file, and the tool includes emoji processing with configurable LaTeX support.


== Links

#link("https://github.com/clvnkhr/tao2tex")[Repository]

Check out the repository for usage instructions, requirements, and customization options.
