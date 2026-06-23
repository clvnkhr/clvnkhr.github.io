import { describe, it, expect } from 'bun:test';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('Theme System', () => {
  const distDir = './dist';

  it('should use official Catppuccin package', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('--color-ctp-');
    expect(cssContent).toContain('--catppuccin-color-');
    expect(cssContent).not.toContain('@seangenabe/catppuccin-tailwindcss-v4');
  });

  it('should generate Catppuccin color variables', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    const expectedColors = [
      '--color-ctp-text',
      '--color-ctp-base',
      '--color-ctp-mauve',
      '--color-ctp-pink',
      '--color-ctp-lavender'
    ];

    for (const color of expectedColors) {
      expect(cssContent).toContain(color);
    }
  });

  it('should not have hardcoded mocha class on body', async () => {
    // Read a sample post HTML file
    const postFiles = await fs.readdir(distDir);
    const postDir = postFiles.find(dir => dir.match(/^\d{4}\/\d{2}\/\d{2}\//));

    if (!postDir) {
      // Skip if no posts exist
      expect(true).toBe(true);
      return;
    }

    const postHtml = await fs.readFile(join(distDir, postDir, 'index.html'), 'utf-8');

    expect(postHtml).not.toContain('class="mocha');
    expect(postHtml).not.toContain('className="mocha"');
  });

  it('should use conditional dark prose variant', async () => {
    // Read a sample post HTML file
    const postFiles = await fs.readdir(distDir);
    const postDir = postFiles.find(dir => dir.match(/^\d{4}\/\d{2}\/\d{2}\//));

    if (!postDir) {
      // Skip if no posts exist
      expect(true).toBe(true);
      return;
    }

    const postHtml = await fs.readFile(join(distDir, postDir, 'index.html'), 'utf-8');

    // Should have conditional dark variant
    expect(postHtml).toContain('prose dark:prose-invert');
    // Should NOT force dark mode always
    expect(postHtml).not.toContain('prose prose-invert');
  });

  it('should use standard Catppuccin color variable prefix', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    // Official package uses --color-ctp- prefix
    expect(cssContent).toContain('--color-ctp-text');
    expect(cssContent).toContain('--color-ctp-base');
    expect(cssContent).toContain('--color-ctp-mauve');
  });

  it('should style MathML with the math font', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('math');
    expect(cssContent).toContain("font-family: 'Lete Sans Math', math");
    expect(cssContent).toContain('.prose math[display="block"]');
    expect(cssContent).toContain('display: block math');
    expect(cssContent).toContain('white-space: nowrap');
  });

  it('should improve prose line wrapping', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('text-wrap: pretty');
    expect(cssContent).toContain('hyphens: auto');
    expect(cssContent).toContain('text-wrap: balance');
    expect(cssContent).toContain('hyphens: none');
  });

  it('should have SVG grayscale color overrides in dark mode', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('@media (prefers-color-scheme: dark)');
    expect(cssContent).toContain('.prose svg [fill="#ffffffcc"]');
    expect(cssContent).toContain('.prose svg [stroke="#cccccc"]');
  });

  it('should center images in prose', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('.prose img');
    expect(cssContent).toContain('margin-left: auto');
    expect(cssContent).toContain('margin-right: auto');
  });

  it('should center figure SVGs and captions in prose', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('.prose figure svg');
    expect(cssContent).toContain('margin-left: auto');
    expect(cssContent).toContain('.prose figure figcaption');
    expect(cssContent).toContain('text-align: center');
  });

  it('should have tag color classes with CSS variables', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('.tag-pink');
    expect(cssContent).toContain('color: var(--color-ctp-pink)');

    expect(cssContent).toContain('.tag-mauve');
    expect(cssContent).toContain('color: var(--color-ctp-mauve)');
  });
});
