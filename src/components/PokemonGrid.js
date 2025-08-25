/**
 * Componente para manejar el grid de cartas de Pokémon
 */

import { PokemonCard } from './PokemonCard.js';
import { ImageLoader } from './ImageLoader.js';

export class PokemonGrid {
  static _items = [];       // buffer de datos completos
  static _page = 1;
  static _perPage = 8; // 2 filas x 4 columnas
  /**
   * Obtiene el elemento del grid
   * @returns {HTMLElement|null} Elemento del grid
   */
  static getGrid() {
    return document.querySelector('.card-grid');
  }

  /**
   * Limpia el contenido del grid
   */
  static clear() {
    const grid = this.getGrid();
    if (grid) {
      grid.innerHTML = '';
      // reset buffer when clearing explicitly
      this._items = [];
      this._page = 1;
    }
  }

  /**
   * Agrega una carta al grid
   * @param {Object} pokemonData - Datos del Pokémon
   */
  static async addCard(pokemonData) {
    const grid = this.getGrid();
    if (!grid || !pokemonData || pokemonData.error) return;

    const card = await PokemonCard.create(pokemonData);
    grid.appendChild(card);
    
    // Cargar imágenes diferidas para la nueva carta
    ImageLoader.loadDeferredImages();
  }

  /**
   * Agrega múltiples cartas al grid
   * @param {Array} pokemonDataArray - Array de datos de Pokémon
   */
  static async addCards(pokemonDataArray) {
    const grid = this.getGrid();
    if (!grid || !Array.isArray(pokemonDataArray)) return;

    // Append to internal buffer and render current page
    this._items = this._items.concat(pokemonDataArray.filter(d => d && !d.error));
    // When loading a new dataset, show from the first page
    await this.renderPage(1);
  }

  static async renderPage(page = 1) {
    const grid = this.getGrid();
    if (!grid) return;

    const total = this._items.length;
    const per = this._perPage;
    const totalPages = Math.max(1, Math.ceil(total / per));
    page = Math.min(Math.max(1, page), totalPages);
    this._page = page;
    
    grid.innerHTML = '';
    const start = (page - 1) * per;
    const end = start + per;
    const slice = this._items.slice(start, end);

    // Crear todas las cartas en paralelo y esperar antes de agregarlas
    const cardPromises = slice.map(pokemonData => PokemonCard.create(pokemonData));
    const cards = await Promise.all(cardPromises);
    const fragment = document.createDocumentFragment();
    for (const c of cards) fragment.appendChild(c);

    grid.appendChild(fragment);
    ImageLoader.loadDeferredImages();

    // actualizar controles de paginación
    const currentEl = document.querySelector('.current-page');
    const totalEl = document.querySelector('.total-pages');
    if (currentEl) currentEl.textContent = String(this._page);
    if (totalEl) totalEl.textContent = String(totalPages);

    // Ajustar estado de botones prev/next
    const prevBtn = document.querySelector('.pagination.card-style .prev');
    const nextBtn = document.querySelector('.pagination.card-style .next');
    if (prevBtn) prevBtn.disabled = this._page <= 1;
    if (nextBtn) nextBtn.disabled = this._page >= totalPages;
  }

  static async nextPage() { await this.renderPage(this._page + 1); }
  static async prevPage() { await this.renderPage(this._page - 1); }

  /**
   * Obtiene el número de cartas en el grid
   * @returns {number} Número de cartas
   */
  static getCardCount() {
    const grid = this.getGrid();
    return grid ? grid.children.length : 0;
  }

  /**
   * Verifica si el grid está vacío
   * @returns {boolean} True si está vacío
   */
  static isEmpty() {
    return this.getCardCount() === 0;
  }

  /**
   * Muestra un mensaje cuando no hay resultados
   * @param {string} message - Mensaje a mostrar
   */
  static showNoResults(message = 'No se encontraron resultados') {
    const grid = this.getGrid();
    if (!grid) return;

    grid.innerHTML = `
      <div class="no-results">
        <p>${message}</p>
      </div>
    `;
  }

  /**
   * Muestra un indicador de carga
   */
  static showLoading() {
    const grid = this.getGrid();
    if (!grid) return;

    grid.innerHTML = `
      <div class="loading">
        <p>Cargando Pokémon...</p>
      </div>
    `;
  }
}
