/**
 * Servicios para manejar la obtención y renderizado de datos de Pokémon
 */

import { getPokemon, getPokemonsByType } from './api.js';
import { PokemonGrid } from '../components/PokemonGrid.js';
import { WelcomeBanner } from '../components/WelcomeBanner.js';

// Límites de UX
const ALL_LIMIT = 151; // número máximo a pedir en 'Ver todos'
const TYPE_LIMIT = 60; // límite para tipos específicos

export class PokemonService {
  /**
   * Obtiene y renderiza un Pokémon aleatorio de los primeros 151
   */
  static async fetchRandom() {
    if (!PokemonGrid.getGrid()) return;
    WelcomeBanner.hide();
    PokemonGrid.clear();
    PokemonGrid.showLoading();
    try {
      // Selecciona un id aleatorio entre 1 y 151 (Kanto)
      const randomId = Math.floor(Math.random() * 151) + 1;
      const data = await getPokemon(randomId);
      PokemonGrid.clear();
      if (data?.error) {
        PokemonGrid.showNoResults('No se pudo obtener un Pokémon aleatorio');
        return;
      }
      await PokemonGrid.addCard(data);
    } catch (error) {
      console.error('Error en Pokémon aleatorio:', error);
      PokemonGrid.showNoResults('Error al buscar Pokémon aleatorio');
    }
  }
  /**
   * Busca y renderiza un Pokémon por nombre
   * @param {string} name - Nombre del Pokémon
   */
  static async fetchAndRenderByName(name) {
    if (!PokemonGrid.getGrid()) return;
    
    // Ocultar banner de bienvenida
    WelcomeBanner.hide();
    
    PokemonGrid.clear();
    PokemonGrid.showLoading();
    
    try {
      const data = await getPokemon(name.toLowerCase().trim());
      
      PokemonGrid.clear();
      
      if (data?.error) {
        PokemonGrid.showNoResults(`No se encontró el Pokémon "${name}"`);
        return;
      }
      
      await PokemonGrid.addCard(data);
    } catch (error) {
      console.error('Error fetching Pokemon by name:', error);
      PokemonGrid.showNoResults('Error al buscar el Pokémon');
    }
  }

  /**
   * Obtiene y renderiza todos los Pokémon (con límite)
   * @param {number} limit - Límite de Pokémon a obtener
   */
  static async fetchAndRenderAll(limit = ALL_LIMIT) {
    if (!PokemonGrid.getGrid()) return;
    
    // Ocultar banner de bienvenida
    WelcomeBanner.hide();
    
    PokemonGrid.clear();
    PokemonGrid.showLoading();
    
    const BASE = import.meta.env.VITE_POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';
    
    try {
      const listRes = await fetch(`${BASE}/pokemon?limit=${limit}`);
      if (!listRes.ok) throw new Error(`List request failed ${listRes.status}`);

      const list = await listRes.json();

      PokemonGrid.clear();

      // Obtener todos los detalles en paralelo, mantener orden y luego renderizar por páginas
      const details = await Promise.all(
        list.results.map(r => getPokemon(r.name).catch(err => ({ error: err })))
      );

      // Filtrar y ordenar por id ascendente para asegurar orden
      const validDetails = details.filter(d => d && !d.error && typeof d.id === 'number');
      validDetails.sort((a, b) => a.id - b.id);

      // Agregar al buffer del grid para que la paginación funcione
      await PokemonGrid.addCards(validDetails);
      
      if (PokemonGrid.isEmpty()) {
        PokemonGrid.showNoResults('No se pudieron cargar los Pokémon');
      }
    } catch (error) {
      console.error('Error fetching all Pokemon:', error);
      PokemonGrid.clear();
      PokemonGrid.showNoResults('Error al cargar los Pokémon');
    }
  }

  /**
   * Obtiene y renderiza Pokémon por tipo
   * @param {string} type - Tipo de Pokémon
   */
  static async fetchAndRenderByType(type) {
    if (!PokemonGrid.getGrid()) return;
    
    // Ocultar banner de bienvenida
    WelcomeBanner.hide();
    
    PokemonGrid.clear();
    PokemonGrid.showLoading();
    
    try {
      const names = await getPokemonsByType(type);

      if (names.error) {
        PokemonGrid.clear();
        PokemonGrid.showNoResults(`No se encontraron Pokémon del tipo "${type}"`);
        return;
      }

      // Limitar para no saturar
      const limited = names.slice(0, TYPE_LIMIT);

      PokemonGrid.clear();

      // Obtener detalles en paralelo
      const details = await Promise.all(
        limited.map(n => getPokemon(n).catch(err => ({ error: err })))
      );

      const validDetails = details.filter(d => d && !d.error && typeof d.id === 'number');
      validDetails.sort((a, b) => a.id - b.id);

      await PokemonGrid.addCards(validDetails);
      
      if (PokemonGrid.isEmpty()) {
        PokemonGrid.showNoResults(`No se encontraron Pokémon del tipo "${type}"`);
      }
    } catch (error) {
      console.error('Error fetching Pokemon by type:', error);
      PokemonGrid.clear();
      PokemonGrid.showNoResults('Error al cargar los Pokémon por tipo');
    }
  }
}
