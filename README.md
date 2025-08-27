#  Pokédex Interactiva

Una aplicación web moderna para explorar el mundo de Pokémon, construida con **Vanilla JavaScript**, **CSS puro** y la **PokéAPI**. Presenta cartas interactivas con animaciones de volteo y un diseño temático inspirado en los colores Pokémon.

## Características

###  Funcionalidades Principales
- **Búsqueda por nombre**: Encuentra cualquier Pokémon escribiendo su nombre
- **Filtrado por tipo**: Explora Pokémon por categorías (Fuego, Agua, Planta, etc.)
- **Vista completa**: Muestra los primeros 151 Pokémon de la región de Kanto
- **Cartas animadas**: Efecto de volteo 3D para revelar estadísticas
- **Diseño responsive**: Optimizado para dispositivos móviles y escritorio

### Diseño Visual
- **Paleta temática**: Colores oficiales Pokémon (Rojo, Azul Cerúleo, Amarillo Dorado)
- **Gradientes dinámicos**: Fondos que reflejan los tipos de Pokémon
- **Indicadores por tipo**: Emojis identificativos para cada tipo (🔥 Fuego, 💧 Agua, etc.)
- **Efectos de luz**: Animaciones de brillo y resplandor
- **Tipografía moderna**: Sistema de fuentes optimizado para legibilidad

###  Información Detallada
- **Estadísticas completas**: HP, Ataque, Defensa, Velocidad, etc.
- **Imágenes oficiales**: Artwork de alta calidad de cada Pokémon
- **Barras de progreso**: Visualización gráfica de las estadísticas
- **Numeración Pokédex**: Números oficiales de la Pokédex Nacional

##  Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica moderna
- **CSS3**: Estilos puros con Flexbox, Grid y animaciones CSS
- **JavaScript (ES6+)**: Funcionalidades dinámicas sin frameworks
- **Vite**: Herramienta de desarrollo y construcción moderna

### API y Datos
- **PokéAPI**: API REST gratuita con datos completos de Pokémon
- **Fetch API**: Peticiones asíncronas nativas del navegador
- **Variables de entorno**: Configuración flexible de endpoints

### Características Técnicas
- **Modularidad**: Código organizado en módulos ES6
- **Lazy Loading**: Carga diferida de imágenes para mejor rendimiento
- **Manejo de errores**: Gestión robusta de fallos de red
- **Accesibilidad**: Navegación por teclado y roles ARIA

##  Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/joseDanielRestrepoOrozco/pokedex.git
cd pokedex
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear un archivo `.env` en la raíz del proyecto:
```env
VITE_POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
Visita `http://localhost:5173`

### Comandos disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de la build
```

## Estructura del Proyecto

```
pokedex/
├── src/
│   ├── main.js              # Punto de entrada principal
│   ├── style.css            # Estilos principales
│   ├── assets/
│   │   └── PokeTitulo.png   # Logo de la aplicación
│   └── data/
│       ├── api.js           # Funciones de API
│       └── helpers.js       # Utilidades auxiliares
├── index.html               # Página principal
├── package.json             # Configuración del proyecto
├── vite.config.js          # Configuración de Vite
├── .env                    # Variables de entorno
└── README.md               # Documentación
```

##  Funcionalidades Detalladas

### Sistema de Cartas
- **Cara frontal**: Nombre, número y estadísticas del Pokémon
- **Cara trasera**: Imagen principal del Pokémon con efectos visuales
- **Animación de volteo**: Transición 3D suave al hacer clic
- **Hover effects**: Efectos de escalado y brillo al pasar el mouse

### Navegación y Filtros
- **Barra de búsqueda**: Autocompletado y búsqueda instantánea
- **Botones de tipo**: Filtrado rápido por categorías
- **Estados activos**: Indicadores visuales del filtro seleccionado
- **Responsive**: Adaptación automática a diferentes tamaños de pantalla

### Optimizaciones de Rendimiento
- **Carga diferida**: Las imágenes se cargan según se necesiten
- **Límites de paginación**: Control de la cantidad de Pokémon mostrados
- **Cache de peticiones**: Evita solicitudes duplicadas
- **Fallbacks de imagen**: Placeholders para imágenes faltantes

##  Personalización

### Variables CSS
El proyecto utiliza variables CSS personalizables:

```css
:root {
  --color-red: #FF0000;
  --color-bu-red: #CC0000;
  --color-cerulean: #3B4CCA;
  --color-golden-yellow: #FFDE00;
  --color-gold-foil: #B3A125;
}
```

### Configuración de la API
Modifica el archivo `.env` para cambiar la URL base:

```js
const BASE_URL = import.meta.env.VITE_POKEAPI_BASE_URL;
```

##  Solución de Problemas

### Errores Comunes

1. **Imágenes no cargan**
   - Verificar conexión a internet
   - Comprobar que la PokéAPI esté disponible

2. **Estilos no se aplican**
   - Reiniciar el servidor de desarrollo
   - Limpiar caché del navegador

3. **Error de CORS**
   - Usar el servidor de desarrollo de Vite
   - No abrir directamente el archivo HTML

##  Contribuciones

### Cómo contribuir
1. Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir un Pull Request

### Estándares de código
- Usar ES6+ features
- Mantener la modularidad
- Comentar código complejo
- Seguir la convención de nombres existente

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

## 🌟 Reconocimientos

- **PokéAPI**: Por proporcionar datos completos y gratuitos de Pokémon
- **The Pokémon Company**: Por crear el universo Pokémon
- **Comunidad de desarrolladores**: Por las contribuciones y feedback

---

## 📞 Contacto

**Desarrollador**: José Daniel Restrepo Orozco  
**GitHub**: [@joseDanielRestrepoOrozco](https://github.com/joseDanielRestrepoOrozco)

---

*¡Gotta catch 'em all! 🔴⚪*
