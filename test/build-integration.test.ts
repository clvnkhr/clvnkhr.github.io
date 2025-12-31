import { describe, it, expect, beforeAll } from 'bun:test';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { buildBlog } from '../src/build/index';
import { parseMetadata } from '../src/build/posts';

describe('Build Integration', () => {
  const distDir = 'dist';

  beforeAll(async () => {
    // Run the full build
    await buildBlog();
  });

  it('should create dist directory', async () => {
    const distStat = await stat(distDir);
    expect(distStat.isDirectory()).toBe(true);
  });

  it('should create homepage', async () => {
    const indexPath = join(distDir, 'index.html');
    const indexStat = await stat(indexPath);
    expect(indexStat.isFile()).toBe(true);
  });

  it('should create blog index', async () => {
    const blogPath = join(distDir, 'blog', 'index.html');
    const blogStat = await stat(blogPath);
    expect(blogStat.isFile()).toBe(true);
  });

  it('should create post directory structure', async () => {
    const postDir = join(distDir, 'blog', '2025', '01', '15');
    const postStat = await stat(postDir);
    expect(postStat.isDirectory()).toBe(true);
  });

  it('should create individual post page', async () => {
    const postPath = join(distDir, 'blog', '2025', '01', '15', 'my-first-post', 'index.html');
    const postStat = await stat(postPath);
    expect(postStat.isFile()).toBe(true);
  });

  it('should generate valid HTML with DOCTYPE', async () => {
    const indexPath = join(distDir, 'index.html');
    const content = await Bun.file(indexPath).text();
    expect(content).toContain('<!DOCTYPE html>');
    expect(content).toContain('<html');
    expect(content).toContain('</html>');
  });

  it('should include Catppuccin CSS in homepage', async () => {
    const indexPath = join(distDir, 'index.html');
    const content = await Bun.file(indexPath).text();
    expect(content).toContain('ctp-');
  });

  it('should include post title in blog index', async () => {
    const blogPath = join(distDir, 'blog', 'index.html');
    const content = await Bun.file(blogPath).text();
    expect(content).toContain('My First Typst Post');
  });

  it('should include post date in blog index', async () => {
    const blogPath = join(distDir, 'blog', 'index.html');
    const content = await Bun.file(blogPath).text();
    const today = new Date().toLocaleDateString();
    expect(content).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });

  it('should include tags in blog index', async () => {
    const blogPath = join(distDir, 'blog', 'index.html');
    const content = await Bun.file(blogPath).text();
    expect(content).toContain('#tutorial');
    expect(content).toContain('#typst');
    expect(content).toContain('#test');
  });

  it('should render full post page with content', async () => {
    const postPath = join(distDir, 'blog', '2025', '01', '15', 'my-first-post', 'index.html');
    const content = await Bun.file(postPath).text();
    expect(content).toContain('My First Typst Post');
    expect(content).toContain('This is a sample blog post');
  });

  it('should include math rendering in post page', async () => {
    const postPath = join(distDir, 'blog', '2025', '01', '15', 'my-first-post', 'index.html');
    const content = await Bun.file(postPath).text();
    expect(content).toMatch(/x\^2/);
    expect(content).toMatch(/integral.*sqrt/i);
  });
});
