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

  // Asegurar estado inicial en el body (sidebar expandida por defecto)
  try { document.body.classList.remove('sidebar-collapsed', 'sidebar-open') } catch (e) {}

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

    // Asegurar que exista un único botón toggle; preferir el del header si existe
    let toggleBtn = document.querySelector('.sidebar-toggle-btn')
    if (!toggleBtn) {
      toggleBtn = document.createElement('button')
      toggleBtn.className = 'sidebar-toggle-btn'
      toggleBtn.setAttribute('aria-label', 'Toggle sidebar')
      toggleBtn.setAttribute('aria-expanded', 'false')
      toggleBtn.innerHTML = '☰'
      // Insertar al inicio del header para mejor accesibilidad
      try {
        header.insertBefore(toggleBtn, header.firstChild)
      } catch (e) {
        // Si por alguna razón el header no está en el DOM o falla, añadir al body como fallback
        document.body.appendChild(toggleBtn)
      }
      // Forzar visibilidad en caso de que reglas CSS estén ocultándolo en algunos entornos
      toggleBtn.style.display = 'flex'
      toggleBtn.style.zIndex = '3005'
    }
    // Usar el toggleBtn creado arriba como el único controlador del sidebar
    const mobileMenuBtn = toggleBtn
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches
        const welcome = document.querySelector('.welcome-banner')
        const sidebarEl = sidebar
        if (isMobile) {
          const willOpen = !sidebarEl.classList.contains('open')
          if (willOpen) {
            Sidebar.openSidebar()
            mobileMenuBtn.setAttribute('aria-expanded', 'true')
          } else {
            Sidebar.closeSidebar()
            mobileMenuBtn.setAttribute('aria-expanded', 'false')
          }
          // Mostrar/ocultar el banner según el estado
          try {
            if (welcome) {
              if (willOpen) welcome.classList.add('hidden')
              else welcome.classList.remove('hidden')
            }
          } catch (e) {}
        } else {
          // Desktop: toggle de colapso (usuario decide cuándo cerrar)
          const isCollapsed = sidebarEl.classList.contains('collapsed')
          if (isCollapsed) {
            Sidebar.openSidebar()
            mobileMenuBtn.setAttribute('aria-expanded', 'true')
            try { document.body.classList.remove('sidebar-collapsed') } catch (e) {}
          } else {
            Sidebar.closeSidebar()
            mobileMenuBtn.setAttribute('aria-expanded', 'false')
            try { document.body.classList.add('sidebar-collapsed') } catch (e) {}
          }
        }
      })
    }

    // --- Mobile fallback button: en algunos entornos el toggle puede no mostrarse; crear un botón flotante visible en móviles ---
    try {
      let mobileFallback = document.querySelector('.sidebar-toggle-mobile')
      if (!mobileFallback) {
        mobileFallback = document.createElement('button')
        mobileFallback.className = 'sidebar-toggle-mobile'
        mobileFallback.setAttribute('aria-label', 'Toggle sidebar mobile')
        mobileFallback.setAttribute('aria-expanded', 'false')
        mobileFallback.innerHTML = '☰'
        // Estilos inline para forzar visibilidad sobre el overlay en móviles
        Object.assign(mobileFallback.style, {
          position: 'fixed',
          left: '12px',
          top: '12px',
          zIndex: '4005',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '10px',
          background: 'var(--pk-chip-bg)',
          color: 'var(--pk-text)',
          border: '1px solid rgba(0,0,0,0.18)',
          boxShadow: '0 6px 18px rgba(0,0,0,0.28)',
          cursor: 'pointer'
        })
        document.body.appendChild(mobileFallback)
      }

      const mobileToggleHandler = () => {
        const isMobile = window.matchMedia('(max-width: 768px)').matches
        const sidebarEl = document.querySelector('.sidebar')
        if (!sidebarEl) return
        if (isMobile) {
          const willOpen = !sidebarEl.classList.contains('open')
          if (willOpen) {
            Sidebar.openSidebar()
            mobileFallback.setAttribute('aria-expanded', 'true')
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true')
          } else {
            Sidebar.closeSidebar()
            mobileFallback.setAttribute('aria-expanded', 'false')
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false')
          }
          try { const welcome = document.querySelector('.welcome-banner'); if (welcome) { if (willOpen) welcome.classList.add('hidden'); else welcome.classList.remove('hidden') } } catch (e) {}
        } else {
          // En desktop reutilizar comportamiento del toggle principal
          const isCollapsed = sidebarEl.classList.contains('collapsed')
          if (isCollapsed) {
            Sidebar.openSidebar()
            mobileFallback.setAttribute('aria-expanded', 'true')
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true')
            try { document.body.classList.remove('sidebar-collapsed') } catch (e) {}
          } else {
            Sidebar.closeSidebar()
            mobileFallback.setAttribute('aria-expanded', 'false')
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false')
            try { document.body.classList.add('sidebar-collapsed') } catch (e) {}
          }
        }
      }

      // Evitar doble registro
      mobileFallback.addEventListener('click', mobileToggleHandler)

      // Mostrar/ocultar el fallback según tamaño (optimización visual)
      const mq = window.matchMedia('(max-width: 768px)')
      const updateVisibility = () => {
        if (mq.matches) mobileFallback.style.display = 'flex'
        else mobileFallback.style.display = 'none'
      }
      updateVisibility()
      mq.addEventListener?.('change', updateVisibility)
    } catch (e) {
      // no crítico
    }

    // Overlay: usar la API del Sidebar para cerrar y mantener consistencia
    sidebarOverlay.addEventListener('click', () => {
      Sidebar.closeSidebar()
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false')
      // Mostrar el banner de bienvenida cuando se cierra el overlay en móvil
      try {
        const welcome = document.querySelector('.welcome-banner')
        if (welcome) welcome.classList.remove('hidden')
      } catch (e) {}
    })

    // Cuando los tipos se carguen dinámicamente, cerrar la sidebar en móvil al seleccionar
    document.addEventListener('typesLoaded', () => {
      const typeBtns = sidebar.querySelectorAll('.type-btn')
      typeBtns.forEach(btn => {
        // evitar listeners repetidos
        if (btn.__close_on_mobile__) btn.removeEventListener('click', btn.__close_on_mobile__)
        const handler = () => {
          const isMobile = window.matchMedia('(max-width: 768px)').matches
          if (isMobile) Sidebar.closeSidebar()
        }
        btn.__close_on_mobile__ = handler
        btn.addEventListener('click', handler)
      })

      const randomBtn = sidebar.querySelector('#random-btn')
      if (randomBtn) {
        if (randomBtn.__close_on_mobile__) randomBtn.removeEventListener('click', randomBtn.__close_on_mobile__)
        const rHandler = () => {
          const isMobile = window.matchMedia('(max-width: 768px)').matches
          if (isMobile) Sidebar.closeSidebar()
        }
        randomBtn.__close_on_mobile__ = rHandler
        randomBtn.addEventListener('click', rHandler)
      }
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
