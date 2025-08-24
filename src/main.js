import './style.css'
import {
  getPokemon,
  getPokemonsByType,
} from './data/api.js'

// Small UX limits
const ALL_LIMIT = 151 // número máximo a pedir en 'Ver todos' (puedes ajustar)

/** Helper: swap data-src -> src for deferred images */
function loadDeferredImages() {
  document.querySelectorAll('img[data-src]').forEach(img => {
    try {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    } catch {
      // ignore assignment errors
    }
  });
}

/** Render helpers */
function createPokemonCard(pokemonData) {
  // pokemonData expected as full API response from getPokemon
  const id = pokemonData.id;
  const name = pokemonData.name;
  const types = (pokemonData.types || []).map(t => t.type.name);
  const artwork = pokemonData.sprites?.other?.['official-artwork']?.front_default || pokemonData.sprites?.front_default || '';

  const article = document.createElement('article');
  article.className = `pokemon-card ${types.join(' ')}`;
  article.setAttribute('role', 'listitem');

  // Ensure we have an image to show (fallback to sprites.front_default or a tiny SVG)
  const imgSrc = artwork || (pokemonData.sprites?.front_default) || '';
  const safeDataSrc = imgSrc || '';
  const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="18">No image</text></svg>`);

  // Build stats markup
  const statsHtml = (pokemonData.stats || []).map(s => {
    const key = s.stat?.name || 'stat';
    const val = s.base_stat || 0;
    // normalize to 200 for bar width
    const pct = Math.min(100, Math.round((val / 150) * 100));
    return `<div class="stat-row"><span class="stat-name">${escapeHtml(key)}</span><span class="stat-val">${val}</span><div class="stat-bar"><div class="stat-fill" style="width:${pct}%"></div></div></div>`;
  }).join('');

  article.innerHTML = `
    <div class="card">
      <div class="content">
        <div class="back">
          <div class="img">
            <div class="circle"></div>
            <div class="circle" id="right"></div>
            <div class="circle" id="bottom"></div>
            <img class="pokemon-img" data-src="${safeDataSrc}" src="${safeDataSrc ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' : placeholder}" alt="${name}" />
          </div>
          <div class="back-content">
            <div class="description">
              <div class="title" style="width:100%; display:flex; flex-direction:column; align-items:center; margin-bottom:10px;">
                <p class="title" style="font-size:1.2em; font-weight:bold; color:var(--color-golden-yellow); margin:0;"><strong>${capitalize(name)}</strong></p>
                <span class="card-footer" style="font-size:1em; color:var(--pk-muted); margin-top:5px;">#${String(id).padStart(3,'0')}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="front">
          <div class="front-content">
            <div class="title" style="width:100%; display:flex; flex-direction:column; align-items:center; margin-bottom:10px;">
              <p class="title" style="font-size:1.2em; font-weight:bold; color:var(--color-golden-yellow); margin:0;"><strong>${capitalize(name)}</strong></p>
              <span class="card-footer" style="font-size:1em; color:var(--pk-muted); margin-top:5px;">#${String(id).padStart(3,'0')}</span>
            </div>
            <div class="stats-header">
              <svg class="stats-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#B3A125">
                <path d="M3 13H5V18H3V13ZM7 9H9V18H7V9ZM11 5H13V18H11V5ZM15 8H17V18H15V8ZM19 11H21V18H19V11Z"/>
              </svg>
              <h3 class="stats-title"> Estatistic </h3>
            </div>
            <div class="stats">${statsHtml}</div>
          </div>
        </div>
      </div>
    </div>`

  // add click handler to flip the card and reveal stats
  try {
    const cardEl = article.querySelector('.card');
    if (cardEl) {
      cardEl.addEventListener('click', () => {
        cardEl.classList.toggle('is-flipped');
      });
      // allow keyboard toggle
      cardEl.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          cardEl.classList.toggle('is-flipped');
        }
      });
      // make it focusable
      cardEl.setAttribute('tabindex', '0');
    }
  } catch {
    // ignore
  }

  return article
}

function capitalize(s) { return String(s).charAt(0).toUpperCase() + String(s).slice(1) }

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function fetchAndRenderByName(name) {
  const grid = document.querySelector('.card-grid');
  if (!grid) return;
  
  // Hide welcome banner when loading cards
  const welcomeBanner = document.getElementById('welcome-banner');
  if (welcomeBanner) {
    welcomeBanner.classList.add('hidden');
  }
  document.body.classList.remove('welcome-open');
  
  grid.innerHTML = '';
  const data = await getPokemon(name.toLowerCase().trim());
  if (data?.error) {
    return;
  }
  const card = createPokemonCard(data);
  grid.appendChild(card);
  // si el overlay ya se cerró, cargar imágenes
  if (!document.body.classList.contains('welcome-open')) loadDeferredImages();
}

async function fetchAndRenderAll(limit = ALL_LIMIT) {
  const grid = document.querySelector('.card-grid');
  if (!grid) return;
  
  // Hide welcome banner when loading cards
  const welcomeBanner = document.getElementById('welcome-banner');
  if (welcomeBanner) {
    welcomeBanner.classList.add('hidden');
  }
  document.body.classList.remove('welcome-open');
  
  grid.innerHTML = '';
  const BASE = import.meta.env.VITE_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';
  try {
    const listRes = await fetch(`${BASE}/pokemon?limit=${limit}`);
    if (!listRes.ok) throw new Error(`List request failed ${listRes.status}`);
    const list = await listRes.json();
    // fetch details in parallel but render as they arrive
    const promises = list.results.map(async (item) => {
      try {
        const data = await getPokemon(item.name);
        if (!data || data.error) {
          return null;
        }
        // fallback if artwork missing
        if (!data.sprites?.other?.['official-artwork']?.front_default && !data.sprites?.front_default) {
          // missing artwork but continue
        }
        const card = createPokemonCard(data);
        grid.appendChild(card);
        // always attempt to resolve data-src -> src for newly appended cards
        loadDeferredImages();
      } catch {
        return null;
      }
    });
    await Promise.all(promises);
  } catch {
    // silent fail
  }
}

async function fetchAndRenderByType(type) {
  const grid = document.querySelector('.card-grid');
  if (!grid) return;
  
  // Hide welcome banner when loading cards
  const welcomeBanner = document.getElementById('welcome-banner');
  if (welcomeBanner) {
    welcomeBanner.classList.add('hidden');
  }
  document.body.classList.remove('welcome-open');
  
  grid.innerHTML = '';
  try {
    const names = await getPokemonsByType(type);
    if (names.error) {
      return;
    }
    // limitar para no saturar; puedes ajustar
    const limited = names.slice(0, 60);
    const promises = limited.map(async (n) => {
      try {
        const data = await getPokemon(n);
        if (!data || data.error) {
          return null;
        }
        const card = createPokemonCard(data);
        document.querySelector('.card-grid').appendChild(card);
        loadDeferredImages();
      } catch {
        return null;
      }
    });
    await Promise.all(promises);
  } catch {
    // silent fail
  }
}

// wire UI
window.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('welcome-close');
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.querySelector('.search-input');
  const typeBtns = document.querySelectorAll('.type-btn');

  // banner is non-blocking: show but don't prevent images from loading
  document.body.classList.add('welcome-open');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const banner = document.getElementById('welcome-banner') || document.getElementById('welcome-overlay');
      if (banner) banner.remove();
      document.body.classList.remove('welcome-open');
    });
  }

  // Search by name
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) return;
      fetchAndRenderByName(q);
    });
  }

  // Type buttons
  typeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const t = btn.dataset.type;
      // visual
      typeBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      if (t === 'all') {
        // show all
        await fetchAndRenderAll();
      } else if (t === 'fav') {
        // funcionalidad no implementada
      } else {
        await fetchAndRenderByType(t);
      }
    });
  });

  // Logo click to go back to home
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      // Clear grid
      const grid = document.querySelector('.card-grid');
      if (grid) grid.innerHTML = '';
      
      // Show welcome banner
      document.body.classList.add('welcome-open');
      const welcomeBanner = document.getElementById('welcome-banner');
      if (welcomeBanner) {
        welcomeBanner.classList.remove('hidden');
      }
      
      // Clear search input
      if (searchInput) searchInput.value = '';
      
      // Reset type buttons
      typeBtns.forEach(b => b.classList.remove('is-active'));
    });
    
    // Make logo look clickable
    logo.style.cursor = 'pointer';
  }

  // On load, images should load even while the banner is visible
  // load any deferred images (logo, template placeholders)
  loadDeferredImages();
});
