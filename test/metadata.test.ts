import { describe, it, expect } from 'bun:test';
import { Effect } from "effect";
import { parseMetadata } from '../src/build/posts.js';
import { extractTitleFromTypst } from '../src/utils/post.js';

describe('Metadata Parser', () => {
  it('should parse all metadata fields from Typst comments', () => {
    const typstContent = `// title: My First Post
// date: 2025-01-15
// updated: 2025-01-16
// tags: tech, tutorial
// splash: /assets/img/post-splash.png
// splash_caption: Caption text
// draft: false
// hidden: false

= My First Post

Content here...`;

    const metadata = Effect.runSync(parseMetadata(typstContent));

    expect(metadata.date).toEqual(new Date('2025-01-15'));
    expect(metadata.updated).toEqual([new Date('2025-01-16')]);
    expect(metadata.tags).toEqual(['tech', 'tutorial']);
    expect(metadata.splash).toBe('/assets/img/post-splash.png');
    expect(metadata.splash_caption).toBe('Caption text');
    expect(metadata.draft).toBe(false);
    expect(metadata.hidden).toBe(false);
  });

  it('should parse minimal metadata', () => {
    const typstContent = `// title: Simple Post
// date: 2025-01-15

= Simple Post

Content...`;

    const metadata = Effect.runSync(parseMetadata(typstContent));

    expect(metadata.date).toEqual(new Date('2025-01-15'));
    expect(metadata.updated).toBeUndefined();
    expect(metadata.tags).toBeUndefined();
    expect(metadata.splash).toBeUndefined();
    expect(metadata.draft).toBeUndefined();
  });

  it('should parse tags as array', () => {
    const typstContent = `// title: Post with tags
// date: 2025-01-15
// tags: tech, tutorial, typst

= Post`;

    const metadata = Effect.runSync(parseMetadata(typstContent));

    expect(metadata.tags).toEqual(['tech', 'tutorial', 'typst']);
  });

  it('should parse boolean draft field', () => {
    const trueContent = `// title: Draft Post
// date: 2025-01-15
// draft: true

= Draft`;

    const falseContent = `// title: Published Post
// date: 2025-01-15
// draft: false

= Published`;

    expect(Effect.runSync(parseMetadata(trueContent)).draft).toBe(true);
    expect(Effect.runSync(parseMetadata(falseContent)).draft).toBe(false);
  });

  it('should parse boolean hidden field', () => {
    const trueContent = `// title: Hidden Post
// date: 2025-01-15
// hidden: true

= Hidden`;

    const falseContent = `// title: Visible Post
// date: 2025-01-15
// hidden: false

= Visible`;

    expect(Effect.runSync(parseMetadata(trueContent)).hidden).toBe(true);
    expect(Effect.runSync(parseMetadata(falseContent)).hidden).toBe(false);
  });

  it('should handle empty value gracefully', () => {
    const typstContent = `// title: Test Post
// date: 2025-01-15
// tags:

= Test`;

    const metadata = Effect.runSync(parseMetadata(typstContent));

    expect(metadata.tags).toEqual([""]);
  });

  it('should ignore non-comment lines', () => {
    const typstContent = `// title: Test Post
// date: 2025-01-15

= Test Post

This is not a comment
= Another Heading`;

    const metadata = Effect.runSync(parseMetadata(typstContent));

    expect(metadata.date).toEqual(new Date('2025-01-15'));
  });

  it('should fail on missing date', () => {
    const content = `// title: No Date Post

= No Date`;

    expect(() => Effect.runSync(parseMetadata(content))).toThrow('Missing required date field');
  });

  it('should extract title from Typst heading', () => {
    const content = `// date: 2025-01-15

= My First Post

Some content.`;

    expect(extractTitleFromTypst(content)).toBe('My First Post');
  });

  it('should return null when no heading exists', () => {
    const content = `// date: 2025-01-15

Some content without a heading.`;

    expect(extractTitleFromTypst(content)).toBeNull();
  });
});
