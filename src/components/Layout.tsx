import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  darkMode?: boolean;
}

export function Layout({ children, title, darkMode = true }: LayoutProps) {
  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {title && <title>{title}</title>}
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body className=" min-h-screen bg-ctp-base text-ctp-text antialiased transition-colors duration-300">
        <Header />
        <main className="min-h-[calc(100vh-theme(spacing.64))]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}