export interface MatchResult {
  matched: boolean;
  score: number;
}

export function matchScore(query: string, text: string): MatchResult {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (q[qi] === t[ti]) qi++;
  }
  if (qi !== q.length) return { matched: false, score: 0 };

  if (t.includes(q)) {
    const closeness = 1 - t.indexOf(q) / t.length;
    return { matched: true, score: 1 + closeness };
  }

  qi = 0;
  let score = 0;
  let consec = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (q[qi] === t[ti]) {
      const positionPenalty = ti / t.length;
      consec++;
      const consecBonus = consec > 1 ? 0.1 * (consec - 1) : 0;
      score += (1 - positionPenalty) + consecBonus;
      qi++;
    } else {
      consec = 0;
    }
  }
  score = score / q.length;

  return { matched: true, score };
}

export interface PostScore {
  matched: boolean;
  score: number;
}

export function computePostScore(query: string, title: string, blurb: string, tags: string): PostScore {
  const titleScore = matchScore(query, title);
  const tagsScore = matchScore(query, tags);
  const blurbScore = matchScore(query, blurb);
  return {
    matched: titleScore.matched || tagsScore.matched || blurbScore.matched,
    score: titleScore.score * 4 + tagsScore.score * 2 + blurbScore.score,
  };
}
