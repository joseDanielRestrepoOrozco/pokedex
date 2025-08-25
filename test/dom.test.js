describe('DOM con jsdom', () => {
  test('el contenedor principal existe tras el renderizado', () => {
    const appDiv = document.querySelector('#app')
    expect(appDiv).toBeInTheDocument()
  })

  test('el DOM se resetea entre pruebas', () => {
    const temp = document.createElement('div')
    temp.id = 'temporal'
    document.body.appendChild(temp)
    expect(document.getElementById('temporal')).toBeInTheDocument()
  })

  test('el elemento temporal no existe después del reseteo', () => {
    expect(document.getElementById('temporal')).not.toBeInTheDocument()
    expect(document.querySelector('#app')).toBeInTheDocument()
  })
})
