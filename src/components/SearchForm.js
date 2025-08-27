/**
 * Componente para manejar el formulario de búsqueda
 */

export class SearchForm {
  /**
   * Inicializa el formulario de búsqueda
   * @param {Function} onSearch - Función callback para manejar la búsqueda
   */
  static init(onSearch) {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    if (searchForm && searchInput) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (!query) return;
        
        onSearch(query);
      });
    }

    return { searchForm, searchInput };
  }

  /**
   * Limpia el campo de búsqueda
   */
  static clear() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = '';
    }
  }

  /**
   * Obtiene el valor actual del campo de búsqueda
   * @returns {string} Valor del campo de búsqueda
   */
  static getValue() {
    const searchInput = document.querySelector('.search-input');
    return searchInput ? searchInput.value.trim() : '';
  }

  /**
   * Establece el valor del campo de búsqueda
   * @param {string} value - Valor a establecer
   */
  static setValue(value) {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = value;
    }
  }

  /**
   * Enfoca el campo de búsqueda
   */
  static focus() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }
}
