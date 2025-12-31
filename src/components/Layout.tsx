import React from 'react';

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
      <body className="mocha min-h-screen bg-ctp-base text-ctp-text antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}