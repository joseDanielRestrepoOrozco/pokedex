/**
 * Componente para manejar el layout completo de la aplicación
 */

import { Header } from './Header.js'
import { Sidebar } from './Sidebar.js'
import { WelcomeBanner } from './WelcomeBanner.js'
import { MainContent } from './MainContent.js'

export class Layout {
  /**
   * Renderiza toda la estructura HTML de la aplicación
   */
  static async render() {
    const app = document.getElementById('app')
    if (!app) {
      console.error('Element with id "app" not found')
      return
    }

    // Limpiar contenido existente
    app.innerHTML = ''

    // Crear estructura principal
    const mainContainer = document.createElement('div')
    mainContainer.className = 'app-container'

    // Overlay para sidebar móvil
    const sidebarOverlay = document.createElement('div')
    sidebarOverlay.className = 'sidebar-overlay'

    // Crear elementos principales
    const header = Header.create()
    const sidebar = Sidebar.create()
    const welcomeBanner = WelcomeBanner.create()
    const mainContent = MainContent.create()

    // Contenedor principal con sidebar y contenido
    const bodyContainer = document.createElement('div')
    bodyContainer.className = 'app-body'
    const contentContainer = document.createElement('div')
    contentContainer.className = 'content-container'
    contentContainer.appendChild(welcomeBanner)
    contentContainer.appendChild(mainContent)
    // Insertar overlay antes del sidebar para que no lo cubra
    bodyContainer.appendChild(sidebarOverlay)
    bodyContainer.appendChild(sidebar)
    bodyContainer.appendChild(contentContainer)

    mainContainer.appendChild(header)
    mainContainer.appendChild(bodyContainer)

    // Agregar al DOM
    app.appendChild(mainContainer)

    // Sincronizar la variable CSS con la altura real del header para calcular áreas
    try {
      const headerHeight = header.getBoundingClientRect().height || 120
      document.documentElement.style.setProperty(
        '--app-header-height',
        `${headerHeight}px`
      )
    } catch {
      // si algo falla, dejar la variable por defecto
    }

    // Lógica para mostrar/ocultar sidebar en móvil
    const mobileMenuBtn = header.mobileMenuBtn
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = !sidebar.classList.contains('open')
        sidebar.classList.toggle('open')
        sidebarOverlay.classList.toggle('active')
        document.body.style.overflow = isOpen ? 'hidden' : ''
        document.body.classList.toggle('sidebar-open', isOpen)
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen))
      })
    }
    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open')
      sidebarOverlay.classList.remove('active')
      document.body.style.overflow = ''
      document.body.classList.remove('sidebar-open')
      if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false')
    })

    // Paginación: wiring con botones prev/next si existen
    const prevBtn = mainContent.querySelector('.pagination.card-style .prev')
    const nextBtn = mainContent.querySelector('.pagination.card-style .next')
    if (prevBtn)
      prevBtn.addEventListener('click', () => {
        import('./PokemonGrid.js').then(m => m.PokemonGrid.prevPage())
      })
    if (nextBtn)
      nextBtn.addEventListener('click', () => {
        import('./PokemonGrid.js').then(m => m.PokemonGrid.nextPage())
      })

    // Retornar referencias a elementos importantes
    return {
      header,
      sidebar,
      welcomeBanner,
      mainContent,
      searchForm: sidebar.querySelector('.search-form'),
      searchInput: sidebar.querySelector('.search-input'),
      typeButtons: sidebar.querySelectorAll('.type-btn'),
      cardGrid: mainContent.querySelector('.card-grid.two-rows'),
      logo: header.querySelector('.logo-large'),
      mobileMenuBtn,
      sidebarOverlay
    }
  }

  /**
   * Obtiene referencias a elementos importantes del layout
   * @returns {Object} Objeto con referencias a elementos del DOM
   */
  static getElements() {
    return {
      header: document.querySelector('.main-header'),
      sidebar: document.querySelector('.sidebar'),
      welcomeBanner: document.getElementById('welcome-banner'),
      mainContent: document.querySelector('.main-content'),
      searchForm: document.querySelector('.search-form'),
      searchInput: document.querySelector('.search-input'),
      typeButtons: document.querySelectorAll('.type-btn'),
      cardGrid: document.querySelector('.card-grid'),
      logo: document.querySelector('.logo-large'),
      welcomeClose: document.getElementById('welcome-close')
    }
  }

  /**
   * Verifica si todos los elementos necesarios están presentes
   * @returns {boolean} True si todos los elementos están presentes
   */
  static validateLayout() {
    const elements = this.getElements()
    const required = [
      'header',
      'sidebar',
      'mainContent',
      'searchForm',
      'cardGrid'
    ]

    return required.every(key => elements[key] !== null)
  }

  /**
   * Refresca los botones de tipos después de que se carguen dinámicamente
   */
  static refreshTypeButtons() {
    // Esperar un momento para que se carguen los tipos dinámicamente
    setTimeout(() => {
      const event = new CustomEvent('typesLoaded')
      document.dispatchEvent(event)
    }, 100)
  }

  /**
   * Alterna la visibilidad del sidebar en móvil
   */
  static toggleSidebar() {
    const sidebar = document.querySelector('.sidebar')
    if (sidebar) {
      sidebar.classList.toggle('sidebar-open')
    }
  }

  /**
   * Actualiza las estadísticas del header
   * @param {number} totalPokemon - Total de Pokémon
   * @param {number} totalTypes - Total de tipos
   */
  static updateHeaderStats(totalPokemon, totalTypes) {
    Header.updateStats(totalPokemon, totalTypes)
  }
}
