import { describe, it, expect } from 'bun:test';
import { getTagColorClass } from '../src/utils/tags.js';

describe('Tag Color Generator', () => {
  const validClasses = [
    'tag-pink', 'tag-mauve', 'tag-red', 'tag-maroon',
    'tag-peach', 'tag-yellow', 'tag-green', 'tag-teal',
    'tag-sky', 'tag-sapphire', 'tag-blue', 'tag-lavender',
  ];

  it('should return a valid Catppuccin color class', () => {
    const color = getTagColorClass('tech');
    expect(validClasses).toContain(color);
  });

  it('should return consistent color for same tag name', () => {
    const color1 = getTagColorClass('tech');
    const color2 = getTagColorClass('tech');
    expect(color1).toBe(color2);
  });

  it('should return different colors for different tag names', () => {
    const color1 = getTagColorClass('tech');
    const color2 = getTagColorClass('tutorial');
    expect(color1).not.toBe(color2);
  });

  it('should handle empty string tag', () => {
    const color = getTagColorClass('');
    expect(validClasses).toContain(color);
  });

  it('should handle special characters in tag names', () => {
    expect(validClasses).toContain(getTagColorClass('c++'));
    expect(validClasses).toContain(getTagColorClass('rust-lang'));
    expect(validClasses).toContain(getTagColorClass('test@tag'));
  });

  it('should always use available Catppuccin colors', () => {
    const availableColors = [
      'pink', 'mauve', 'red', 'maroon',
      'peach', 'yellow', 'green', 'teal',
      'sky', 'sapphire', 'blue', 'lavender',
    ];

    for (const availableColor of availableColors) {
      const color = getTagColorClass(availableColor);
      expect(color).toMatch(/^tag-(pink|mauve|red|maroon|peach|yellow|green|teal|sky|sapphire|blue|lavender)$/);
    }
  });

  it('should produce deterministic results', () => {
    const colors = new Set<string>();
    for (let i = 0; i < 100; i++) {
      colors.add(getTagColorClass(`tag${i}`));
    }
    expect(colors.size).toBeGreaterThan(0);
    expect(colors.size).toBeLessThanOrEqual(12);
  });
});
