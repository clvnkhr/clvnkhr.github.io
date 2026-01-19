import { site } from '../config/site';

export function Header() {
  return (
    <header className="border-b border-ctp-surface1">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-ctp-mauve hover:text-ctp-mauve/80 transition-colors">
            <span className="md:hidden">CK</span>
            <span className="hidden md:inline">{site.title}</span>
          </a>
          <ul className="flex space-x-6">
            {site.navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ctp-subtext0 hover:text-ctp-text transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
