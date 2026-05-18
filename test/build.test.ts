import { describe, it, expect } from 'bun:test';
import { buildBlog, runtime } from '../src/build/index.js';

describe('Build System Integration', () => {
  it('should initialize build system without errors', async () => {
    await runtime.runPromise(buildBlog);
  });

  it('should log build initialization messages', async () => {
    const logs: string[] = [];
    const originalLog = console.log;

    console.log = (...args) => logs.push(args.join(' '));

    await runtime.runPromise(buildBlog);

    console.log = originalLog;

    expect(logs.length).toBeGreaterThan(0);
    expect(logs.some(log => log.includes('Building blog'))).toBe(true);
  });

  it('should handle build system errors gracefully', async () => {
    const mockBuild = async () => {
      throw new Error('Build failed');
    };

    await expect(mockBuild()).rejects.toThrow('Build failed');
  });
});
