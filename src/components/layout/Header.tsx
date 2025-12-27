import { useDarkMode } from '../../hooks/useDarkMode';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/posts', label: 'Posts' },
    { path: '/projects', label: 'Projects' },
  ];
  
  return (
    <header className={`
      sticky top-0 z-50 backdrop-blur-lg
      border-b transition-colors duration-300
      ${isDark 
        ? 'bg-dark-bg/80 border-slate-700' 
        : 'bg-light-bg/80 border-slate-200'}
    `}>
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold hover:text-primary transition-colors"
          >
            CK
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  font-medium transition-colors
                  ${location.pathname === item.path
                    ? 'text-primary'
                    : isDark ? 'hover:text-slate-300' : 'hover:text-slate-600'}
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}
