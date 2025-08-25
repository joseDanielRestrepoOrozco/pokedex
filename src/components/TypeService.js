/**
 * Servicio para manejar tipos de Pokémon dinámicamente
 */

import { getAllTypes, getTypeDetails } from '../services/api.js';

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
      
      // Filtrar tipos válidos y agregar tipo "all" al inicio
      const validTypes = typesWithDetails.filter(type => type && !type.error);
      
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
        sprite: typeDetails.sprites?.['generation-viii']?.['legends-arceus']?.name_icon || 
               typeDetails.sprites?.['generation-vi']?.['x-y']?.name_icon || 
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
    return [
      { name: 'all', displayName: 'Todos', emoji: '🧢', sprite: null, color: '#6C7B7F' },
      { name: 'fire', displayName: 'Fuego', emoji: '🔥', sprite: null, color: '#FF5722' },
      { name: 'water', displayName: 'Agua', emoji: '💧', sprite: null, color: '#2196F3' },
      { name: 'grass', displayName: 'Planta', emoji: '🌿', sprite: null, color: '#4CAF50' },
      { name: 'electric', displayName: 'Eléctrico', emoji: '⚡', sprite: null, color: '#FFEB3B' },
      { name: 'psychic', displayName: 'Psíquico', emoji: '🔮', sprite: null, color: '#E91E63' },
      { name: 'ice', displayName: 'Hielo', emoji: '❄️', sprite: null, color: '#00BCD4' },
      { name: 'dragon', displayName: 'Dragón', emoji: '🐉', sprite: null, color: '#3F51B5' },
      { name: 'dark', displayName: 'Siniestro', emoji: '🌑', sprite: null, color: '#424242' },
      { name: 'fairy', displayName: 'Hada', emoji: '🧚', sprite: null, color: '#E1BEE7' },
      { name: 'fighting', displayName: 'Lucha', emoji: '👊', sprite: null, color: '#FF9800' },
      { name: 'poison', displayName: 'Veneno', emoji: '☠️', sprite: null, color: '#9C27B0' },
      { name: 'ground', displayName: 'Tierra', emoji: '🌍', sprite: null, color: '#795548' },
      { name: 'flying', displayName: 'Volador', emoji: '🦅', sprite: null, color: '#03A9F4' },
      { name: 'bug', displayName: 'Bicho', emoji: '🐛', sprite: null, color: '#8BC34A' },
      { name: 'rock', displayName: 'Roca', emoji: '�', sprite: null, color: '#607D8B' },
      { name: 'ghost', displayName: 'Fantasma', emoji: '👻', sprite: null, color: '#673AB7' },
      { name: 'steel', displayName: 'Acero', emoji: '⚙️', sprite: null, color: '#9E9E9E' }
    ];
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
    return emojiMap[type] || '❓';
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
