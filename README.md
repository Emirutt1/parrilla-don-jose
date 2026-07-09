# 🔥 Parrilla Don José

Sitio web de un restaurante de asado argentino (ficticio). Estilo rústico
tradicional: maderas oscuras, cuero, tonos tierra y acentos color brasa.
Hecho con **HTML5, CSS3 y JavaScript vanilla** — sin frameworks ni librerías.

## ✨ Características

- **One-page** con scroll suave y navegación por secciones (scrollspy).
- **Hero** con fondo animado de brasas y chispas (CSS puro).
- **Menú tipo libro** animado, con tapa dura y páginas que se dan vuelta.
- **Sección "Nosotros"** con la historia de la casa.
- **Contacto y ubicación** con mapa embebido.
- **Reserva de mesa** con formulario (incluye WhatsApp) y recuadro animado.
- **100% responsive** (PC y celular) con menú hamburguesa en mobile.
- Imágenes optimizadas y con carga diferida (`loading="lazy"`).

## 📁 Estructura

```
.
├── index.html              Página principal (one-page con todas las secciones)
├── css/
│   └── styles.css          Estilos y animaciones
├── js/
│   └── nav.js              Navegación mobile, scrollspy y libro del menú
├── images/                 Fotos (.jpg) e ilustraciones de respaldo (.svg)
└── servidor.ps1            Servidor local para probar en PC y celular
```

## 🚀 Cómo verlo

**Rápido (PC):** doble clic en `index.html`.

**En el celular (misma red WiFi):**

1. Ejecutá el servidor local:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\servidor.ps1
   ```
2. Desde el celular abrí `http://TU-IP-LOCAL:8000`.

## 🖼️ Reemplazar imágenes

Cada foto apunta a un `.jpg` con respaldo automático a una ilustración `.svg`.
Para usar tus fotos reales, guardalas en `images/` con el mismo nombre `.jpg`
(por ejemplo `plato-bife-de-chorizo.jpg`) y se muestran solas.

---

Sitio de demostración. Los datos (dirección, teléfono, precios) son ficticios.
