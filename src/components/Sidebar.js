/**
 * Componente para el sidebar con búsqueda y filtros
 */

import { TypeService } from '../services/TypeService.js';
import { PokemonService } from '../services/PokemonService.js';

export class Sidebar {
  /**
   * Crea y retorna el elemento del sidebar
   * @returns {HTMLElement} Elemento aside del sidebar
   */
  static create() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    
    sidebar.innerHTML = `
      <div class="sidebar-header">
        <h3>🔍 Buscar & Filtrar</h3>
      </div>
      
      <div class="sidebar-content">
        <!-- Botón aleatorio al principio -->
        <div class="quick-actions">
          <button type="button" id="random-btn" class="search-btn" aria-label="Pokémon aleatorio">🎲 Aleatorio</button>
        </div>

        <!-- Sección de búsqueda -->
        <div class="search-section">
          <h4>Buscar Pokémon</h4>
          <form class="search-form" autocomplete="off">
            <div class="search-input-container">
              <input type="text" 
                     class="search-input" 
                     placeholder="Escribe el nombre del Pokémon..." 
                     name="pokemon" 
                     aria-label="Buscar Pokémon" />
              <button type="submit" class="search-btn">
                ${this.createSearchIcon()}
              </button>
            </div>
          </form>
        </div>

        <!-- Sección de filtros por tipo -->
        <div class="filter-section">
          <h4>Filtrar por Tipo</h4>
          <div class="type-buttons" role="group" aria-label="Filtros por tipo">
            <div class="loading-types">🔄 Cargando tipos...</div>
          </div>
        </div>
      </div>
    `;
    
    // Cargar tipos dinámicamente
    this.loadTypesAsync(sidebar);
    
    // Añadir listener para botón aleatorio
    setTimeout(() => {
      const rb = sidebar.querySelector('#random-btn');
      if (rb) {
        rb.addEventListener('click', async () => {
          await PokemonService.fetchRandom();
        });
      }
    }, 80);

    return sidebar;
  }

  /**
   * Carga los tipos de forma asíncrona y actualiza el sidebar
   * @param {HTMLElement} sidebar - Elemento del sidebar
   */
  static async loadTypesAsync(sidebar) {
    try {
      const types = await TypeService.getAllTypesWithDetails();
      const typeButtonsContainer = sidebar.querySelector('.type-buttons');
      
      if (typeButtonsContainer) {
        typeButtonsContainer.innerHTML = this.createTypeButtonsFromData(types);
        // Notificar que los tipos ya se cargaron para que otros componentes enlacen handlers
        const evt = new CustomEvent('typesLoaded');
        document.dispatchEvent(evt);
      }
    } catch (error) {
      console.error('Error loading types:', error);
      const typeButtonsContainer = sidebar.querySelector('.type-buttons');
      if (typeButtonsContainer) {
        typeButtonsContainer.innerHTML = this.createFallbackTypeButtons();
        const evt = new CustomEvent('typesLoaded');
        document.dispatchEvent(evt);
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
      
      // Solo el botón "All" tiene texto
      const showText = type.name === 'all';
      
      return `
        <button type="button" 
                class="type-btn ${type.name} ${showText ? 'with-text' : 'icon-only'}" 
                data-type="${type.name}" 
                title="${type.displayName}"
                style="--type-color: ${type.color}">
          <span class="type-icon-wrapper">${icon}</span>
          ${showText ? `<span class="type-label">${type.displayName}</span>` : ''}
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
      { type: 'all', emoji: '🧢', label: 'Todos', title: 'Todos los tipos', color: '#6C7B7F' },
      { type: 'fire', emoji: '🔥', label: 'Fuego', title: 'Fuego', color: '#F08030' },
      { type: 'water', emoji: '💧', label: 'Agua', title: 'Agua', color: '#6890F0' },
      { type: 'grass', emoji: '🌿', label: 'Planta', title: 'Planta', color: '#78C850' },
      { type: 'electric', emoji: '⚡', label: 'Eléctrico', title: 'Eléctrico', color: '#F8D030' },
      { type: 'psychic', emoji: '🔮', label: 'Psíquico', title: 'Psíquico', color: '#F85888' },
      { type: 'ice', emoji: '❄️', label: 'Hielo', title: 'Hielo', color: '#98D8D8' },
      { type: 'dragon', emoji: '🐉', label: 'Dragón', title: 'Dragón', color: '#7038F8' },
      { type: 'dark', emoji: '🌑', label: 'Siniestro', title: 'Siniestro', color: '#705848' },
      { type: 'fairy', emoji: '🧚', label: 'Hada', title: 'Hada', color: '#EE99AC' }
    ];

    return types.map(({ type, emoji, title, color }) => {
      // Solo el botón "all" tiene texto
      const showText = type === 'all';
      const label = type === 'all' ? 'Todos' : '';
      
      return `<button type="button" 
               class="type-btn ${type} ${showText ? 'with-text' : 'icon-only'}" 
               data-type="${type}" 
               title="${title}"
               style="--type-color: ${color}">
        <span class="type-icon-wrapper">${emoji}</span>
        ${showText ? `<span class="type-label">${label}</span>` : ''}
      </button>`;
    }).join('');
  }

  /**
   * Crea el ícono de búsqueda
   * @returns {string} SVG del ícono de búsqueda
   */
  static createSearchIcon() {
    return `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    `;
  }
}
