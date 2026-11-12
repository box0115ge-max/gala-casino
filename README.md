# Gala Casino · Grupo Emmi

Invitación interactiva de una sola página. La superficie plateada se raspa arrastrando el dedo o el mouse. Al borrar el 45 % del área válida se completa la revelación y se guardan los detalles visibles durante la sesión.

## Ejecutar en local

Requiere Node.js 22.12 o posterior. Desde la carpeta del proyecto, ejecuta estos comandos y abre la dirección que imprime Vite.

```sh
npm ci
npm run dev
```

Para verificar tipos, compilar y revisar la versión de producción, ejecuta los siguientes comandos.

```sh
npm run check
npm run build
npm run preview
```

## Editar los detalles de la invitación

Edita `src/config/event.ts` para cambiar el título revelado, el organizador, la fecha, la hora, el lugar, el mensaje y el texto del raspadito. `revealThreshold` determina qué fracción se debe raspar y `persistReveal: false` permite repetir la revelación tras cada recarga. Los rótulos ilustrados se actualizan reemplazando los archivos indicados en `assets.manifest.json`.

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a la raíz de un repositorio de GitHub con la rama `main`.
2. Abre **Settings → Pages** y selecciona **GitHub Actions** en **Source**. [Guía de configuración de GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
3. Haz push a `main` o ejecuta **Publicar Gala Casino en GitHub Pages** desde **Actions**. El flujo instala con `npm ci`, verifica TypeScript, genera `dist/` y lo publica en Pages.
4. Abre la URL que informa el trabajo `deploy`. Las rutas relativas funcionan dentro del subdirectorio del repositorio.

## Composición y accesibilidad

Las capas se posicionan sobre un lienzo de diseño de 1086 × 1448, en proporción 3:4. `src/config/artwork.ts` contiene sus coordenadas. Las luces del marco y el letrero se animan por grupos. La ruleta conserva el ángulo del póster como un recorte fijo.

El Canvas usa `destination-out`, interpolación entre puntos y una máscara de muestreo que conserva el raspado al cambiar el tamaño de la ventana. Con teclado, pulsa `Tab` para mostrar **Revelar mi invitación** y actívalo con `Enter` o la barra espaciadora. Tras la revelación se anuncian los detalles. La página respeta `prefers-reduced-motion`.

## Recursos gráficos

`assets.manifest.json` documenta los archivos, su procedencia y las variantes WebP que carga la página cuando el navegador las admite. El SVG aportado incluye los nueve logos del pie, disponibles también por separado. El logotipo principal es un recorte WebP transparente del póster. Para sustituirlo por un SVG oficial hace falta el archivo vectorial de Grupo Emmi.

## Verificación

Se ejecutaron `npm ci`, `npm run check` y `npm run build`. En Edge se verificaron el raspado con mouse y tacto emulado, la revelación automática, la persistencia al recargar, el redimensionado, el acceso por teclado y el movimiento reducido. Firefox y WebKit verificaron la composición, el raspado parcial y el acceso por teclado a 390 px. La compilación se sirvió bajo una subruta de prueba equivalente a la de un repositorio en GitHub Pages.
