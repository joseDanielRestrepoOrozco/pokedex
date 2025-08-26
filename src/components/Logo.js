/**
 * Componente para manejar el logo y navegación principal
 */

import { PokemonGrid } from './PokemonGrid.js';
import { WelcomeBanner } from './WelcomeBanner.js';
import { SearchForm } from './SearchForm.js';
import { TypeButtons } from './TypeButtons.js';

export class Logo {
  /**
   * Inicializa el componente del logo
   */
  static init() {
    const logo = document.querySelector('.logo-large');
    
    if (logo) {
      logo.addEventListener('click', this.handleLogoClick.bind(this));
      
      // Hacer que el logo se vea clickeable
      logo.style.cursor = 'pointer';
    }
  }

  /**
   * Maneja el click en el logo para volver al home
   */
  static handleLogoClick() {
    // Limpiar el grid
    PokemonGrid.clear();
    
    // Mostrar banner de bienvenida
    WelcomeBanner.show();
    
    // Limpiar input de búsqueda
    SearchForm.clear();
    
    // Resetear botones de tipos
    TypeButtons.clearSelection();
  }
}
