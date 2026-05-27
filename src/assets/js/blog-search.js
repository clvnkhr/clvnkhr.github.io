// Mirror of src/utils/blog-search.ts — keep in sync
function matchScore(query, text) {
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

function computePostScore(query, title, blurb, tags, date = '') {
  const titleScore = matchScore(query, title);
  const tagsScore = matchScore(query, tags);
  const blurbScore = matchScore(query, blurb);
  const dateScore = matchScore(query, date);
  return {
    matched: titleScore.matched || tagsScore.matched || blurbScore.matched || dateScore.matched,
    score: titleScore.score * 4 + tagsScore.score * 2 + blurbScore.score + dateScore.score,
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('blog-search-input');
  if (!searchInput) return;

  const container = document.querySelector('[data-blog-list]');
  if (!container) return;

  let originalOrder = null;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    const cards = container.querySelectorAll('[data-search-title]');

    if (query === '') {
      cards.forEach(c => c.classList.remove('hidden'));
      if (originalOrder) {
        originalOrder.forEach(c => container.appendChild(c));
        originalOrder = null;
      }
      return;
    }

    if (!originalOrder) {
      originalOrder = Array.from(cards);
    }

    const scored = Array.from(cards).map(card => {
      const title = card.getAttribute('data-search-title') || '';
      const blurb = card.getAttribute('data-search-blurb') || '';
      const tags = card.getAttribute('data-search-tags') || '';
      const date = card.getAttribute('data-search-date') || '';
      return { card, ...computePostScore(query, title, blurb, tags, date) };
    });

    scored.sort((a, b) => {
      if (a.matched !== b.matched) return a.matched ? -1 : 1;
      return b.score - a.score;
    });

    scored.forEach(({ card, matched }) => {
      card.classList.toggle('hidden', !matched);
      container.appendChild(card);
    });
  });
});
