import { describe, it, expect } from 'bun:test';
import {
  extractColorsFromHtml,
  isGrayscaleColor,
  invertGrayscaleColor,
  generateSvgColorCss,
} from '../src/utils/svg-colors.js';

describe('SVG Color Utilities', () => {
  describe('extractColorsFromHtml', () => {
    it('should extract fill colors from SVG HTML', () => {
      const html = '<svg><rect fill="#000000"/><circle fill="#ffffffcc"/></svg>';
      const colors = extractColorsFromHtml(html);
      expect(colors).toContain('#000000');
      expect(colors).toContain('#ffffffcc');
    });

    it('should extract stroke colors from SVG HTML', () => {
      const html = '<svg><rect stroke="#cccccc"/></svg>';
      const colors = extractColorsFromHtml(html);
      expect(colors).toContain('#cccccc');
    });

    it('should return unique colors only', () => {
      const html = '<svg><rect fill="#000000"/><circle fill="#000000"/></svg>';
      const colors = extractColorsFromHtml(html);
      expect(colors).toHaveLength(1);
    });

    it('should return empty array when no colors found', () => {
      expect(extractColorsFromHtml('<div>No SVG here</div>')).toEqual([]);
    });

    it('should return empty array for empty string', () => {
      expect(extractColorsFromHtml('')).toEqual([]);
    });

    it('should extract both fill and stroke colors', () => {
      const html = '<svg><rect fill="#ff0000" stroke="#cccccc"/></svg>';
      const colors = extractColorsFromHtml(html);
      expect(colors).toContain('#ff0000');
      expect(colors).toContain('#cccccc');
    });

    it('should handle 8-digit hex colors (with alpha)', () => {
      const html = '<svg><rect fill="#00000080"/></svg>';
      const colors = extractColorsFromHtml(html);
      expect(colors).toContain('#00000080');
    });
  });

  describe('isGrayscaleColor', () => {
    it('should return true for black', () => {
      expect(isGrayscaleColor('#000000')).toBe(true);
    });

    it('should return true for white', () => {
      expect(isGrayscaleColor('#ffffff')).toBe(true);
    });

    it('should return true for gray shades', () => {
      expect(isGrayscaleColor('#cccccc')).toBe(true);
      expect(isGrayscaleColor('#808080')).toBe(true);
      expect(isGrayscaleColor('#333333')).toBe(true);
    });

    it('should return false for non-grayscale colors', () => {
      expect(isGrayscaleColor('#ff0000')).toBe(false);
      expect(isGrayscaleColor('#00ff00')).toBe(false);
      expect(isGrayscaleColor('#0000ff')).toBe(false);
      expect(isGrayscaleColor('#abc123')).toBe(false);
    });

    it('should handle colors with alpha channel', () => {
      expect(isGrayscaleColor('#000000cc')).toBe(true);
      expect(isGrayscaleColor('#ffffff80')).toBe(true);
      expect(isGrayscaleColor('#ff0000ff')).toBe(false);
    });
  });

  describe('invertGrayscaleColor', () => {
    it('should invert black to white', () => {
      expect(invertGrayscaleColor('#000000')).toBe('#ffffff');
    });

    it('should invert white to black', () => {
      expect(invertGrayscaleColor('#ffffff')).toBe('#000000');
    });

    it('should invert medium gray', () => {
      expect(invertGrayscaleColor('#808080')).toBe('#7f7f7f');
    });

    it('should preserve alpha channel', () => {
      expect(invertGrayscaleColor('#000000cc')).toBe('#ffffffcc');
      expect(invertGrayscaleColor('#ffffff80')).toBe('#00000080');
    });

    it('should handle #cccccc', () => {
      expect(invertGrayscaleColor('#cccccc')).toBe('#333333');
    });

    it('should handle #333333', () => {
      expect(invertGrayscaleColor('#333333')).toBe('#cccccc');
    });
  });

  describe('generateSvgColorCss', () => {
    it('should generate CSS wrapped in dark mode media query', () => {
      const css = generateSvgColorCss(['#cccccc']);
      expect(css).toContain('@media (prefers-color-scheme: dark)');
      expect(css).toContain('.prose svg [fill="#cccccc"]');
      expect(css).toContain('fill: #333333');
      expect(css).toContain('.prose svg [stroke="#cccccc"]');
      expect(css).toContain('stroke: #333333');
    });

    it('should skip #000000 (handled separately in main.css)', () => {
      const css = generateSvgColorCss(['#000000', '#cccccc']);
      expect(css).not.toContain('fill="#000000"');
      expect(css).toContain('.prose svg [fill="#cccccc"]');
    });

    it('should skip non-grayscale colors', () => {
      const css = generateSvgColorCss(['#ff0000']);
      expect(css).not.toContain('fill="#ff0000"');
    });

    it('should handle empty colors array', () => {
      const css = generateSvgColorCss([]);
      expect(css).toContain('@media (prefers-color-scheme: dark)');
    });

    it('should generate correct inverted colors for multiple grayscales', () => {
      const css = generateSvgColorCss(['#cccccc', '#999999']);
      expect(css).toContain('fill: #333333');
      expect(css).toContain('fill: #666666');
    });

    it('should start with a comment header', () => {
      const css = generateSvgColorCss(['#cccccc']);
      expect(css).toContain('/* SVG grayscale color overrides for dark mode */');
      expect(css).toContain('/* Generated at build time - do not edit manually */');
    });
  });
});
