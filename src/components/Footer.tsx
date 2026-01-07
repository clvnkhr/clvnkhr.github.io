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
          <div className="flex flex-wrap justify-center gap-3 items-center">
            <a href="https://typst.app/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/assets/img/typst-logo.svg" alt="Typst" className="h-6" />
            </a>
            <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/assets/img/typescript-logo.svg" alt="TypeScript" className="h-6" />
            </a>
            <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/assets/img/tailwind-logo.svg" alt="Tailwind CSS" className="h-6" />
            </a>
            <a href="https://ohmyopencode.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/assets/img/opencode-logo.svg" alt="OpenCode" className="h-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/assets/img/glm-logo.svg" alt="GLM-4.7" className="h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
