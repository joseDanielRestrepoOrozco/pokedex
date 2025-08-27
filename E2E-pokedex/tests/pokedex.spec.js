import { test, expect } from '@playwright/test'

test.describe('Pokédex Digital', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('La página tiene el título correcto', async ({ page }) => {
    await expect(page).toHaveTitle(/Pokédex Digital/i)
  })

  test('El layout principal se renderiza', async ({ page }) => {
    await expect(page.locator('.app-container')).toBeVisible()
    await expect(page.locator('.main-content')).toBeVisible()
  })

  test('Se muestra el banner de bienvenida', async ({ page }) => {
    await expect(page.locator('.welcome-banner')).toBeVisible()
  })

  test('El grid de Pokémon se muestra', async ({ page }) => {
    await expect(page.locator('.card-grid')).toBeVisible()
  })

  test('La paginación está presente', async ({ page }) => {
    await expect(page.locator('.pagination')).toBeVisible()
    await expect(page.locator('.page-btn.prev')).toBeVisible()
    await expect(page.locator('.page-btn.next')).toBeVisible()
  })

  test('El formulario de búsqueda existe', async ({ page }) => {
    await expect(page.locator('.search-form')).toBeVisible()
    await expect(page.locator('.search-input')).toBeVisible()
  })

  test('Buscar un Pokémon muestra resultados', async ({ page }) => {
    await page.fill('.search-input', 'pikachu')
    await page.press('.search-input', 'Enter')
    await expect(page.locator('.pokemon-card')).toBeVisible()
    await expect(page.locator('.pokemon-card')).toContainText(/pikachu/i)
  })

  test('Botones de paginación funcionan', async ({ page }) => {
    const nextBtn = page.locator('.page-btn.next')
    const prevBtn = page.locator('.page-btn.prev')
    const currentPage = page.locator('.current-page')
    const totalPages = page.locator('.total-pages')
    if ((await totalPages.textContent()) !== '1') {
      await nextBtn.click()
      await expect(currentPage).not.toHaveText('1')
      await prevBtn.click()
      await expect(currentPage).toHaveText('1')
    }
  })
})
