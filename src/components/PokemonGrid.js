/**
 * Componente para manejar el grid de cartas de Pokémon
 */
  // Forzar 9 por página (3 columnas x 3 filas) por defecto
  /**
   * Componente para manejar el grid de cartas de Pokémon
   */
  import { PokemonCard } from './PokemonCard.js';
  import { ImageLoader } from './ImageLoader.js';

  export class PokemonGrid {
    static _items = []; // buffer de datos completos
    static _page = 1;
  // Forzar 6 por página (3 columnas x 2 filas) por defecto
  static _perPage = 6;
    static _rendering = false;

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
        this._rendering = false;
      }
    }

    /**
     * Agrega una carta al grid
     * @param {Object} pokemonData - Datos del Pokémon
     */
    static async addCard(pokemonData) {
      const grid = this.getGrid();
      if (!grid || !pokemonData || pokemonData.error) return;
      console.debug('[PokemonGrid.addCard] enter', { id: pokemonData?.id, buffer: this._items.length, time: Date.now() });

      // Si ya existe una carta con el mismo id, evitar crear/reemplazar de nuevo
      const potentialId = pokemonData?.id ? String(pokemonData.id) : null;
      if (potentialId) {
        const exists = grid.querySelector(`article[data-pokemon-id="${potentialId}"]`);
        if (exists) {
          // actualizar imagen diferida si aplica
          ImageLoader.loadDeferredImages();
          console.debug('[PokemonGrid.addCard] skip - already exists', { id: potentialId, time: Date.now() });
          return;
        }
      }

      const card = await PokemonCard.create(pokemonData);
      console.debug('[PokemonGrid.addCard] created card element', { id: potentialId, time: Date.now() });

      // Evitar duplicados: comprobar si ya existe una carta con el mismo id
      const existingId = card.getAttribute && card.getAttribute('data-pokemon-id');
      if (existingId) {
        const existing = grid.querySelector(`article[data-pokemon-id="${existingId}"]`);
        if (existing) {
          // Reemplazarla por la nueva (evita duplicados y actualiza contenido)
          existing.replaceWith(card);
          ImageLoader.loadDeferredImages();
          console.debug('[PokemonGrid.addCard] replaced existing card', { id: existingId, time: Date.now() });
          return;
        }
      }

      grid.appendChild(card);
      console.debug('[PokemonGrid.addCard] appended card', { id: existingId || potentialId, totalDom: grid.children.length, time: Date.now() });
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
      console.debug('[PokemonGrid.addCards] enter', { incoming: pokemonDataArray.length, time: Date.now() });

      // Reemplazar el buffer para evitar duplicados
      // Dedupe por id (si hay id disponible)
      const map = new Map();
      for (const d of pokemonDataArray) {
        if (!d || d.error) continue;
        const key = (typeof d.id !== 'undefined') ? String(d.id) : JSON.stringify(d);
        if (!map.has(key)) map.set(key, d);
      }
      this._items = Array.from(map.values());
      console.debug('[PokemonGrid.addCards] buffer set', { items: this._items.length, ids: this._items.map(i => i.id), time: Date.now() });
      await this.renderPage(1);
    }

    static async renderPage(page = 1) {
      const grid = this.getGrid();
      if (!grid) return;
      if (this._rendering) return; // evitar render concurrente
      this._rendering = true;
      console.debug('[PokemonGrid.renderPage] enter', { page, buffer: this._items.length, time: Date.now() });
      const total = this._items.length;

      // Calcular número de columnas a partir del grid CSS
      let cols = 1;
      try {
        const computed = window.getComputedStyle(grid).gridTemplateColumns || '';
        cols = computed.trim() ? computed.split(/\s+/).filter(Boolean).length : 1;
        if (!cols || cols < 1) cols = 1;
      } catch (e) {
        cols = 1;
      }

    // Limitar columnas a 3 y usar 2 filas => 6 por página
    cols = Math.min(3, Math.max(1, cols));
    const per = Math.max(1, cols) * 2;
      const totalPages = Math.max(1, Math.ceil(total / per));
      page = Math.min(Math.max(1, page), totalPages);
      this._page = page;

      grid.innerHTML = '';
      // Asegurar que los items del grid se centran correctamente
      grid.style.justifyItems = 'center';
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
      console.debug('[PokemonGrid.renderPage] appended fragment', { rendered: cards.length, domCount: grid.children.length, time: Date.now() });

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
      console.debug('[PokemonGrid.renderPage] exit', { page: this._page, time: Date.now() });
      this._rendering = false;
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
      grid.innerHTML = '';
    }

    /**
     * Muestra un indicador de carga
     */
    static showLoading() {
      const grid = this.getGrid();
      if (!grid) return;
      grid.innerHTML = '';
    }
  }
