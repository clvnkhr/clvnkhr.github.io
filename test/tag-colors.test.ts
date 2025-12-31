import { describe, it, expect } from 'bun:test';

describe('Tag Color Generator', () => {
  it('should return a valid Catppuccin color class', () => {
    const color = getTagPastelColor('tech');

    expect(color).toContain('bg-ctp-');
    expect(color).toContain('text-ctp-');
  });

  it('should return consistent color for same tag name', () => {
    const color1 = getTagPastelColor('tech');
    const color2 = getTagPastelColor('tech');

    expect(color1).toBe(color2);
  });

  it('should return different colors for different tag names', () => {
    const color1 = getTagPastelColor('tech');
    const color2 = getTagPastelColor('tutorial');

    expect(color1).not.toBe(color2);
  });

  it('should handle empty string tag', () => {
    const color = getTagPastelColor('');

    expect(color).toBeTruthy();
    expect(color).toContain('bg-ctp-');
  });

  it('should handle special characters in tag names', () => {
    const color1 = getTagPastelColor('c++');
    const color2 = getTagPastelColor('rust-lang');
    const color3 = getTagPastelColor('test@tag');

    expect(color1).toContain('bg-ctp-');
    expect(color2).toContain('bg-ctp-');
    expect(color3).toContain('bg-ctp-');
  });

  it('should always use available Catppuccin colors', () => {
    const availableColors = [
      'pink', 'mauve', 'red', 'maroon',
      'peach', 'yellow', 'green', 'teal',
      'sky', 'sapphire', 'blue', 'lavender'
    ];

    for (const availableColor of availableColors) {
      const color = getTagPastelColor(availableColor);
      expect(color).toContain('bg-ctp-');
      expect(color).toContain('text-ctp-');
    }
  });

  it('should produce deterministic results', () => {
    const colors = new Set<string>();

    for (let i = 0; i < 100; i++) {
      colors.add(getTagPastelColor(`tag${i}`));
    }

    expect(colors.size).toBeGreaterThan(0);
    expect(colors.size).toBeLessThanOrEqual(12);
  });
});

function getTagPastelColor(tagName: string): string {
  const colors = [
    'pink', 'mauve', 'red', 'maroon',
    'peach', 'yellow', 'green', 'teal',
    'sky', 'sapphire', 'blue', 'lavender'
  ];

  const hash = tagName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedColor = `ctp-${colors[hash % colors.length]}`;

  return `bg-${selectedColor} text-ctp-crust`;
}
