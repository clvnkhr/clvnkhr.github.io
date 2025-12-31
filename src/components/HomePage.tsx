import React from 'react';
import { Layout } from './Layout';
import { site } from '../config/site';

export function HomePage() {
  return (
    <Layout title={site.title}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-ctp-mauve">
            {site.title}
          </h1>
          <p className="text-xl text-ctp-subtext0 max-w-2xl mx-auto">
            {site.description}
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <a
            href="/blog/"
            className="border border-ctp-surface1 rounded-lg p-8 hover:border-ctp-mauve transition-colors group"
          >
            <h2 className="text-3xl font-bold mb-3 text-ctp-mauve group-hover:text-ctp-mauve/80">
              Blog
            </h2>
            <p className="text-ctp-subtext0">
              Thoughts and tutorials about mathematics, programming, and technology.
            </p>
          </a>

          <a
            href="/projects/"
            className="border border-ctp-surface1 rounded-lg p-8 hover:border-ctp-mauve transition-colors group"
          >
            <h2 className="text-3xl font-bold mb-3 text-ctp-mauve group-hover:text-ctp-mauve/80">
              Projects
            </h2>
            <p className="text-ctp-subtext0">
              A portfolio of my open source projects and contributions.
            </p>
          </a>
        </section>
      </div>
    </Layout>
  );
}
