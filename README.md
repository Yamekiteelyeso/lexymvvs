# Lexy Hub Mvvs

Web para generar tu script: pones tu user, eliges las rarezas, tu webhook y tu script personalizado, y le das a **Crear Script**.

Discord: https://discord.gg/bdJRxfUCrc

## Archivos

- `index.html` — estructura y estilos de la web.
- `index.js` — toda la lógica (verificación de user, rarezas, generación del script, copiar).
- `package.json` — metadatos del proyecto (no hace falta instalar nada para que la web funcione).
- `.nojekyll` — para que GitHub Pages sirva el sitio sin procesarlo.

## Subir a GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `lexy-hub`).
2. Sube estos archivos tal cual a la raíz del repositorio (`index.html`, `index.js`, `package.json`, `README.md` y `.nojekyll`).
3. Ve a **Settings > Pages**, en *Source* elige **Deploy from a branch**, rama **main** y carpeta **/ (root)**, y guarda.
4. En un minuto tu web estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.
