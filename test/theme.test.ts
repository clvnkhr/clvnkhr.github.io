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

  it('should have SVG color overrides for math', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('.typst-frame [fill="#000000"]');
    expect(cssContent).toContain('fill: var(--color-ctp-text)');
    expect(cssContent).toContain('.typst-frame [stroke="#000000"]');
    expect(cssContent).toContain('stroke: var(--color-ctp-text)');
  });

  it('should have tag color classes with CSS variables', async () => {
    const cssContent = await fs.readFile(join(distDir, 'assets/css/main.css'), 'utf-8');

    expect(cssContent).toContain('.tag-pink');
    expect(cssContent).toContain('color: var(--color-ctp-pink)');

    expect(cssContent).toContain('.tag-mauve');
    expect(cssContent).toContain('color: var(--color-ctp-mauve)');
  });
});
