/**
 * SVG color utilities for dark mode grayscale color inversion
 */

/**
 * Extracts all fill and stroke color values from HTML
 * @param html - HTML string containing SVG elements
 * @returns Array of unique hex color values
 */
export function extractColorsFromHtml(html: string): string[] {
  const colors = new Set<string>();

  // Match fill="#hex" and stroke="#hex" patterns
  const fillMatches = html.matchAll(/fill="#([0-9a-fA-F]{6,8})"/g);
  const strokeMatches = html.matchAll(/stroke="#([0-9a-fA-F]{6,8})"/g);

  for (const match of fillMatches) {
    colors.add(`#${match[1]}`);
  }

  for (const match of strokeMatches) {
    colors.add(`#${match[1]}`);
  }

  return Array.from(colors);
}

/**
 * Checks if a hex color is grayscale (all RGB channels are equal)
 * @param hex - Hex color string (e.g., "#000000" or "#ffffffcc")
 * @returns True if the color is grayscale
 */
export function isGrayscaleColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r === g && g === b;
}

/**
 * Inverts a grayscale color while preserving alpha channel
 * @param hex - Hex color string (e.g., "#000000" or "#ffffffcc")
 * @returns Inverted hex color string with preserved alpha
 */
export function invertGrayscaleColor(hex: string): string {
  const hasAlpha = hex.length === 9;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const alpha = hasAlpha ? hex.slice(7) : '';

  // Invert all channels (same value for grayscale)
  const inverted = 255 - r;
  const invertedHex = inverted.toString(16).padStart(2, '0');

  return `#${invertedHex}${invertedHex}${invertedHex}${alpha}`;
}

/**
 * Generates CSS rules for SVG color overrides in dark mode
 * @param colors - Array of hex color values found in SVGs
 * @returns CSS string with @media (prefers-color-scheme: dark) wrapper
 */
export function generateSvgColorCss(colors: string[]): string {
  let css = '/* SVG grayscale color overrides for dark mode */\n';
  css += '/* Generated at build time - do not edit manually */\n\n';

  css += '@media (prefers-color-scheme: dark) {\n';

  for (const color of colors) {
    // Skip #000000 - already handled in main.css with theme variable
    if (color === '#000000') {
      continue;
    }

    // Skip non-grayscale colors
    if (!isGrayscaleColor(color)) {
      continue;
    }

    const inverted = invertGrayscaleColor(color);

    css += `  .typst-frame [fill="${color}"] { fill: ${inverted}; }\n`;
    css += `  .typst-frame [stroke="${color}"] { stroke: ${inverted}; }\n`;
  }

  css += '}\n';

  return css;
}
