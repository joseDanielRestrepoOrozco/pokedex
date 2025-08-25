import '@testing-library/jest-dom/vitest'
import App from './src/app'

beforeEach(() => {
  document.body.innerHTML = ''
  const divApp = document.createElement('div')
  divApp.id = 'app'
  document.body.appendChild(divApp)
  App()
})