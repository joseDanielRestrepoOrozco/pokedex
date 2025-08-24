# Pokedex

## Configuración de variables de entorno

Este proyecto utiliza variables de entorno para definir la URL base de la PokeAPI. Esto permite cambiar fácilmente el endpoint de la API sin modificar el código fuente.

### Archivo `.env`

Asegúrate de tener un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
VITE_POKEAPI_BASE_URL=https://pokeapi.co/api/v2
```

Si necesitas cambiar la URL (por ejemplo, para pruebas), solo modifica este valor.

### Uso en el código

La variable se accede en el código mediante:

```js
const BASE_URL = import.meta.env.VITE_POKEAPI_BASE_URL;
```

---

## Notas

- Si cambias el valor en `.env`, reinicia el servidor de desarrollo de Vite para que los cambios tengan efecto.
- No subas archivos `.env` con datos sensibles a repositorios públicos.
