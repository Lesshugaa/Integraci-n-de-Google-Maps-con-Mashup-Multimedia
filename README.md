# Actividad 13 — Google Maps + Mashup Multimedia

Proyecto educativo que integra **Google Maps** con un “dock” multimedia (imagen, audio, video y YouTube) sincronizado con marcadores y una lista de puntos de interés.

## Estructura
.
├─ index.html
├─ styles.css
└─ script.js

## Requisitos
- Navegador moderno.
- Conexión a Internet.
- Clave de la **Google Maps JavaScript API** (y habilitar “Places API”).

## Configuración de la clave
1) Ve a https://console.cloud.google.com/
2) Crea un proyecto, habilita **Maps JavaScript API** y **Places API**.
3) Crea una API Key y restríngela por dominio (recomendado).
4) En `index.html`, reemplaza `YOUR_API_KEY` en la URL del script de Google Maps.

## Uso
1) Abre `index.html`.
2) Escribe en la caja de búsqueda para usar **Autocomplete** (Places).
3) Haz clic en un elemento de la **lista** o en un **marcador** del mapa.
4) El **Dock** mostrará el medio asociado (imagen, audio, video o YouTube) y podrás reproducir/pausar o pasar al anterior/siguiente.

## Personalización
- Edita el arreglo `poiData` en `script.js` para agregar/quitar puntos, cambiar títulos, coordenadas y medios (`image`, `audio`, `video`, `youtube`).
- Si deseas un estilo de mapa personalizado, puedes usar un `mapId` de Cloud Console con estilos.

## Notas
- Los enlaces de imagen/audio/video vienen con URLs de ejemplo públicas y pueden ser sustituidos por tus propios recursos.
- Si trabajas offline, deberás alojar tus medios localmente y no tendrás Autocomplete.

## Créditos
- Google Maps JavaScript API
- Places API
