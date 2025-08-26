/**
 * Componente para el header principal con solo el título
 */

export class Header {
  /**
   * Crea y retorna el elemento del header
   * @returns {HTMLElement} Elemento header
   */
  static create() {
    const header = document.createElement('header');
    header.className = 'main-header';
    
    header.innerHTML = `
      <div class="header-content">
        <div class="logo-section">
          <img data-src="/src/assets/PokeTitulo.png" 
               src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" 
               alt="Pokédex" 
               class="logo-large" />
        </div>
      </div>
    `;
    
    return header;
  }
}
