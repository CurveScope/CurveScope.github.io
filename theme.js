(() => {
  const storageKey = 'fieldwork-color-theme';
  const choices = new Set(['light', 'dark', 'black']);
  let selected = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let hasExplicitChoice = false;
  try {
    const saved = localStorage.getItem(storageKey);
    if (choices.has(saved)) { selected = saved; hasExplicitChoice = true; }
  } catch { /* The demo still works when browser storage is unavailable. */ }

  function apply(theme) {
    if (!choices.has(theme)) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
    const schemeMeta = document.querySelector('meta[name="color-scheme"]');
    if (schemeMeta) schemeMeta.content = theme === 'light' ? 'light' : 'dark';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === 'black' ? '#050505' : theme === 'dark' ? '#0c1714' : '#f7f4ed';
    document.querySelectorAll('.theme-control select').forEach(select => { select.value = theme; });
  }

  apply(selected);

  function mount() {
    const page = document.documentElement.dataset.app;
    const targets = {
      gallery: '.topbar',
      leave: '.top-actions',
      readiness: '.top-right',
      clinic: '.header-inner'
    };
    const target = document.querySelector(targets[page]);
    if (!target) return;

    const control = document.createElement('label');
    control.className = 'theme-control';
    control.innerHTML = '<span class="theme-symbol" aria-hidden="true">◐</span><span class="theme-label">Theme</span><select aria-label="Color theme"><option value="light">Light</option><option value="dark">Dark</option><option value="black">Black</option></select>';
    if (page === 'leave' || page === 'readiness') target.prepend(control);
    else target.append(control);
    control.querySelector('select').value = selected;
    control.querySelector('select').addEventListener('change', event => {
      const theme = event.target.value;
      hasExplicitChoice = true;
      apply(theme);
      try { localStorage.setItem(storageKey, theme); } catch { /* Visual choice remains active in this tab. */ }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();

  window.addEventListener('storage', event => {
    if (event.key === storageKey && choices.has(event.newValue)) { hasExplicitChoice = true; apply(event.newValue); }
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!hasExplicitChoice) apply(event.matches ? 'dark' : 'light');
  });
})();
