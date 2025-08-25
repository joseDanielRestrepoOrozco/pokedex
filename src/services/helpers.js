// src/data/helpers.js
// Helpers para transformar la información de la PokeAPI


/**
 * Extrae información relevante de un Pokémon (nombre, id, tipos, stats, sprite).
 * @param {Object} data - Objeto de datos crudos de la API de Pokémon.
 * @returns {Object} Objeto con id, name, types, stats, sprite o { error }
 */
export function parsePokemonData(data) {
  if (!data || data.error) return { error: data?.error || 'Datos inválidos' };
  return {
    id: data.id,
    name: data.name,
    types: data.types.map(t => t.type.name),
    stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
    sprite: data.sprites?.front_default,
  };
}


/**
 * Extrae la descripción en español de la especie de un Pokémon.
 * @param {Object} speciesData - Objeto de datos crudos de la especie de la API.
 * @returns {string} Descripción en español o string vacío si no existe.
 */
export function getSpanishDescription(speciesData) {
  if (!speciesData || speciesData.error) return '';
  const entry = speciesData.flavor_text_entries?.find(
    e => e.language.name === 'es'
  );
  return entry ? entry.flavor_text.replace(/\f|\n/g, ' ') : '';
}
