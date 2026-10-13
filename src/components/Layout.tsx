import { Header } from './Header';
import { Footer } from './Footer';
import { site as defaultSite } from '../config/site';
import type { SiteConfig } from '../config/site';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackToTop?: boolean;
  site?: SiteConfig;
}

export function Layout({ children, title, showBackToTop = true, site = defaultSite }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {title && <title>{title}</title>}
        <script src="/assets/js/page-motion.js"></script>
        <link rel="stylesheet" href="/assets/css/main.css" />
        <script src="/assets/js/back-to-top.js" defer></script>
        <script src="/assets/js/tag-search.js" defer></script>
        <script src="/assets/js/blog-search.js" defer></script>
      </head>
      <body className="min-h-screen bg-ctp-base text-ctp-text antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header site={site} />
        <main id="main-content" tabIndex={-1} className="page-content min-h-[calc(100vh-theme(spacing.64))]">
          {children}
        </main>
        <Footer site={site} showBackToTop={showBackToTop} />
      </body>
    </html>
  );
}
