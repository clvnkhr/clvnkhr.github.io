import { describe, it, expect } from 'bun:test';
import { matchScore, computePostScore } from '../src/utils/blog-search.js';

describe('matchScore', () => {
  it('returns matched=false for no match', () => {
    expect(matchScore('xyz', 'functional-analysis')).toEqual({ matched: false, score: 0 });
  });

  it('matches exact substring with high score', () => {
    const result = matchScore('analysis', 'functional-analysis');
    expect(result.matched).toBe(true);
    expect(result.score).toBeGreaterThan(1);
  });

  it('gives higher closeness score when exact match appears earlier', () => {
    const early = matchScore('func', 'functional-analysis');
    const late = matchScore('lysis', 'functional-analysis');
    expect(early.score).toBeGreaterThan(late.score);
  });

  it('matches fuzzy characters in order', () => {
    const result = matchScore('fn', 'functional-analysis');
    expect(result.matched).toBe(true);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it('gives fuzzy match score less than exact match', () => {
    const fuzzy = matchScore('fn', 'functional-analysis');
    const exact = matchScore('func', 'functional-analysis');
    expect(fuzzy.score).toBeLessThan(exact.score);
  });

  it('is case insensitive', () => {
    const upper = matchScore('MATH', 'Mathematics');
    const lower = matchScore('math', 'Mathematics');
    expect(upper).toEqual(lower);
  });

  it('scores empty query as matched', () => {
    const result = matchScore('', 'anything');
    expect(result.matched).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  it('handles empty text', () => {
    expect(matchScore('a', '')).toEqual({ matched: false, score: 0 });
    expect(matchScore('', '')).toMatchObject({ matched: true });
  });

  it('bonuses consecutive character matches', () => {
    const consec = matchScore('stem', 'quantum-mechanics system');
    const spread = matchScore('stem', 'sobolev-spaces theorem');
    expect(consec.score).toBeGreaterThan(spread.score);
  });

  it('scores single-character queries', () => {
    const yes = matchScore('t', 'typescript');
    expect(yes.matched).toBe(true);
    expect(yes.score).toBeGreaterThan(0);

    const no = matchScore('z', 'typescript');
    expect(no).toEqual({ matched: false, score: 0 });
  });

  it('matches repeated query chars correctly', () => {
    const result = matchScore('aan', 'functional-analysis');
    expect(result.matched).toBe(true);
  });

  it('scores exact prefix match higher than later exact match', () => {
    const prefix = matchScore('quantum', 'quantum-mechanics');
    const later = matchScore('mechanics', 'quantum-mechanics');
    expect(prefix.score).toBeGreaterThan(later.score);
  });

  it('returns same score regardless of case', () => {
    const a = matchScore('TYPESCRIPT', 'Typescript is great');
    const b = matchScore('typescript', 'Typescript is great');
    expect(a).toEqual(b);
  });

  it('scores short exact matches higher than long fuzzy matches', () => {
    const exact = matchScore('py', 'python');
    const fuzzy = matchScore('pythn', 'python');
    expect(exact.score).toBeGreaterThan(fuzzy.score);
  });

  it('scores exact substring match higher than fuzzy', () => {
    const exact = matchScore('typ', 'typescript');
    const fuzzy = matchScore('tsp', 'typescript');
    expect(exact.matched).toBe(true);
    expect(fuzzy.matched).toBe(true);
    expect(exact.score).toBeGreaterThan(fuzzy.score);
  });
});

describe('computePostScore', () => {
  it('matches on title alone', () => {
    const result = computePostScore('typescript', 'Getting Started with TypeScript', 'A beginner guide', 'coding');
    expect(result.matched).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  it('matches on blurb alone', () => {
    const result = computePostScore('beginner', 'Advanced Python', 'A beginner guide to Python', 'python');
    expect(result.matched).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  it('matches on tags alone', () => {
    const result = computePostScore('coding', 'Advanced Python', 'Deep dive into decorators', 'python coding');
    expect(result.matched).toBe(true);
  });

  it('matches on date alone', () => {
    const result = computePostScore(
      'June 23',
      'Advanced Python',
      'Deep dive into decorators',
      'python',
      'June 23, 2026',
    );

    expect(result.matched).toBe(true);
    expect(result.score).toBeGreaterThan(0);
  });

  it('does not match when nothing matches', () => {
    const result = computePostScore('zzzzzzz', 'Advanced Python', 'Deep dive into decorators', 'python');
    expect(result.matched).toBe(false);
    expect(result.score).toBe(0);
  });

  it('weights title higher than tags and blurb', () => {
    const titleBonus = computePostScore('python', 'Python Advanced', 'blah blah', 'java');
    const tagsBonus = computePostScore('python', 'Java Advanced', 'blah blah', 'python');
    expect(titleBonus.score).toBeGreaterThan(tagsBonus.score);
  });

  it('weights tags higher than blurb', () => {
    const tagsBonus = computePostScore('python', 'Java Advanced', 'blah blah', 'python');
    const blurbBonus = computePostScore('python', 'Java Advanced', 'python is great', 'java');
    expect(tagsBonus.score).toBeGreaterThan(blurbBonus.score);
  });

  it('combines matches across fields', () => {
    const titleOnly = computePostScore('python', 'Python Advanced', 'a b c', 'java');
    const allFields = computePostScore('python', 'Python Advanced', 'python tutorial', 'python');
    expect(allFields.score).toBeGreaterThan(titleOnly.score);
  });

  it('combines date matches with other fields', () => {
    const withoutDate = computePostScore('2026', 'Typst Notes', 'A migration note', 'blog');
    const withDate = computePostScore('2026', 'Typst Notes', 'A migration note', 'blog', 'June 23, 2026');

    expect(withDate.matched).toBe(true);
    expect(withDate.score).toBeGreaterThan(withoutDate.score);
  });

  it('handles empty strings gracefully', () => {
    const result = computePostScore('', '', '', '');
    expect(result.matched).toBe(true);
  });

  it('no match when query is absent from all fields', () => {
    const result = computePostScore('elixir', 'Rust Programming', 'Systems programming language', 'rust');
    expect(result.matched).toBe(false);
    expect(result.score).toBe(0);
  });

  it('title prefix fuzzy match scores well', () => {
    const result = computePostScore('typ', 'TypeScript for Beginners', 'Learn TS', 'coding');
    expect(result.matched).toBe(true);
    expect(result.score).toBeGreaterThan(4);
  });

  it('fuzzy match across all fields accumulates score', () => {
    const single = computePostScore('ts', 'Rust Programming', 'A systems language', 'rust');
    const multi = computePostScore('ts', 'TypeScript Guide', 'Using TS effectively', 'typescript');
    expect(multi.score).toBeGreaterThan(single.score);
  });
});
