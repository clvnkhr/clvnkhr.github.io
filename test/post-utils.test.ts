import { describe, it, expect } from 'bun:test';
import { getPostBlurb, extractTitleFromHtml, stripFirstHeading, getRelatedPosts } from '../src/utils/post.js';
import type { Post } from '../src/types/post.js';

describe('Post Utils', () => {
  describe('getPostBlurb', () => {
    it('should extract first N words from HTML content', () => {
      const html = '<p>This is a sample blog post with some words in it for testing purposes</p>';
      expect(getPostBlurb(html, 5)).toBe('This is a sample blog...');
    });

    it('should strip HTML tags and return plain text', () => {
      const html = '<p>Hello <strong>world</strong> this is <em>great</em></p>';
      expect(getPostBlurb(html, 10)).toBe('Hello world this is great');
    });

    it('should not add ellipsis when content is shorter than word count', () => {
      const html = '<p>Short content</p>';
      expect(getPostBlurb(html, 25)).toBe('Short content');
    });

    it('should handle empty HTML', () => {
      expect(getPostBlurb('')).toBe('');
    });

    it('should handle HTML with no text content', () => {
      expect(getPostBlurb('<div></div>')).toBe('');
    });

    it('should handle HTML with only tags and whitespace', () => {
      expect(getPostBlurb('<p>   </p>')).toBe('');
    });

    it('should default to 25 words', () => {
      const words = Array.from({ length: 30 }, (_, i) => `word${i}`).join(' ');
      const html = `<p>${words}</p>`;
      const blurb = getPostBlurb(html);
      const blurbWords = blurb.replace('...', '').split(' ');
      expect(blurbWords).toHaveLength(25);
      expect(blurb).toMatch(/\.\.\.$/);
    });
  });

  describe('extractTitleFromHtml', () => {
    it('should extract title from h1 tag', () => {
      const html = '<div><h1>My Post Title</h1><p>Content</p></div>';
      expect(extractTitleFromHtml(html)).toBe('My Post Title');
    });

    it('should extract title with inline tags stripped', () => {
      const html = '<h1>My <em>Post</em> Title</h1>';
      expect(extractTitleFromHtml(html)).toBe('My Post Title');
    });

    it('should return null when no h1 exists', () => {
      expect(extractTitleFromHtml('<div><h2>Not a title</h2></div>')).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(extractTitleFromHtml('')).toBeNull();
    });

    it('should trim whitespace from title', () => {
      const html = '<h1>  Spaced Title  </h1>';
      expect(extractTitleFromHtml(html)).toBe('Spaced Title');
    });

    it('should handle h1 with attributes', () => {
      const html = '<h1 class="title" id="main">Hello World</h1>';
      expect(extractTitleFromHtml(html)).toBe('Hello World');
    });
  });

  describe('stripFirstHeading', () => {
    it('should remove the first h1 tag and its content', () => {
      const html = '<div><h1>Title</h1><p>Content</p></div>';
      expect(stripFirstHeading(html)).toBe('<div><p>Content</p></div>');
    });

    it('should handle multiple h1 tags (removes only first)', () => {
      const html = '<h1>First</h1><p>Content</p><h1>Second</h1>';
      expect(stripFirstHeading(html)).toBe('<p>Content</p><h1>Second</h1>');
    });

    it('should return original string when no h1 exists', () => {
      const html = '<p>No heading here</p>';
      expect(stripFirstHeading(html)).toBe(html);
    });

    it('should handle h1 with attributes', () => {
      const html = '<h1 class="title">My Title</h1><p>Content</p>';
      expect(stripFirstHeading(html)).toBe('<p>Content</p>');
    });

    it('should handle empty string', () => {
      expect(stripFirstHeading('')).toBe('');
    });
  });

  describe('getRelatedPosts', () => {
    const baseDate = new Date('2025-01-15');

    function makePost(slug: string, tags: string[], date: Date = baseDate): Post {
      return {
        slug,
        title: `Post ${slug}`,
        date,
        tags,
        path: `/blog/${slug}/`,
        htmlContent: `<h1>Post ${slug}</h1>`,
      };
    }

    it('should return posts sharing at least one tag', () => {
      const current = makePost('current', ['tech', 'math']);
      const allPosts = [
        current,
        makePost('related1', ['tech']),
        makePost('related2', ['math']),
        makePost('unrelated', ['cooking']),
      ];

      const related = getRelatedPosts(current, allPosts, 10);
      expect(related).toHaveLength(2);
      expect(related.map(p => p.slug)).toEqual(
        expect.arrayContaining(['related1', 'related2']),
      );
    });

    it('should sort by score descending (more shared tags first)', () => {
      const current = makePost('current', ['tech', 'math', 'science']);
      const allPosts = [
        current,
        makePost('high', ['tech', 'math', 'science'], new Date('2025-01-10')),
        makePost('low', ['tech'], new Date('2025-01-05')),
      ];

      const related = getRelatedPosts(current, allPosts, 2);
      expect(related[0].slug).toBe('high');
      expect(related[1].slug).toBe('low');
    });

    it('should break ties by date descending (newer first)', () => {
      const current = makePost('current', ['tech', 'math']);
      const allPosts = [
        current,
        makePost('older', ['tech'], new Date('2024-01-01')),
        makePost('newer', ['tech'], new Date('2025-01-01')),
      ];

      const related = getRelatedPosts(current, allPosts, 2);
      expect(related[0].slug).toBe('newer');
      expect(related[1].slug).toBe('older');
    });

    it('should exclude the current post from results', () => {
      const current = makePost('current', ['tech']);
      const allPosts = [current, makePost('other', ['tech'])];

      const related = getRelatedPosts(current, allPosts, 10);
      expect(related).toHaveLength(1);
      expect(related[0].slug).toBe('other');
    });

    it('should return empty array when current post has no tags', () => {
      const current = makePost('current', []);
      const allPosts = [current, makePost('other', ['tech'])];

      expect(getRelatedPosts(current, allPosts)).toEqual([]);
    });

    it('should return empty array when current post has undefined tags', () => {
      const current = { ...makePost('current', []), tags: undefined };
      const allPosts = [current, makePost('other', ['tech'])];

      expect(getRelatedPosts(current, allPosts)).toEqual([]);
    });

    it('should respect maxResults parameter', () => {
      const current = makePost('current', ['tech']);
      const allPosts = [
        current,
        makePost('a', ['tech']),
        makePost('b', ['tech']),
        makePost('c', ['tech']),
      ];

      expect(getRelatedPosts(current, allPosts, 2)).toHaveLength(2);
      expect(getRelatedPosts(current, allPosts, 1)).toHaveLength(1);
      expect(getRelatedPosts(current, allPosts, 0)).toHaveLength(0);
    });

    it('should skip posts with no tags', () => {
      const current = makePost('current', ['tech']);
      const allPosts = [
        current,
        makePost('tagged', ['tech']),
        { ...makePost('untagged', []), tags: undefined },
      ];

      expect(getRelatedPosts(current, allPosts)).toHaveLength(1);
    });

    it('should default maxResults to 3', () => {
      const current = makePost('current', ['tech']);
      const allPosts = [
        current,
        ...Array.from({ length: 5 }, (_, i) => makePost(`p${i}`, ['tech'])),
      ];

      expect(getRelatedPosts(current, allPosts)).toHaveLength(3);
    });
  });
});
