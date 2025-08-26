/**
 * Componente para manejar la carga diferida de imágenes
 */

export class ImageLoader {
  /**
   * Carga todas las imágenes con atributo data-src
   * Convierte data-src -> src para imágenes diferidas
   */
  static loadDeferredImages() {
    // Faster: asignar src directamente para que la imagen aparezca lo antes posible
    document.querySelectorAll('img[data-src]').forEach(img => {
      const src = img.dataset.src;
      if (src && src.trim()) {
        img.src = src;
      }
      img.removeAttribute('data-src');
    });
  }

  /**
   * Observa un elemento para cargar imágenes cuando sea visible
   * @param {HTMLElement} element - Elemento a observar
   * @param {Function} callback - Función a ejecutar cuando sea visible
   */
  static observeElement(element, callback) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(element);
    } else {
      // Fallback para navegadores sin soporte
      callback(element);
    }
  }
}
