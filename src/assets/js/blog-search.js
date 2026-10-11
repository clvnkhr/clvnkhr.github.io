import { computePostScore } from '../../utils/blog-search';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('blog-search-input');
  const container = document.querySelector('[data-blog-list]');
  if (!searchInput || !container) return;

  const storageKey = 'blog.hiddenTags';
  const tagToggles = Array.from(document.querySelectorAll('[data-blog-tag-toggle]'));
  const resetButton = document.querySelector('[data-blog-tag-reset]');
  const hideAllButton = document.querySelector('[data-blog-tag-hide-all]');
  const status = document.querySelector('[data-blog-search-status]');
  const emptyState = document.querySelector('[data-blog-search-empty]');
  const entries = Array.from(container.querySelectorAll('[data-search-title]'), card => ({
    card,
    title: card.dataset.searchTitle || '',
    blurb: card.dataset.searchBlurb || '',
    tags: card.dataset.searchTags || '',
    date: card.dataset.searchDate || '',
    filterTags: JSON.parse(card.dataset.filterTags || '[]'),
  }));
  // Tag pages have no toggles and must show all posts with their chosen tag.
  let hiddenTags = tagToggles.length > 0 ? loadHiddenTags() : new Set();
  let initialized = false;

  tagToggles.forEach(toggle => {
    toggle.checked = !hiddenTags.has(toggle.value);
    toggle.addEventListener('change', () => {
      if (toggle.checked) hiddenTags.delete(toggle.value);
      else hiddenTags.add(toggle.value);
      saveHiddenTags();
      applyFilters();
    });
  });

  resetButton?.addEventListener('click', () => {
    hiddenTags.clear();
    tagToggles.forEach(toggle => { toggle.checked = true; });
    saveHiddenTags();
    applyFilters();
  });

  hideAllButton?.addEventListener('click', () => {
    hiddenTags = new Set(tagToggles.map(toggle => toggle.value));
    tagToggles.forEach(toggle => { toggle.checked = false; });
    saveHiddenTags();
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

  function saveHiddenTags() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(hiddenTags).sort()));
    } catch {
      // Filtering remains available when browser storage is blocked.
    }
  }

  function applyFilters() {
    if (initialized) container.classList.add('is-filtering');
    initialized = true;
    const query = searchInput.value.trim();
    const results = entries.map(entry => ({
      ...entry,
      ...(query
        ? computePostScore(query, entry.title, entry.blurb, entry.tags, entry.date)
        : { matched: true, score: 0 }),
    }));
    if (query) results.sort((a, b) => b.score - a.score);

    let visibleCount = 0;
    results.forEach(({ card, filterTags, matched }) => {
      card.hidden = !matched || filterTags.some(tag => hiddenTags.has(tag));
      if (!card.hidden) visibleCount++;
    });

    // Preserve nodes and keyboard focus when filtering doesn't change the order.
    const currentOrder = Array.from(container.children);
    if (results.some(({ card }, index) => card !== currentOrder[index])) {
      container.append(...results.map(({ card }) => card));
    }
    if (status) status.textContent = `${visibleCount} of ${entries.length} posts shown`;
    if (emptyState) emptyState.hidden = visibleCount > 0;
  }
});
