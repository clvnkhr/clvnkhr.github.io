import { describe, it, expect } from 'bun:test';
import { fuzzyMatch } from '../src/utils/fuzzy-match.js';

describe('fuzzyMatch', () => {
  it('matches when query equals text', () => {
    expect(fuzzyMatch('maths', 'maths')).toBe(true);
  });

  it('matches when query chars appear in order in text', () => {
    expect(fuzzyMatch('fn', 'functional-analysis')).toBe(true);
  });

  it('matches with repeated characters in the query', () => {
    expect(fuzzyMatch('aan', 'functional-analysis')).toBe(true);
  });

  it('rejects when query chars are not in order', () => {
    expect(fuzzyMatch('nf', 'functional-analysis')).toBe(false);
  });

  it('is case insensitive', () => {
    expect(fuzzyMatch('MATH', 'maths')).toBe(true);
    expect(fuzzyMatch('math', 'MATHS')).toBe(true);
  });

  it('matches single character query', () => {
    expect(fuzzyMatch('p', 'python')).toBe(true);
    expect(fuzzyMatch('x', 'python')).toBe(false);
  });

  it('matches empty query', () => {
    expect(fuzzyMatch('', 'anything')).toBe(true);
    expect(fuzzyMatch('', '')).toBe(true);
  });

  it('handles empty text', () => {
    expect(fuzzyMatch('a', '')).toBe(false);
    expect(fuzzyMatch('', '')).toBe(true);
  });

  it('matches hyphens and special characters correctly', () => {
    expect(fuzzyMatch('se', 'self-adjointness')).toBe(true);
    expect(fuzzyMatch('c++', 'c++')).toBe(true);
  });

  it('real tag examples behave as expected', () => {
    expect(fuzzyMatch('pro', 'projects')).toBe(true);
    expect(fuzzyMatch('prj', 'projects')).toBe(true);
    expect(fuzzyMatch('prjs', 'projects')).toBe(true);
    expect(fuzzyMatch('prjz', 'projects')).toBe(false);
    expect(fuzzyMatch('al', 'functional-analysis')).toBe(true);
    expect(fuzzyMatch('qtm', 'quantum-mechanics')).toBe(true);
    expect(fuzzyMatch('qk', 'quantum-mechanics')).toBe(false);
    expect(fuzzyMatch('tp', 'typescript')).toBe(true);
    expect(fuzzyMatch('ts', 'typescript')).toBe(true);
    expect(fuzzyMatch('tst', 'typst')).toBe(true);
  });

  it('matches from anywhere in the text, not just prefix', () => {
    expect(fuzzyMatch('lysis', 'functional-analysis')).toBe(true);
    expect(fuzzyMatch('dyn', 'fluid-dynamics')).toBe(true);
    expect(fuzzyMatch('chan', 'quantum-mechanics')).toBe(true);
  });

  it('rejects when text is shorter than query', () => {
    expect(fuzzyMatch('python', 'py')).toBe(false);
  });
});
