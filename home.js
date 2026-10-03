(() => {
  const search = document.getElementById('search');
  const cards = [...document.querySelectorAll('.guide-card')];
  const ignoredWords = new Set(['hvordan', 'montere', 'monterer', 'montering', 'legge', 'legger', 'bygge', 'bygger', 'jeg', 'man', 'skal', 'kan', 'a', 'en', 'et', 'det', 'pa', 'av']);
  const normalize = text => text.toLocaleLowerCase('nb').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ø/g, 'o').replace(/æ/g, 'ae').trim();
  function filter() {
    const query = normalize(search.value);
    const words = query.split(/\s+/).filter(word => word && !ignoredWords.has(word));
    const shown = cards.filter(card => {
      const haystack = normalize(card.dataset.search + ' ' + card.dataset.name);
      const matches = words.every(word => haystack.includes(word));
      card.hidden = !matches;
      return matches;
    });
    const available = shown.filter(card => card.classList.contains('available'));
    document.getElementById('empty').hidden = shown.length > 0;
    document.getElementById('result-count').textContent = `${shown.length} ${shown.length === 1 ? 'jobb' : 'jobber'} · ${available.length} ${available.length === 1 ? 'demovisning' : 'demovisninger'}`;
    document.getElementById('guides-title').textContent = query ? 'Søkeresultater' : 'Velg en jobb';
    return { shown, available };
  }
  search.addEventListener('input', filter);
  document.getElementById('search-form').addEventListener('submit', event => {
    event.preventDefault();
    const { shown, available } = filter();
    if (shown.length === 1 && available.length === 1) window.location.assign(available[0].getAttribute('href'));
    else if (available.length) available[0].focus();
  });
  document.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
    search.value = button.dataset.query; filter(); search.focus();
  }));
  document.getElementById('clear-search').addEventListener('click', () => { search.value = ''; filter(); search.focus(); });
  filter();
})();
