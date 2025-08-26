/**
 * Utilidades y funciones auxiliares
 */

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} s - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export function capitalize(s) {
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

/**
 * Escapa caracteres HTML para prevenir inyección de código
 * @param {string} str - Cadena a escapar
 * @returns {string} Cadena escapada
 */
export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
