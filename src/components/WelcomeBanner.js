/**
 * Componente para manejar el banner de bienvenida
 */

export class WelcomeBanner {
  /**
   * Crea y retorna el elemento del banner de bienvenida
   * @returns {HTMLElement} Elemento div del banner
   */
  static create() {
    const banner = document.createElement('div');
    banner.id = 'welcome-banner';
    banner.className = 'welcome-banner';
    banner.setAttribute('aria-live', 'polite');
    
    banner.innerHTML = `
      <div class="welcome-inner">
        <h2>Bienvenido a Pokédex</h2>
        <p>Explora Pokémon. Usa los filtros para navegar</p>
      </div>
    `;
    
    return banner;
  }

  /**
   * Inicializa el banner de bienvenida
   */
  static init() {
    const closeBtn = document.getElementById('welcome-close');
    
    // El banner no bloquea: se muestra pero no previene la carga de imágenes
    document.body.classList.add('welcome-open');

    if (closeBtn) {
      closeBtn.addEventListener('click', this.close.bind(this));
    }
  }

  /**
   * Cierra el banner de bienvenida
   */
  static close() {
    const banner = document.getElementById('welcome-banner') || 
                   document.getElementById('welcome-overlay');
    
    if (banner) {
      banner.remove();
    }
    
    document.body.classList.remove('welcome-open');
  }

  /**
   * Oculta el banner cuando se cargan las cartas
   */
  static hide() {
    const welcomeBanner = document.getElementById('welcome-banner');
    
    if (welcomeBanner) {
      welcomeBanner.classList.add('hidden');
    }
    
    document.body.classList.remove('welcome-open');
  }

  /**
   * Muestra el banner nuevamente
   */
  static show() {
    document.body.classList.add('welcome-open');
    
    const welcomeBanner = document.getElementById('welcome-banner');
    if (welcomeBanner) {
      welcomeBanner.classList.remove('hidden');
    }
  }
}
