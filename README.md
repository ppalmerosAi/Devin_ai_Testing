# Mis gastos

App web minimalista para registrar gastos **diarios, semanales y mensuales**. No usa base de datos: todo se guarda en el `localStorage` del navegador.

## Características

- Alta rápida de gastos (importe, fecha, categoría, nota).
- Vistas por día / semana / mes con navegación entre periodos.
- Total del periodo, desglose por categoría y evolución en gráficos.
- Exportar a JSON o CSV e importar desde JSON (respaldo y migración entre dispositivos).
- Selector de moneda (EUR, USD, MXN, GBP).

## Stack

Vite + React + TypeScript + Tailwind CSS + Recharts. Sin backend: build estático desplegable en Vercel, Netlify o GitHub Pages.

## Uso

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # previsualizar el build
npm run lint
```
