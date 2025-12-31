export interface Project {
  name: string;
  id: string;
  imgSrc?: string;
  descriptionLess: string;
  descriptionMore?: string;
  actionButtons?: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    name: "tao2tex",
    id: "p-tao2tex",
    imgSrc: "/assets/img/tao2tex.png",
    descriptionLess: "Goes through a HTML version of one of Prof Tao's blogposts, and spits out a beautiful LaTeX version.",
    descriptionMore: "<p>Leverages Python and BeautifulSoup. Correctly hyperlinks, references, boxes definitions and theorems, and includes all comments.</p>",
    actionButtons: `<a href="https://github.com/clvnkhr/tao2tex" target="_blank" class="px-4 py-2 bg-ctp-mauve hover:bg-ctp-mauve/80 text-ctp-crust rounded transition-colors">Repository</a>`,
    tags: ["python", "latex"],
  },
  {
    name: "macaltkey.nvim",
    id: "p-mak",
    imgSrc: "/assets/img/macaltkey.png",
    descriptionLess: "A simple neovim plugin to simplify alt-keybindings on Mac",
    actionButtons: `
      <a href="https://github.com/clvnkhr/macaltkey.nvim" target="_blank" class="px-4 py-2 bg-ctp-mauve hover:bg-ctp-mauve/80 text-ctp-crust rounded transition-colors">Repository</a>
      <a href="https://web.archive.org/web/20230627023735/https://old.reddit.com/r/neovim/comments/13om6ew/i_made_macaltkeynvim_a_plugin_to_simplify/" target="_blank" class="px-4 py-2 bg-ctp-blue hover:bg-ctp-blue/80 text-ctp-crust rounded transition-colors">Reddit post (archived)</a>
    `,
    tags: ["neovim"],
  },
  {
    name: "Project Euler in Scala 3",
    id: "p-euler-scala-3",
    imgSrc: "/assets/img/projecteuler.png",
    descriptionLess: "Solutions to first few Project Euler problems in Scala 3",
    actionButtons: `<a href="https://github.com/clvnkhr/Project-Euler-in-Scala-3/" target="_blank" class="px-4 py-2 bg-ctp-mauve hover:bg-ctp-mauve/80 text-ctp-crust rounded transition-colors">Repository</a>`,
    tags: ["math", "coding"],
  },
];
