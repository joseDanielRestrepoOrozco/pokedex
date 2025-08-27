/**
 * Componente para renderizar la barra de navegación
 */

import { TypeService } from '../services/TypeService.js';

export class Navbar {
  /**
   * Crea y retorna el elemento de la barra de navegación
   * @returns {HTMLElement} Elemento nav de la barra de navegación
   */
  static create() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    
    nav.innerHTML = `
      <div class="navbar-center">
        <form class="search-form" autocomplete="off">
          <img data-src="/src/assets/PokeTitulo.png" 
               src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" 
               alt="Pokédex" 
               class="logo" />
          <input type="text" 
                 class="search-input" 
                 placeholder="Buscar Pokémon..." 
                 name="pokemon" 
                 aria-label="Buscar Pokémon" />
          <div class="type-buttons" role="group" aria-label="Filtros por tipo">
            <!-- Los botones se cargarán dinámicamente -->
          </div>
          <button type="submit" class="search-btn">
            ${this.createPokeBallIcon()}
            Buscar
          </button>
        </form>
      </div>
    `;
    
    // Cargar tipos dinámicamente después de crear el elemento
    this.loadTypesAsync(nav);
    
    return nav;
  }

  /**
   * Carga los tipos de forma asíncrona y actualiza la navbar
   * @param {HTMLElement} nav - Elemento de navegación
   */
  static async loadTypesAsync(nav) {
    try {
      const types = await TypeService.getAllTypesWithDetails();
      const typeButtonsContainer = nav.querySelector('.type-buttons');
      
      if (typeButtonsContainer) {
        typeButtonsContainer.innerHTML = this.createTypeButtonsFromData(types);
        try {
          const btns = typeButtonsContainer.querySelectorAll('.type-btn');
          btns.forEach(b => {
            const e = b.querySelector('.type-emoji');
            const t = b.dataset.type;
            if (e) {
              const text = (e.textContent || '').trim();
              if (!text || text.toLowerCase() === 'undefined' || text.toLowerCase() === 'null') {
                e.textContent = TypeService.getTypeEmoji(t) || '❓';
              }
            }
          })
        } catch (err) {}
      }
    } catch (error) {
      console.error('Error loading types:', error);
      // Fallback a tipos estáticos
      const typeButtonsContainer = nav.querySelector('.type-buttons');
      if (typeButtonsContainer) {
        typeButtonsContainer.innerHTML = this.createFallbackTypeButtons();
      }
    }
  }

  /**
   * Crea botones de tipos desde datos de la API
   * @param {Array} types - Array de tipos con detalles
   * @returns {string} HTML de los botones de tipos
   */
  static createTypeButtonsFromData(types) {
    return types.map(type => {
      const name = type?.name || type?.type || 'unknown';
      const displayName = type?.displayName || type?.label || (typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : 'Tipo');
      let sprite = type?.sprite || null;
      if (sprite === 'undefined' || sprite === undefined) sprite = null;
      // usar siempre el emoji canónico de TypeService, salvo que type.emoji sea un string válido
      let emoji = TypeService.getTypeEmoji(name) || '❓';
      const providedEmoji = type?.emoji;
      if (typeof providedEmoji === 'string' && providedEmoji.trim() && providedEmoji.trim().toLowerCase() !== 'undefined') {
        emoji = providedEmoji.trim();
      }
      if (typeof emoji !== 'string') emoji = String(emoji || '❓');
      const icon = sprite ? `<img src="${sprite}" alt="${name}" class="type-icon" />` : `<span class="type-emoji">${emoji}</span>`;
      return `
        <button type="button" 
                class="type-btn ${name}" 
                data-type="${name}" 
                title="${displayName}"
                style="--type-color: ${type?.color}">
          ${icon} ${displayName}
          <svg class="voltage-svg" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path id="spark-path-1" d="M10 5 L15 15 L12 20 L18 30 L15 35 L20 45 L17 50 L25 65 L22 70 L30 80"/>
              <path id="spark-path-2" d="M110 5 L105 15 L108 20 L102 30 L105 35 L100 45 L103 50 L95 65 L98 70 L90 80"/>
            </defs>
            <use href="#spark-path-1" class="spark-line-1"/>
            <use href="#spark-path-2" class="spark-line-2"/>
          </svg>
          <div class="voltage-dots">
            <div class="voltage-dot dot-1"></div>
            <div class="voltage-dot dot-2"></div>
            <div class="voltage-dot dot-3"></div>
            <div class="voltage-dot dot-4"></div>
            <div class="voltage-dot dot-5"></div>
          </div>
        </button>
      `;
    }).join('');
  }

  /**
   * Crea botones de tipos de fallback
   * @returns {string} HTML de los botones de tipos básicos
   */
  static createFallbackTypeButtons() {
    const types = [
      { type: 'all', emoji: '🧢', label: 'All', title: 'Todos los tipos' },
      { type: 'fire', emoji: '🔥', label: 'Fire', title: 'Fuego' },
      { type: 'water', emoji: '💧', label: 'Water', title: 'Agua' },
      { type: 'grass', emoji: '🌿', label: 'Grass', title: 'Planta' },
      { type: 'electric', emoji: '⚡', label: 'Electric', title: 'Eléctrico' },
      { type: 'psychic', emoji: '🔮', label: 'Psychic', title: 'Psíquico' }
    ];

    return types.map(({ type, emoji, label, title }) => 
      `<button type="button" class="type-btn ${type}" data-type="${type}" title="${title}">
        ${emoji} ${label}
        <svg class="voltage-svg" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="spark-path-1" d="M10 5 L15 15 L12 20 L18 30 L15 35 L20 45 L17 50 L25 65 L22 70 L30 80"/>
            <path id="spark-path-2" d="M110 5 L105 15 L108 20 L102 30 L105 35 L100 45 L103 50 L95 65 L98 70 L90 80"/>
          </defs>
          <use href="#spark-path-1" class="spark-line-1"/>
          <use href="#spark-path-2" class="spark-line-2"/>
        </svg>
        <div class="voltage-dots">
          <div class="voltage-dot dot-1"></div>
          <div class="voltage-dot dot-2"></div>
          <div class="voltage-dot dot-3"></div>
          <div class="voltage-dot dot-4"></div>
          <div class="voltage-dot dot-5"></div>
        </div>
      </button>`
    ).join('');
  }

  /**
   * Crea el ícono de Pokéball para el botón de búsqueda
   * @returns {string} SVG de la Pokéball
   */
  static createPokeBallIcon() {
    return `
      <svg viewBox="0 0 100 100" width="18" height="18" aria-hidden="true">
        <circle cx="50" cy="50" r="45" fill="#ffffff" />
        <path d="M5,50 a45,45 0 0,0 90,0" fill="#ff5e62" />
        <circle cx="50" cy="50" r="14" fill="#222" />
        <circle cx="50" cy="50" r="8" fill="#fff" />
      </svg>
    `;
  }

  /**
   * Actualiza los botones de tipos después de que se haya renderizado la navbar
   * @param {HTMLElement} nav - Elemento de navegación
   */
  static async updateTypes(nav) {
    await this.loadTypesAsync(nav);
  }
}
