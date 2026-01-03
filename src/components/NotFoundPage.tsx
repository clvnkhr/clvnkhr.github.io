import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';

export function NotFoundPage() {
  return (
    <Layout title={`404 - ${site.title}`}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 text-ctp-mauve">404</h1>
          <p className="text-2xl text-ctp-subtext0 mb-8">
            Page not found
          </p>
          <p className="text-ctp-subtext0 mb-8 max-w-lg mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/"
              className="px-6 py-3 rounded-lg bg-ctp-mauve text-ctp-base hover:bg-ctp-mauve/80 transition-colors"
            >
              Go Home
            </a>
            <a
              href="/blog/"
              className="px-6 py-3 rounded-lg border border-ctp-mauve text-ctp-mauve hover:bg-ctp-surface1 transition-colors"
            >
              Browse Blog
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
