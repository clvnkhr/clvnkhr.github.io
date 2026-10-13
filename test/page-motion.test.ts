import { describe, expect, it } from 'bun:test';
import { getPageMotion } from '../src/utils/page-motion';

describe('Page motion', () => {
  const href = 'https://example.com/blog/';
  const now = 100_000;
  const pending = JSON.stringify({ href, timestamp: now - 1_000 });

  it('uses full entrances on first opens and new tabs without a link handoff', () => {
    expect(getPageMotion('navigate', href, null, now)).toBe('full');
  });

  it('uses light motion for a recent internal link to the current URL', () => {
    expect(getPageMotion('navigate', href, pending, now)).toBe('light');
  });

  it('always restores full entrances on refresh, even with a pending handoff', () => {
    expect(getPageMotion('reload', href, pending, now)).toBe('full');
  });

  it('keeps history navigation light without requiring a handoff', () => {
    expect(getPageMotion('back_forward', href, null, now)).toBe('light');
  });

  it('ignores handoffs for another destination or query', () => {
    expect(getPageMotion('navigate', `${href}post/`, pending, now)).toBe('full');
    expect(getPageMotion('navigate', `${href}?q=typst`, pending, now)).toBe('full');
  });

  it('ignores stale or future handoffs from interrupted navigations', () => {
    expect(getPageMotion('navigate', href, pending, now + 30_000)).toBe('full');
    expect(getPageMotion('navigate', href, pending, now - 2_000)).toBe('full');
  });

  it('defaults to full motion for invalid data or an unknown navigation type', () => {
    for (const value of ['{', 'null', '[]', 'true', JSON.stringify({ href, timestamp: 'yesterday' })]) {
      expect(getPageMotion('navigate', href, value, now)).toBe('full');
    }
    expect(getPageMotion(undefined, href, pending, now)).toBe('full');
  });
});
