import { test, expect } from '@playwright/test'

test.describe('Renderizado de Cards y Filtros por Tipo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Se renderizan cards de Pokémon en la página principal', async ({
    page
  }) => {
    await page.getByRole('button', { name: '🧢 Todos' }).click()
    await page
      .getByRole('list')
      .locator('div')
      .filter({ hasText: 'Ivysaur #002 Grass Poison' })
      .nth(2)
      .click()
    await expect(
      page
        .getByRole('list')
        .locator('div')
        .filter({ hasText: 'Ivysaur #002 Grass Poison' })
        .nth(2)
    ).toBeVisible()
  })

  test('Existen botones para filtrar por tipo', async ({ page }) => {
    await expect(page.locator('.type-btn')).toBeVisible()
    // Al menos dos tipos
    expect(await page.locator('.type-btn').count()).toBeGreaterThan(1)
  })

  test('Filtrar por tipo muestra solo Pokémon de ese tipo', async ({
    page
  }) => {
    const firstTypeBtn = page.locator('.type-btn').first()
    const typeName = await firstTypeBtn.textContent()
    await firstTypeBtn.click()
    await page.waitForTimeout(500)
    const cards = page.locator('.pokemon-card')
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i)
      await expect(card).toContainText(new RegExp(typeName, 'i'))
    }
  })
})
