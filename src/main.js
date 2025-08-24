import './style.css'

// UI-only helpers: welcome overlay and simple filter demo (no API calls)
window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('welcome-overlay');
  const closeBtn = document.getElementById('welcome-close');
  const allBtn = document.querySelector('.type-btn.all');
  const typeBtns = document.querySelectorAll('.type-btn');

  // Helper: swap data-src -> src for deferred images
  function loadDeferredImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      try {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      } catch {
        // ignore assign errors
      }
    });
  }

  // mark body to hide deferred content until user dismisses welcome
  document.body.classList.add('welcome-open');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => {
      // remove overlay and reveal content before loading images
      overlay.remove();
      document.body.classList.remove('welcome-open');
      loadDeferredImages();
    });
  }

  // Clicking 'All' shows all cards (removes hidden-by-filter)
  if (allBtn) {
    allBtn.addEventListener('click', () => {
      // if static cards haven't been injected yet, insert them from the template
      const grid = document.querySelector('.card-grid');
      const tpl = document.getElementById('static-cards');
      if (grid && tpl && grid.children.length === 0) {
        grid.appendChild(tpl.content.cloneNode(true));
      }

      document.querySelectorAll('.pokemon-card.hidden-by-filter').forEach(el => el.classList.remove('hidden-by-filter'));
      // visual active state
      typeBtns.forEach(b => b.classList.remove('is-active'));
      allBtn.classList.add('is-active');
      // ensure images are loaded when user asks to view all
      loadDeferredImages();
    });
  }

  // For demo: other type buttons mark active and hide others (UI-only)
  typeBtns.forEach(btn => {
    if (!btn.classList.contains('all')) {
      btn.addEventListener('click', () => {
        const t = btn.dataset.type;
        document.querySelectorAll('.pokemon-card').forEach(card => {
          if (!card.classList.contains(t)) card.classList.add('hidden-by-filter');
          else card.classList.remove('hidden-by-filter');
        });
        typeBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      });
    }
  });

  // (helper declared above)
});
