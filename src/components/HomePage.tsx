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
          <p className="text-xl text-ctp-subtext0 max-w-2xl mx-auto mb-6">
            {site.description}
          </p>
          <p className="text-lg text-ctp-text mb-2">
            I'm looking for interesting opportunities: <a href="https://github.com/clvnkhr/resume/blob/master/cv-llt.pdf" target="_blank" rel="noopener noreferrer" className="text-ctp-mauve hover:text-ctp-mauve/80 transition-colors">check out my resume</a>. PhD in Mathematics.
          </p>
          <p className="text-lg text-ctp-text mb-2">
            Contact me at <a href="mailto:calvin_khor@hotmail.com" className="text-ctp-mauve hover:text-ctp-mauve/80 transition-colors">calvin_khor@hotmail.com</a>.
          </p>
          <p className="text-lg text-ctp-text">
            Happily married to <a href="https://sites.google.com/view/xiaoyan-su" target="_blank" rel="noopener noreferrer" className="text-ctp-mauve hover:text-ctp-mauve/80 transition-colors">Xiaoyan Su</a>!
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3 mt-12">
          <a
            href="/blog/2023/06/09/mathematics/"
            className="border border-ctp-surface1 rounded-lg p-8 hover:border-ctp-mauve transition-colors group"
          >
            <h2 className="text-3xl font-bold mb-3 text-ctp-mauve group-hover:text-ctp-mauve/80">
              Mathematics
            </h2>
            <p className="text-ctp-subtext0">
              Publications, notes, teaching materials, and translations.
            </p>
          </a>

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
            href="/tags/projects/"
            className="border border-ctp-surface1 rounded-lg p-8 hover:border-ctp-mauve transition-colors group"
          >
            <h2 className="text-3xl font-bold mb-3 text-ctp-mauve group-hover:text-ctp-mauve/80">
              Projects
            </h2>
            <p className="text-ctp-subtext0">
              My open source projects and contributions.
            </p>
          </a>
        </section>
      </div>
    </Layout>
  );
}
