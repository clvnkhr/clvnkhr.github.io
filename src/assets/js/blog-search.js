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

  const storageKey = 'blog.hiddenTags';
  const tagToggles = Array.from(document.querySelectorAll('[data-blog-tag-toggle]'));
  const resetButton = document.querySelector('[data-blog-tag-reset]');
  const hideAllButton = document.querySelector('[data-blog-tag-hide-all]');
  const originalOrder = Array.from(container.querySelectorAll('[data-search-title]'));
  let hiddenTags = loadHiddenTags();

  tagToggles.forEach(toggle => {
    toggle.checked = !hiddenTags.has(toggle.value);
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        hiddenTags.delete(toggle.value);
      } else {
        hiddenTags.add(toggle.value);
      }
      saveHiddenTags(hiddenTags);
      applyFilters();
    });
  });

  resetButton?.addEventListener('click', () => {
    hiddenTags = new Set();
    tagToggles.forEach(toggle => {
      toggle.checked = true;
    });
    saveHiddenTags(hiddenTags);
    applyFilters();
  });

  hideAllButton?.addEventListener('click', () => {
    hiddenTags = new Set(tagToggles.map(toggle => toggle.value));
    tagToggles.forEach(toggle => {
      toggle.checked = false;
    });
    saveHiddenTags(hiddenTags);
    applyFilters();
  });

  searchInput.addEventListener('input', applyFilters);

  applyFilters();

  function loadHiddenTags() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(parsed) ? parsed.filter(tag => typeof tag === 'string') : []);
    } catch {
      return new Set();
    }
  }

  function saveHiddenTags(tags) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(tags).sort()));
    } catch {
      // Ignore storage failures so filtering still works for the current page.
    }
  }

  function isTagVisible(card) {
    const tags = (card.getAttribute('data-filter-tags') || '')
      .split(/\s+/)
      .filter(Boolean);
    return tags.every(tag => !hiddenTags.has(tag));
  }

  function restoreOriginalOrder() {
    originalOrder.forEach(card => container.appendChild(card));
  }

  function applyFilters() {
    const query = searchInput.value;
    const cards = container.querySelectorAll('[data-search-title]');

    if (query === '') {
      restoreOriginalOrder();
      cards.forEach(card => {
        card.classList.toggle('hidden', !isTagVisible(card));
      });
      return;
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
      card.classList.toggle('hidden', !matched || !isTagVisible(card));
      container.appendChild(card);
    });
  }
});
