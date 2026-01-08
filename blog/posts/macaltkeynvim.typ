// date: 2023-01-06
// tags: projects, neovim, coding

#import "../templates/math.typ": html_fmt
#show: html_fmt

#set document(title: "macaltkey.nvim")
#title()

A simple Neovim plugin that simplifies setting alt/option key bindings on Mac by converting intuitive syntax like `<a-a>` to proper unicode characters like å, making configurations more readable and maintainable. The plugin provides convenience functions for keymap management that transparently pass through to standard Neovim APIs on non-Mac systems or when no special key sequences are detected. It supports both US and British keyboard layouts with configurable options for double-setting converted keybinds.


== Links

- #link("https://github.com/clvnkhr/macaltkey.nvim")[Repository]
- #link(
    "https://web.archive.org/web/20230627023735/https://old.reddit.com/r/neovim/comments/13om6ew/i_made_macaltkeynvim_a_plugin_to_simplify/",
  )[Reddit post (archived)]

Check out the repository to learn more about usage and setup options.
