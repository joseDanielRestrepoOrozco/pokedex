/**
 * Servicio para manejar tipos de Pokémon dinámicamente
 */

import { getAllTypes, getTypeDetails } from './api.js';

export class TypeService {
  static typeCache = new Map(); // Cache para tipos ya obtenidos
  static allTypesCache = null; // Cache para la lista completa de tipos

  /**
   * Obtiene todos los tipos disponibles con sus detalles
   * @returns {Promise<Array>} Array de tipos con información detallada
   */
  static async getAllTypesWithDetails() {
    if (this.allTypesCache) {
      return this.allTypesCache;
    }

    try {
      const typesResponse = await getAllTypes();
      if (typesResponse.error) {
        console.error('Error getting types:', typesResponse.error);
        return this.getFallbackTypes();
      }

      // Filtrar tipos no deseados (como normal y otros poco usados)
      const excludedTypes = ['normal', 'unknown', 'shadow'];
      const filteredTypes = typesResponse.results.filter(type => 
        !excludedTypes.includes(type.name)
      );

      // Obtener detalles para cada tipo en paralelo (limitado para no saturar)
      const typePromises = filteredTypes.slice(0, 15).map(async (type) => {
        const typeDetails = await this.getTypeWithDetails(type.name);
        return typeDetails;
      });

      const typesWithDetails = await Promise.all(typePromises);
      
      // Filtrar tipos válidos
      let validTypes = typesWithDetails.filter(type => type && !type.error);

      // Ordenar alfabeticamente por displayName (A-Z)
      validTypes.sort((a, b) => {
        const A = (a.displayName || a.name || '').toLowerCase();
        const B = (b.displayName || b.name || '').toLowerCase();
        return A.localeCompare(B);
      });

      // Agregar tipo "all" al inicio
      this.allTypesCache = [
        {
          name: 'all',
          displayName: 'Todos',
          emoji: '🧢',
          sprite: null,
          color: '#6C7B7F'
        },
        ...validTypes
      ];

      return this.allTypesCache;
    } catch (error) {
      console.error('Error fetching types:', error);
      return this.getFallbackTypes();
    }
  }

  /**
   * Obtiene detalles de un tipo específico con cache
   * @param {string} typeName - Nombre del tipo
   * @returns {Promise<Object>} Objeto con detalles del tipo
   */
  static async getTypeWithDetails(typeName) {
    if (this.typeCache.has(typeName)) {
      return this.typeCache.get(typeName);
    }

    try {
      const typeDetails = await getTypeDetails(typeName);
      if (typeDetails.error) {
        return null;
      }

      const processedType = {
        name: typeName,
        displayName: this.capitalizeFirst(typeName),
        emoji: this.getTypeEmoji(typeName),
        // La PokeAPI no siempre expone sprites para los "types". Usar primero
        // cualquier sprite proporcionado por la respuesta y, si no existe,
        // construir una URL pública conocida con iconos por tipo.
        sprite: typeDetails.sprites?.['generation-viii']?.['legends-arceus']?.name_icon ||
                typeDetails.sprites?.['generation-vi']?.['x-y']?.name_icon ||
                this.getTypeSpriteUrl(typeName) ||
                null,
        color: this.getTypeColor(typeName),
        id: typeDetails.id
      };

      this.typeCache.set(typeName, processedType);
      return processedType;
    } catch (error) {
      console.error(`Error fetching type ${typeName}:`, error);
      return null;
    }
  }

  /**
   * Obtiene tipos de fallback si falla la API
   * @returns {Array} Array de tipos básicos
   */
  static getFallbackTypes() {
    // Añadir sprite por defecto usando getTypeSpriteUrl para mejorar la carga
    return [
      { name: 'all', displayName: 'Todos', emoji: '🧢', sprite: null, color: '#6C7B7F' },
      { name: 'fire', displayName: 'Fuego', emoji: '🔥', sprite: this.getTypeSpriteUrl('fire'), color: '#FF5722' },
      { name: 'water', displayName: 'Agua', emoji: '💧', sprite: this.getTypeSpriteUrl('water'), color: '#2196F3' },
      { name: 'grass', displayName: 'Planta', emoji: '🌿', sprite: this.getTypeSpriteUrl('grass'), color: '#4CAF50' },
      { name: 'electric', displayName: 'Eléctrico', emoji: '⚡', sprite: this.getTypeSpriteUrl('electric'), color: '#FFEB3B' },
      { name: 'psychic', displayName: 'Psíquico', emoji: '🔮', sprite: this.getTypeSpriteUrl('psychic'), color: '#E91E63' },
      { name: 'ice', displayName: 'Hielo', emoji: '❄️', sprite: this.getTypeSpriteUrl('ice'), color: '#00BCD4' },
      { name: 'dragon', displayName: 'Dragón', emoji: '🐉', sprite: this.getTypeSpriteUrl('dragon'), color: '#3F51B5' },
      { name: 'dark', displayName: 'Siniestro', emoji: '🌑', sprite: this.getTypeSpriteUrl('dark'), color: '#424242' },
      { name: 'fairy', displayName: 'Hada', emoji: '🧚', sprite: this.getTypeSpriteUrl('fairy'), color: '#E1BEE7' },
      { name: 'fighting', displayName: 'Lucha', emoji: '👊', sprite: this.getTypeSpriteUrl('fighting'), color: '#FF9800' },
      { name: 'poison', displayName: 'Veneno', emoji: '☠️', sprite: this.getTypeSpriteUrl('poison'), color: '#9C27B0' },
      { name: 'ground', displayName: 'Tierra', emoji: '🌍', sprite: this.getTypeSpriteUrl('ground'), color: '#795548' },
      { name: 'flying', displayName: 'Volador', emoji: '🦅', sprite: this.getTypeSpriteUrl('flying'), color: '#03A9F4' },
      { name: 'bug', displayName: 'Bicho', emoji: '🐛', sprite: this.getTypeSpriteUrl('bug'), color: '#8BC34A' },
      { name: 'rock', displayName: 'Roca', emoji: '🪨', sprite: this.getTypeSpriteUrl('rock'), color: '#607D8B' },
      { name: 'ghost', displayName: 'Fantasma', emoji: '👻', sprite: this.getTypeSpriteUrl('ghost'), color: '#673AB7' },
      { name: 'steel', displayName: 'Acero', emoji: '⚙️', sprite: this.getTypeSpriteUrl('steel'), color: '#9E9E9E' }
    ];
  }

  /**
   * Construye una URL pública para iconos de tipo si la API no los provee.
   * Usa un repo público con iconos por tipo (SVG/PNG). El navegador
   * intentará cargarlos cuando se usen como src.
   * @param {string} typeName
   * @returns {string|null}
   */
  static getTypeSpriteUrl(typeName) {
    if (!typeName) return null;
    const t = String(typeName).toLowerCase();
    // Repo público con iconos por tipo (SVG). Si cambias la fuente, actualiza aquí.
    return `https://raw.githubusercontent.com/duiker101/pokemon-type-icons/master/icons/${t}.svg`;
  }

  /**
   * Obtiene emoji para un tipo específico
   * @param {string} type - Nombre del tipo
   * @returns {string} Emoji correspondiente
   */
  static getTypeEmoji(type) {
  const emojiMap = {
      'normal': '⚪',
      'fire': '🔥',
      'water': '💧',
      'electric': '⚡',
      'grass': '🌿',
      'ice': '❄️',
      'fighting': '👊',
      'poison': '☠️',
      'ground': '🌍',
      'flying': '🦅',
      'psychic': '🔮',
      'bug': '🐛',
      'rock': '🪨',
      'ghost': '👻',
      'dragon': '🐉',
      'dark': '🌑',
      'steel': '⚙️',
      'fairy': '🧚'
    };
  if (!type || typeof type !== 'string') return '❓';
  const key = type.toLowerCase();
  return emojiMap[key] || '❓';
  }

  /**
   * Obtiene color para un tipo específico
   * @param {string} type - Nombre del tipo
   * @returns {string} Color hexadecimal
   */
  static getTypeColor(type) {
    const colorMap = {
      'normal': '#A8A878',
      'fire': '#F08030',
      'water': '#6890F0',
      'electric': '#F8D030',
      'grass': '#78C850',
      'ice': '#98D8D8',
      'fighting': '#C03028',
      'poison': '#A040A0',
      'ground': '#E0C068',
      'flying': '#A890F0',
      'psychic': '#F85888',
      'bug': '#A8B820',
      'rock': '#B8A038',
      'ghost': '#705898',
      'dragon': '#7038F8',
      'dark': '#705848',
      'steel': '#B8B8D0',
      'fairy': '#EE99AC'
    };
    return colorMap[type] || '#68A090';
  }

  /**
   * Capitaliza la primera letra de una cadena
   * @param {string} str - Cadena a capitalizar
   * @returns {string} Cadena capitalizada
   */
  static capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Limpia el cache de tipos
   */
  static clearCache() {
    this.typeCache.clear();
    this.allTypesCache = null;
  }
}
