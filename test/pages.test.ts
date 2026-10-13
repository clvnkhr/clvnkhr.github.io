import { describe, it, expect } from 'bun:test';
import { Effect } from 'effect';
import { renderBlogIndex, renderTagPage, renderPostPage, renderHomePage, renderTagsIndex } from '../src/build/pages.js';
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
    expect(html).toContain('data-filter-tags="[&quot;blog&quot;,&quot;typst&quot;]"');
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
    expect(html).toContain('aria-label="Search posts"');
    expect(html).not.toContain('autofocus');
    expect(html).toContain('data-search-date="June 23, 2026"');
    expect(html).toContain('data-search-tags="typst"');
    expect(html).toContain('<math><mi>x</mi></math>');
    expect(html).toContain('data-search-blurb="Intro x more text"');
  });

  it('renders one main landmark, named search inputs, and result status on listing pages', () => {
    const pages = [
      Effect.runSync(renderBlogIndex(site, [])),
      Effect.runSync(renderTagPage(site, 'maths', [])),
      Effect.runSync(renderTagsIndex(site, [], {})),
    ];
    for (const html of pages) {
      expect(html.match(/<main\b/g)).toHaveLength(1);
      expect(html).toContain('href="#main-content"');
      expect(html).toContain('type="search"');
      expect(html).toContain('role="status"');
      expect(html).not.toContain('<p hidden=""');
    }
  });

  it('encodes tag links and keeps tags containing spaces intact for filtering', () => {
    const post = makePost({ slug: 'tag-test', title: 'Tag Test', date: new Date('2026-06-23'), tags: ['functional analysis', 'c#'] });
    const html = Effect.runSync(renderBlogIndex(site, [post]));
    expect(html).toContain('href="/tags/functional%20analysis/"');
    expect(html).toContain('href="/tags/c%23/"');
    expect(html).toContain('data-filter-tags="[&quot;functional analysis&quot;,&quot;c#&quot;]"');
  });

  it('omits updates equal to the publication date and uses the latest distinct update', () => {
    const post = makePost({
      slug: 'updates', title: 'Updates', date: new Date('2026-01-02'),
      updated: [new Date('2026-01-02')],
    });
    expect(Effect.runSync(renderPostPage(site, post, [post]))).not.toContain('<details');

    post.updated = [new Date('2026-03-01'), new Date('2026-02-01'), new Date('2026-03-01')];
    const html = Effect.runSync(renderPostPage(site, post, [post]));
    expect(html).toContain('<summary class="cursor-pointer">Updated <time dateTime="2026-03-01T00:00:00.000Z">March 1, 2026</time></summary>');
    expect(html.match(/<li class="text-sm text-ctp-text">/g)).toHaveLength(2);
    expect(html).toContain('<details');
  });

  it('respects the system theme without forcing a dark class', () => {
    const html = Effect.runSync(renderHomePage(site));
    expect(html).toContain('<html lang="en">');
    expect(html).not.toContain('class="dark"');
    expect(html).not.toContain('* { color-scheme:');
  });

  it('chooses page motion before loading the stylesheet to prevent full entrance flashes', () => {
    const html = Effect.runSync(renderHomePage(site));
    const bootstrap = html.indexOf('<script src="/assets/js/page-motion.js"></script>');
    expect(bootstrap).toBeGreaterThan(-1);
    expect(bootstrap).toBeLessThan(html.indexOf('<link rel="stylesheet"'));
  });
});
