// date: 2023-06-23
// tags: projects, python, latex, web-scraping, math

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "tao2tex")
#title()

Goes through a HTML version of one of Prof Tao's blogposts, and spits out a beautiful LaTeX version.

Made with Python and BeautifulSoup. Correctly hyperlinks, references, boxes definitions and theorems, and includes all comments.

== Links

#link("https://github.com/clvnkhr/tao2tex")[Repository]
