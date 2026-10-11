import { site as defaultSite } from '../config/site';
import type { SiteConfig } from '../config/site';

interface HeaderProps {
  site?: SiteConfig;
}

export function Header({ site = defaultSite }: HeaderProps) {
  return (
    <header className="site-header border-b border-ctp-surface1">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-between gap-4">
          <a href="/" aria-label={site.title} className="text-xl font-bold text-ctp-mauve hover:text-ctp-mauve/80 transition-colors">
            <span className="md:hidden">CK</span>
            <span className="hidden md:inline">{site.title}</span>
          </a>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 md:gap-x-6">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="nav-link text-ctp-subtext0 hover:text-ctp-text transition-colors"
                >
                  {item.label === "Mathematics" ? (
                    <>
                      <span className="md:hidden">Maths</span>
                      <span className="hidden md:inline">Mathematics</span>
                    </>
                  ) : (
                    item.label
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
