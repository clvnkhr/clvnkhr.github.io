import { site } from '../config/site';

export function Footer() {
  return (
    <footer className="border-t border-ctp-surface1 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-ctp-subtext0 text-sm">
            © {new Date().getFullYear()} {site.author.name}
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href={`https://github.com/${site.author.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ctp-subtext0 hover:text-ctp-mauve transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-ctp-surface1">
          <p className="text-ctp-subtext0 text-sm mb-3 text-center">
            Built with
          </p>
          <div className="flex flex-wrap justify-center gap-4 items-center">
            <a href="https://typst.app/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Typst">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="#239DAD"/>
                <path d="M8 8h16v2H8V8zm0 5h16v2H8v-2zm0 5h10v2H8v-2z" fill="white"/>
              </svg>
            </a>
            <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="TypeScript">
              <img src="/assets/img/typescript-logo.svg" alt="TypeScript" className="h-8 w-8" />
            </a>
            <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Tailwind CSS">
              <img src="/assets/img/tailwind-logo.svg" alt="Tailwind CSS" className="h-8 w-8" />
            </a>
            <a href="https://ohmyopencode.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="OpenCode">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="#6366f1"/>
                <path d="M16 8l-8 8h16l-8-8zm-8 10l8 8 8-8H8z" fill="white"/>
              </svg>
            </a>
            <a href="https://z.ai/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Z.ai (GLM-4.7)">
              <img src="/assets/img/glm-logo.png" alt="Z.ai" className="h-8 w-8 rounded" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
