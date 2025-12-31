import { site } from '../config/site';

export function Footer() {
  return (
    <footer className="border-t border-ctp-surface1 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
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
      </div>
    </footer>
  );
}
