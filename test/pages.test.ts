import { describe, it, expect } from 'bun:test';
import { Effect } from 'effect';
import { renderBlogIndex, renderTagPage } from '../src/build/pages.js';
import { site } from '../src/config/site.js';
import type { Post } from '../src/types/post.js';

function makePost(overrides: Partial<Post> & Pick<Post, 'slug' | 'title' | 'date'>): Post {
  return {
    path: `/blog/${overrides.slug}/`,
    htmlContent: '<p>Intro <math><mi>x</mi></math> more text</p>',
    tags: [],
    ...overrides,
  };
}

describe('Page rendering', () => {
  it('renders blog index tag filters and searchable post attributes', () => {
    const posts = [
      makePost({
        slug: 'typst-migration',
        title: 'Typst Migration',
        date: new Date('2026-06-23'),
        tags: ['blog', 'typst'],
      }),
      makePost({
        slug: 'navier-stokes',
        title: 'Navier Stokes',
        date: new Date('2026-06-01'),
        tags: ['maths'],
        description: 'A fluid mechanics note',
      }),
    ];

    const html = Effect.runSync(renderBlogIndex(site, posts));

    expect(html).toContain('xl:grid-cols-[minmax(0,1fr)_minmax(0,56rem)_minmax(0,1fr)]');
    expect(html).not.toContain('grid-cols-[minmax(0,14rem)_minmax(0,56rem)_minmax(0,14rem)]');
    expect(html).toContain('data-blog-tag-filters');
    expect(html).toContain('data-blog-tag-reset');
    expect(html).toContain('data-blog-tag-hide-all');
    expect(html).toContain('data-blog-tag-toggle');
    expect(html).toContain('value="blog"');
    expect(html).toContain('value="maths"');
    expect(html).toContain('value="typst"');
    expect(html).toContain('data-search-date="June 23, 2026"');
    expect(html).toContain('data-filter-tags="blog typst"');
    expect(html).toContain('data-search-blurb="Intro x more text"');
    expect(html).not.toContain('data-search-blurb="Intro <math>');
  });

  it('renders tag pages with search data including dates', () => {
    const posts = [
      makePost({
        slug: 'tagged-post',
        title: 'Tagged Post',
        date: new Date('2026-06-23'),
        tags: ['typst'],
      }),
    ];

    const html = Effect.runSync(renderTagPage(site, 'typst', posts));

    expect(html).toContain('id="blog-search-input"');
    expect(html).toContain('autofocus=""');
    expect(html).toContain('data-search-date="June 23, 2026"');
    expect(html).toContain('data-search-tags="typst"');
    expect(html).toContain('<math><mi>x</mi></math>');
    expect(html).toContain('data-search-blurb="Intro x more text"');
  });
});
