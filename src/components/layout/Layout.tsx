import { useDarkMode } from '../../hooks/useDarkMode';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  const { isDark } = useDarkMode();
  
  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${isDark 
        ? 'bg-dark-bg text-dark-text' 
        : 'bg-light-bg text-light-text'}
    `}>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
}
