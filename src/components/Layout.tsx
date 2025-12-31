import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  darkMode?: boolean;
}

export function Layout({ children, title, darkMode }: LayoutProps) {
  return (
    <html lang="en" className={darkMode ? 'dark' : ''}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {title && <title>{title}</title>}
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body className="bg-ctp-base dark:bg-ctp-mocha-base text-ctp-text dark:text-ctp-mocha-text">
        {children}
      </body>
    </html>
  );
}
