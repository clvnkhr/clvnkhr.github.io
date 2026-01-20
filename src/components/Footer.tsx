import { site } from '../config/site';

export function Footer() {
  return (
    <footer className="border-t border-ctp-surface1 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-6">
          <button
            data-back-to-top
            className="text-sm text-ctp-subtext0 hover:text-ctp-mauve transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to top
          </button>
          <div className="text-ctp-subtext0 text-sm">
            © {new Date().getFullYear()} {site.author.name} · Built with <a href="https://typst.app/" target="_blank" rel="noopener noreferrer" className="text-ctp-mauve hover:text-ctp-mauve/80 transition-colors">Typst</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
