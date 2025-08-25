import { parsePokemonData } from './helpers.js';
import axios from 'axios';

/**
 * Obtiene información relevante de todos los Pokémon de un tipo.
 * @param {string} type - Nombre del tipo (por ejemplo, 'fire', 'water').
 * @returns {Promise<Array|{error: string}>} Array de objetos con info de cada Pokémon o { error }
 */
// Obtener información relevante de todos los Pokémon de un tipo
export async function getPokemonsInfoByType(type) {
	const names = await getPokemonsByType(type);
	if (names.error) return { error: names.error };
	// Limitar la cantidad para evitar demasiadas peticiones (opcional)
	// const limitedNames = names.slice(0, 20);
	const results = await Promise.all(
		names.map(async (name) => {
			const data = await getPokemon(name);
			return parsePokemonData(data);
		})
	);
	return results;
}

// ===============================
// Funciones base para consumir la PokeAPI
// ===============================

// Usar la variable de entorno definida en .env
const BASE_URL = import.meta.env.VITE_POKEAPI_BASE_URL;



/**
 * Obtiene los datos básicos de un Pokémon por id o nombre.
 * @param {string|number} idOrName - ID o nombre del Pokémon.
 * @returns {Promise<Object|{error: string}>} Objeto con los datos o { error }
 */
export async function getPokemon(idOrName) {
	try {
		const res = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
		return res.data;
	} catch (error) {
		return { error: error.response?.data?.detail || 'Pokémon no encontrado' };
	}
}



/**
 * Obtiene información adicional de la especie de un Pokémon.
 * @param {string|number} idOrName - ID o nombre del Pokémon.
 * @returns {Promise<Object|{error: string}>} Objeto con los datos o { error }
 */
export async function getPokemonSpecies(idOrName) {
	try {
		const res = await axios.get(`${BASE_URL}/pokemon-species/${idOrName}`);
		return res.data;
	} catch (error) {
		return { error: error.response?.data?.detail || 'Especie no encontrada' };
	}
}



/**
 * Obtiene todos los tipos de Pokémon disponibles en la API.
 * @returns {Promise<Object|{error: string}>} Objeto con los tipos o { error }
 */
export async function getAllTypes() {
	try {
		const res = await axios.get(`${BASE_URL}/type`);
		return res.data;
	} catch (error) {
		return { error: error.response?.data?.detail || 'No se pudieron obtener los tipos' };
	}
}



/**
 * Obtiene los nombres de todos los Pokémon de un tipo específico.
 * @param {string} type - Nombre del tipo (por ejemplo, 'fire', 'water').
 * @returns {Promise<Array<string>|{error: string}>} Array de nombres o { error }
 */
export async function getPokemonsByType(type) {
	try {
		const res = await axios.get(`${BASE_URL}/type/${type}`);
		// Devuelve solo los nombres de los Pokémon
		return res.data.pokemon.map(p => p.pokemon.name);
	} catch (error) {
		return { error: error.response?.data?.detail || 'Tipo no encontrado' };
	}
}