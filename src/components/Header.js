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

    // Contenedor del logo/título
    const logoSection = document.createElement('div')
    logoSection.className = 'logo-section'
    logoSection.innerHTML = `
      <img data-src="/src/assets/PokeTitulo.png"
           src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
           alt="Pokédex"
           class="logo-large" />
    `

  // Contenedor flexible para centrar el logo
  const headerContent = document.createElement('div')
  headerContent.className = 'header-content'
  headerContent.appendChild(logoSection)

    header.appendChild(headerContent)
  
  // No crear botón móvil aquí: usamos un único `.sidebar-toggle-btn` centralizado en Layout

    return header
  }
}
