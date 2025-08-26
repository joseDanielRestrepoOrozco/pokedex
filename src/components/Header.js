/**
 * Componente para el header principal con solo el título
 */

export class Header {
  /**
   * Crea y retorna el elemento del header
   * @returns {HTMLElement} Elemento header
   */
  static create() {
    const header = document.createElement('header')
    header.className = 'main-header'

    // Botón hamburguesa para abrir sidebar
    const mobileMenuBtn = document.createElement('button')
    mobileMenuBtn.className = 'mobile-menu-btn'
    mobileMenuBtn.innerHTML = '☰'
    mobileMenuBtn.setAttribute('aria-label', 'Abrir menú')

    // Contenedor del logo/título
    const logoSection = document.createElement('div')
    logoSection.className = 'logo-section'
    logoSection.innerHTML = `
      <img data-src="/src/assets/PokeTitulo.png"
           src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
           alt="Pokédex"
           class="logo-large" />
    `

    // Contenedor flexible para centrar el logo y alinear el botón a la izquierda
    const headerContent = document.createElement('div')
    headerContent.className = 'header-content'
    headerContent.appendChild(mobileMenuBtn)
    headerContent.appendChild(logoSection)

    header.appendChild(headerContent)

    // Exponer el botón para que Layout pueda usarlo
    header.mobileMenuBtn = mobileMenuBtn
    return header
  }
}
