import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PokemonCard } from '../src/components/PokemonCard.js'
import { TypeButtons } from '../src/components/TypeButtons.js'

function getSamplePokemon() {
  return {
    id: 25,
    name: 'pikachu',
    types: [{ type: { name: 'electric' } }],
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      other: {
        'official-artwork': {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
        }
      }
    },
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } }
    ]
  }
}

describe('PokemonCard', () => {
  it('debe renderizar una card correctamente', async () => {
    const pokemon = getSamplePokemon()
    const card = await PokemonCard.create(pokemon)
    expect(card).toBeInstanceOf(HTMLElement)
    expect(card.className).toContain('pokemon-card')
    expect(card.innerHTML).toContain('Pikachu')
    expect(card.innerHTML).toContain('#025')
    expect(card.innerHTML).toContain('electric')
    expect(card.querySelector('img')).not.toBeNull()
  })
})

describe('asegurar que el componente de TypeButtons se renderiza correctamente', () => {
  test('debe renderizar los botones de tipo correctamente', async () => {
    const pokemon = getSamplePokemon()
    const buttons = await TypeButtons.create(pokemon)
    expect(buttons).toBeInstanceOf(HTMLElement)
    expect(buttons.className).toContain('type-buttons')
    expect(buttons.innerHTML).toContain('electric')
  })
})
