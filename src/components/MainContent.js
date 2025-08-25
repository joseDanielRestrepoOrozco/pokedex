/**
 * Componente para renderizar el contenido principal
 */

export class MainContent {
  /**
   * Crea y retorna el elemento del contenido principal
   * @returns {HTMLElement} Elemento main del contenido principal
   */
  static create() {
    const main = document.createElement('main');
    main.className = 'main-content';
    
    main.innerHTML = `
      <section class="panel">
        <div class="panel-inner">
          <header class="panel-header">
            <div class="filters-row">
              <button class="filter-btn all" aria-pressed="false" title="Mostrar todos los tipos">
                <!-- Filtros adicionales se pueden agregar aquí -->
              </button>
            </div>
          </header>
          
          <!-- Viewport que contiene el grid y la paginación sticky -->
          <div class="cards-viewport full-height">
            <div class="card-grid two-rows" role="list"></div>
            <div class="pagination-wrap">
              <div class="pagination card-style" aria-label="Paginación Pokemon">
                <button class="page-btn prev" aria-label="Página anterior">◀ Anterior</button>
                <div class="page-info">Página <span class="current-page">1</span> de <span class="total-pages">1</span></div>
                <button class="page-btn next" aria-label="Página siguiente">Siguiente ▶</button>
              </div>
            </div>
          </div>
          
          <!-- Template para tarjetas estáticas (si se necesita) -->
          <template id="static-cards">
            <!-- Las tarjetas se generan dinámicamente -->
          </template>
        </div>
      </section>
    `;
    
    return main;
  }
}
