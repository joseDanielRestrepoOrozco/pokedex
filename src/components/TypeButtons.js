/**
 * Componente para manejar los botones de tipos de Pokémon
 */

export class TypeButtons {
  static onTypeClickCallback = null;

  /**
   * Inicializa los botones de tipos
   * @param {Function} onTypeClick - Función callback para manejar clicks en tipos
   */
  static init(onTypeClick) {
    this.onTypeClickCallback = onTypeClick;
    
    // Escuchar cuando se carguen los tipos dinámicamente
    document.addEventListener('typesLoaded', () => {
      this.bindEvents();
    });

    // También intentar bindear eventos inmediatamente por si ya existen botones
    this.bindEvents();

    return document.querySelectorAll('.type-btn');
  }

  /**
   * Vincula eventos a los botones existentes
   */
  static bindEvents() {
    const typeBtns = document.querySelectorAll('.type-btn');
    
    // Remover event listeners existentes para evitar duplicados
    typeBtns.forEach(btn => {
      btn.removeEventListener('click', this.handleTypeClick);
    });

    // Agregar nuevos event listeners
    typeBtns.forEach(btn => {
      btn.addEventListener('click', this.handleTypeClick.bind(this));
    });
  }

  /**
   * Maneja el click en un botón de tipo
   * @param {Event} event - Evento de click
   */
  static async handleTypeClick(event) {
    const btn = event.currentTarget;
    const type = btn.dataset.type;
    
    if (!type || !this.onTypeClickCallback) return;

    // Actualizar estado visual
    this.setActiveButton(btn);
    
    // Ejecutar callback con el tipo seleccionado
    try {
      await this.onTypeClickCallback(type);
    } catch (error) {
      console.error(`Error handling type click for ${type}:`, error);
    }
  }

  /**
   * Establece el botón activo y desactiva los demás
   * @param {HTMLElement} activeBtn - Botón que debe estar activo
   */
  static setActiveButton(activeBtn) {
    const typeBtns = document.querySelectorAll('.type-btn');
    
    // Remover clase activa de todos los botones
    typeBtns.forEach(btn => btn.classList.remove('is-active'));
    
    // Agregar clase activa al botón seleccionado
    if (activeBtn) {
      activeBtn.classList.add('is-active');
    }
  }

  /**
   * Limpia la selección de todos los botones
   */
  static clearSelection() {
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => btn.classList.remove('is-active'));
  }

  /**
   * Obtiene el botón activo actual
   * @returns {HTMLElement|null} Botón activo o null si no hay ninguno
   */
  static getActiveButton() {
    return document.querySelector('.type-btn.is-active');
  }

  /**
   * Establece un botón como activo por su tipo
   * @param {string} type - Tipo del botón a activar
   */
  static setActiveByType(type) {
    const btn = document.querySelector(`.type-btn[data-type="${type}"]`);
    if (btn) {
      this.setActiveButton(btn);
    }
  }

  /**
   * Obtiene todos los tipos disponibles
   * @returns {Array<string>} Array con todos los tipos
   */
  static getAllTypes() {
    const typeBtns = document.querySelectorAll('.type-btn');
    return Array.from(typeBtns).map(btn => btn.dataset.type).filter(type => type);
  }

  /**
   * Refresca los event listeners después de que se actualicen los botones
   */
  static refresh() {
    this.bindEvents();
  }
}
