import { fuzzyMatch } from '../../utils/fuzzy-match';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('tag-search-input');
  if (!searchInput) return;

  const tagCards = Array.from(document.querySelectorAll('[data-tag-name]'));
  const status = document.querySelector('[data-tag-search-status]');
  const emptyState = document.querySelector('[data-tag-search-empty]');

  searchInput.addEventListener('input', () => {
    tagCards[0]?.parentElement.classList.add('is-filtering');
    applyFilters();
  });
  applyFilters();

  function applyFilters() {
    const query = searchInput.value.trim();
    let visibleCount = 0;
    tagCards.forEach(card => {
      card.hidden = !fuzzyMatch(query, card.dataset.tagName || '');
      if (!card.hidden) visibleCount++;
    });
    if (status) status.textContent = `${visibleCount} of ${tagCards.length} tags shown`;
    if (emptyState) emptyState.hidden = visibleCount > 0;
  }
});
