function fuzzyMatch(query, text) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (q[qi] === t[ti]) qi++;
  }
  return qi === q.length;
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('tag-search-input');
  if (!searchInput) return;

  const tagCards = document.querySelectorAll('[data-tag-name]');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    tagCards.forEach(card => {
      const tagName = card.getAttribute('data-tag-name');
      const match = query === '' || fuzzyMatch(query, tagName);
      card.classList.toggle('hidden', !match);
    });
  });
});
