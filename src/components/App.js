/**
 * Componente principal de la aplicación Pokédex
 * Inicializa y coordina todos los componentes
 */

import { Layout } from './Layout.js';
import { WelcomeBanner } from './WelcomeBanner.js';
import { SearchForm } from './SearchForm.js';
import { TypeButtons } from './TypeButtons.js';
import { Logo } from './Logo.js';
import { ImageLoader } from './ImageLoader.js';
import { PokemonService } from '../services/PokemonService.js';

export class App {
  /**
   * Inicializa la aplicación
   */
  static init() {
    // Inicializar componentes cuando el DOM esté listo
    window.addEventListener('DOMContentLoaded', () => {
      this.initializeApp();
    });
  }

  /**
   * Inicializa toda la aplicación
   */
  static async initializeApp() {
    try {
      // Renderizar la estructura HTML completa
      await Layout.render();
      
      if (!Layout.validateLayout()) {
        console.error('Layout validation failed');
        return;
      }

      // Inicializar todos los componentes
      this.initializeComponents();
      
      // Activar la recarga de botones después de cargar tipos
      Layout.refreshTypeButtons();
      
      console.log('✅ Pokédex App initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
    }
  }

  /**
   * Inicializa todos los componentes de la aplicación
   */
  static initializeComponents() {
    // Inicializar banner de bienvenida
    WelcomeBanner.init();

    // Inicializar formulario de búsqueda
    SearchForm.init((query) => {
      PokemonService.fetchAndRenderByName(query);
    });

    // Inicializar botones de tipos
    TypeButtons.init(async (type) => {
      if (type === 'all') {
        await PokemonService.fetchAndRenderAll();
      } else if (type === 'fav') {
        // Funcionalidad de favoritos no implementada
        console.log('Favoritos feature not implemented yet');
      } else {
        await PokemonService.fetchAndRenderByType(type);
      }
    });

    // Inicializar logo
    Logo.init();

    // Cargar imágenes diferidas iniciales
    ImageLoader.loadDeferredImages();
  }
}
