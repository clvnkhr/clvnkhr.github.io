import { describe, it, expect } from 'bun:test';

describe('Metadata Parser', () => {
  it('should parse all metadata fields from Typst comments', () => {
    const typstContent = `// title: My First Post
// date: 2025-01-15
// updated: 2025-01-16
// tags: tech, tutorial
// splash: /assets/img/post-splash.png
// splash_caption: Caption text
// draft: false

= My First Post

Content here...`;

    const metadata = parseMetadata(typstContent);

    expect(metadata.title).toBe('My First Post');
    expect(metadata.date).toEqual(new Date('2025-01-15'));
    expect(metadata.updated).toEqual(new Date('2025-01-16'));
    expect(metadata.tags).toEqual(['tech', 'tutorial']);
    expect(metadata.splash).toBe('/assets/img/post-splash.png');
    expect(metadata.splash_caption).toBe('Caption text');
    expect(metadata.draft).toBe(false);
  });

  it('should parse minimal metadata', () => {
    const typstContent = `// title: Simple Post
// date: 2025-01-15

= Simple Post

Content...`;

    const metadata = parseMetadata(typstContent);

    expect(metadata.title).toBe('Simple Post');
    expect(metadata.date).toEqual(new Date('2025-01-15'));
    expect(metadata.updated).toBeUndefined();
    expect(metadata.tags).toBeUndefined();
    expect(metadata.splash).toBeUndefined();
    expect(metadata.splash_caption).toBeUndefined();
    expect(metadata.draft).toBeUndefined();
  });

  it('should parse tags as array', () => {
    const typstContent = `// title: Post with tags
// date: 2025-01-15
// tags: tech, tutorial, typst

= Post`;

    const metadata = parseMetadata(typstContent);

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

    expect(parseMetadata(trueContent).draft).toBe(true);
    expect(parseMetadata(falseContent).draft).toBe(false);
  });

  it('should handle empty value gracefully', () => {
    const typstContent = `// title: Test Post
// date: 2025-01-15
// tags:

= Test`;

    const metadata = parseMetadata(typstContent);

    expect(metadata.tags).toBeUndefined();
  });

  it('should ignore non-comment lines', () => {
    const typstContent = `// title: Test Post
// date: 2025-01-15

= Test Post

This is not a comment
= Another Heading`;

    const metadata = parseMetadata(typstContent);

    expect(metadata.title).toBe('Test Post');
    expect(metadata.date).toEqual(new Date('2025-01-15'));
  });
});

function parseMetadata(content: string): Record<string, any> {
  const metadata: Record<string, any> = {};
  const commentBlock = content.match(/^\/\/.*$/gm);

  commentBlock?.forEach((line) => {
    const [key, value] = line.replace('// ', '').split(':');
    if (key && value) {
      if (key === 'tags') {
        metadata[key] = value.split(',').map((t: string) => t.trim());
      } else if (key === 'date' || key === 'updated') {
        metadata[key] = new Date(value.trim());
      } else if (key === 'draft') {
        metadata[key] = value.trim() === 'true';
      } else {
        metadata[key] = value.trim();
      }
    }
  });

  return metadata;
}
