/**
 * Componente para crear y manejar las cartas de Pokémon
 */

import { capitalize, escapeHtml } from './Utils.js';

export class PokemonCard {
  /**
   * Crea una carta de Pokémon
   * @param {Object} pokemonData               <div class="title" style="width:100%; display:flex; flex-direction:column; align-items:center; margin-bottom:3px;">
                <p class="title" style="font-size:1.2em; font-weight:bold; color:var(--color-golden-yellow); margin:0;">
                  <strong>${capitalize(name)}</strong>
                </p>
                <span class="card-footer" style="font-size:1em; color:var(--pk-muted); margin-top:2px;">
                  #${String(id).padStart(3,'0')}
                </span>
              </div>
              <div class="types-section" style="width:100%; display:flex; justify-content:center; margin-bottom:8px;">`el Pokémon desde la API
   * @returns {HTMLElement} Elemento de la carta
   */
  static async create(pokemonData) {
    try {
      const id = pokemonData.id;
      const name = pokemonData.name;
      const types = (pokemonData.types || []).map(t => t.type.name);
      const artwork = pokemonData.sprites?.other?.['official-artwork']?.front_default || 
                     pokemonData.sprites?.front_default || '';

      const article = document.createElement('article');
  article.className = `pokemon-card ${types.join(' ')}`;
  // Exponer el id en el DOM para evitar duplicados y facilitar búsquedas
  if (typeof id !== 'undefined') article.setAttribute('data-pokemon-id', String(id));
      article.setAttribute('role', 'listitem');

      // Asegurar que tengamos una imagen para mostrar
      const imgSrc = artwork || (pokemonData.sprites?.front_default) || '';
      const safeDataSrc = imgSrc || '';
      const placeholder = this.createPlaceholderImage();

      // Construir markup de estadísticas
      const statsHtml = this.buildStatsHtml(pokemonData.stats || []);

      // Obtener sprites de tipos con fallback
      let typesHtml = '';
      try {
        typesHtml = await this.buildTypesHtml(types);
      } catch (error) {
        console.warn('Error building types HTML, using fallback:', error);
        typesHtml = this.buildFallbackTypesHtml(types);
      }

      article.innerHTML = this.getCardTemplate(name, id, safeDataSrc, placeholder, statsHtml, typesHtml);

      // Agregar manejadores de eventos
      this.addEventListeners(article);

      return article;
    } catch (error) {
      console.error('Error creating Pokemon card:', error);
      // Crear una carta básica como fallback
      return this.createFallbackCard(pokemonData);
    }
  }

  /**
   * Crea una imagen placeholder SVG
   * @returns {string} Data URL del SVG placeholder
   */
  static createPlaceholderImage() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="100%" height="100%" fill="#f3f3f3"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="18">No image</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }

  /**
   * Construye el HTML de los tipos con sprites
   * @param {Array} types - Array de nombres de tipos
   * @returns {string} HTML de los tipos con sprites
   */
  static async buildTypesHtml(types) {
    // Evitar múltiples fetch a la API de tipos (que no siempre incluye sprites útiles).
    // Intentamos usar una URL generada por TypeService si está disponible.
    const typesHtml = [];
    // Importar TypeService dinámicamente para evitar ciclo de dependencias en la carga
    let TypeService = null;
    try {
      TypeService = (await import('../services/TypeService.js')).TypeService;
    } catch (e) {
      // Si falla, TypeService seguirá siendo null y usaremos emoji fallback
    }

    for (const typeName of types) {
      try {
        let sprite = null;
        if (TypeService) {
          // Intentar obtener sprite conocido a partir del servicio (cache o URL pública)
          const cached = TypeService.typeCache.get(typeName);
          if (cached && cached.sprite) sprite = cached.sprite;
          else sprite = TypeService.getTypeSpriteUrl(typeName);
        }

        if (sprite) {
          typesHtml.push(`
            <div class="pokemon-type" data-type="${typeName}">
              <img src="${sprite}" alt="${typeName}" class="type-sprite" />
              <span class="type-name">${capitalize(typeName)}</span>
            </div>
          `);
        } else {
          const emoji = this.getTypeEmoji(typeName) || '\u2753';
          typesHtml.push(`
            <div class="pokemon-type" data-type="${typeName}">
              <span class="type-emoji">${emoji}</span>
              <span class="type-name">${capitalize(typeName)}</span>
            </div>
          `);
        }
      } catch (err) {
        const emoji = this.getTypeEmoji(typeName) || '\u2753';
        typesHtml.push(`
          <div class="pokemon-type" data-type="${typeName}">
            <span class="type-emoji">${emoji}</span>
            <span class="type-name">${capitalize(typeName)}</span>
          </div>
        `);
      }
    }

    return typesHtml.join('');
  }

  /**
   * Obtiene emoji para un tipo como fallback
   * @param {string} type - Nombre del tipo
   * @returns {string} Emoji correspondiente
   */
  static getTypeEmoji(type) {
    const emojiMap = {
      'normal': '⚪',
      'fire': '🔥',
      'water': '💧',
      'electric': '⚡',
      'grass': '🌿',
      'ice': '❄️',
      'fighting': '👊',
      'poison': '☠️',
      'ground': '🌍',
      'flying': '🦅',
      'psychic': '🔮',
      'bug': '🐛',
      'rock': '🪨',
      'ghost': '👻',
      'dragon': '🐉',
      'dark': '🌑',
      'steel': '⚙️',
      'fairy': '🧚',
      'all': '🧢'
    };
    if (!type || typeof type !== 'string') return '❓';
    return emojiMap[type.toLowerCase()] || '❓';
  }

  /**
   * Construye el HTML de las estadísticas
   * @param {Array} stats - Array de estadísticas del Pokémon
   * @returns {string} HTML de las estadísticas
   */
  static buildStatsHtml(stats) {
    return stats.map(s => {
      const key = s.stat?.name || 'stat';
      const val = s.base_stat || 0;
      // Normalizar a 200 para el ancho de la barra
      const pct = Math.min(100, Math.round((val / 150) * 100));
      return `
        <div class="stat-row">
          <span class="stat-name">${escapeHtml(key)}</span>
          <span class="stat-val">${val}</span>
          <div class="stat-bar">
            <div class="stat-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
    }).join('');
  }

  /**
   * Obtiene el template HTML de la carta
   * @param {string} name - Nombre del Pokémon
   * @param {number} id - ID del Pokémon
   * @param {string} safeDataSrc - URL de la imagen
   * @param {string} placeholder - Imagen placeholder
   * @param {string} statsHtml - HTML de las estadísticas
   * @param {string} typesHtml - HTML de los tipos con sprites
   * @returns {string} Template HTML completo
   */
  static getCardTemplate(name, id, safeDataSrc, placeholder, statsHtml, typesHtml) {
    return `
      <div class="card">
        <div class="content">
          <div class="back">
            <div class="img">
              <div class="circle"></div>
              <div class="circle" id="right"></div>
              <div class="circle" id="bottom"></div>
        <img class="pokemon-img" 
          data-src="${safeDataSrc}" 
          src="${safeDataSrc ? 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' : placeholder}" 
          alt="${name}" 
          loading="lazy" />
            </div>
            <div class="back-content">
              <div class="description">
                <div class="title" style="width:100%; display:flex; flex-direction:column; align-items:center; margin-bottom:10px;">
                  <p class="pokemon-name" style="font-size:1.2em; font-weight:bold; color:var(--color-golden-yellow); margin:0;">
                    <strong>${capitalize(name)}</strong>
                  </p>
                  <span class="card-footer" style="font-size:1em; color:var(--pk-muted); margin-top:5px;">
                    #${String(id).padStart(3,'0')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="front">
            <div class="front-content">
              <!-- TÍTULO AGREGADO AQUÍ - MISMO FORMATO QUE EL BACK -->
              <div class="title" style="width:100%; display:flex; flex-direction:column; align-items:center; margin-bottom:10px;">
                <p class="pokemon-name" style="font-size:1.2em; font-weight:bold; color:var(--color-golden-yellow); margin:0;">
                  <strong>${capitalize(name)}</strong>
                </p>
                <span class="card-footer" style="font-size:1em; color:var(--pk-muted); margin-top:5px;">
                  #${String(id).padStart(3,'0')}
                </span>
              </div>
              <!-- FIN DEL TÍTULO -->
              
              <div class="types-section" style="width:100%; display:flex; justify-content:center; margin-bottom:15px;">
                <div class="pokemon-types" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
                  ${typesHtml}
                </div>
              </div>
              <div class="stats-header">
                <svg class="stats-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#B3A125">
                  <path d="M3 13H5V18H3V13ZM7 9H9V18H7V9ZM11 5H13V18H11V5ZM15 8H17V18H15V8ZM19 11H21V18H19V11Z"/>
                </svg>
                <h3 class="stats-title">Estadísticas</h3>
              </div>
              <div class="stats">${statsHtml}</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  /**
   * Agrega event listeners a la carta
   * @param {HTMLElement} article - Elemento de la carta
   */
  static addEventListeners(article) {
    try {
      const cardEl = article.querySelector('.card');
      if (cardEl) {
        // Click para voltear la carta
        cardEl.addEventListener('click', () => {
          cardEl.classList.toggle('is-flipped');
        });

        // Soporte para teclado
        cardEl.addEventListener('keydown', (evt) => {
          if (evt.key === 'Enter' || evt.key === ' ') {
            evt.preventDefault();
            cardEl.classList.toggle('is-flipped');
          }
        });

        // Hacer que sea focusable
        cardEl.setAttribute('tabindex', '0');
      }
      // Lazy-load de imagen usando IntersectionObserver para mejorar rendimiento
      try {
        const img = article.querySelector('.pokemon-img')
        if (img) {
          const loadImage = () => {
            const dataSrc = img.getAttribute('data-src')
            if (dataSrc) img.src = dataSrc
            img.removeAttribute('data-src')
          }

          if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  loadImage()
                  observer.disconnect()
                }
              })
            }, { rootMargin: '200px' })
            io.observe(img)
          } else {
            // Fallback inmediato
            loadImage()
          }
        }
      } catch (e) {
        // noop
      }
    } catch (error) {
      console.warn('Error adding event listeners to card:', error);
    }
  }

  /**
   * Construye HTML de tipos con emojis como fallback
   * @param {Array} types - Array de nombres de tipos
   * @returns {string} HTML de los tipos con emojis
   */
  static buildFallbackTypesHtml(types) {
    return types.map(typeName => {
      let emoji = this.getTypeEmoji(typeName);
      if (!emoji || emoji === 'undefined') emoji = '❓';
      return `
        <div class="pokemon-type" data-type="${typeName}">
          <span class="type-emoji">${emoji}</span>
          <span class="type-name">${capitalize(typeName)}</span>
        </div>
      `;
    }).join('');
  }

  /**
   * Crea una carta básica como fallback
   * @param {Object} pokemonData - Datos del Pokémon
   * @returns {HTMLElement} Elemento de carta básica
   */
  static createFallbackCard(pokemonData) {
    const article = document.createElement('article');
    article.className = 'pokemon-card';
  // Añadir id si está disponible para consistencia
  const name = pokemonData?.name || 'Unknown';
  const id = pokemonData?.id || 0;
  article.setAttribute('data-pokemon-id', String(id));
    article.innerHTML = `
      <div class="card">
        <div class="content">
          <div class="front">
            <div class="front-content">
              <h3>${capitalize(name)}</h3>
              <p>#${String(id).padStart(3,'0')}</p>
              <p>Error cargando detalles</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return article;
  }
}