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
            <div class="loading-types">🔄 Cargando tipos...</div>
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
      const icon = type.sprite ? 
        `<img src="${type.sprite}" alt="${type.name}" class="type-icon" />` : 
        type.emoji;
      
      return `
        <button type="button" 
                class="type-btn ${type.name}" 
                data-type="${type.name}" 
                title="${type.displayName}"
                style="--type-color: ${type.color}">
          ${icon} ${type.displayName}
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
