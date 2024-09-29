# Los Saltos de Bana

## Descripción

Los Saltos de Bana es una aplicación web interactiva que muestra un mapa de GTA San Andreas con todos los saltos únicos del juego. Esta aplicación permite a los usuarios explorar y rastrear los diferentes saltos en el mapa del juego.

## Características

- Mapa interactivo de GTA San Andreas
- Visualización de todos los saltos únicos
- Función de zoom y desplazamiento en el mapa
- Interfaz de usuario intuitiva con tema claro/oscuro
- Lista de saltos con opción de mostrar/ocultar
- Efectos visuales atractivos (confeti en saltos especiales)

## Tecnologías Utilizadas

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand para manejo de estado
- Framer Motion para animaciones
- Radix UI para componentes accesibles
- Vercel Postgres para la base de datos

## Instalación

1. Clona el repositorio:

   ```
   git clone https://github.com/tu-usuario/los-saltos-de-bana.git
   ```

2. Instala las dependencias:

   ```
   cd los-saltos-de-bana
   pnpm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env.local` en la raíz del proyecto y añadi las variables necesarias (consulta `.env.example` si está disponible).

4. Ejecuta el proyecto en modo desarrollo:

   ```
   pnpm dev
   ```

5. Abrí [http://localhost:3000](http://localhost:3000) en el navegador para ver la aplicación.

## Estructura del Proyecto

El proyecto sigue la típica de Next.js App Router:

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── gta-map.tsx
│   ├── sidebar.tsx
│   └── ui/
├── lib/
│   ├── config.ts
│   └── utils.ts
├── stores/
│   └── ui.store.ts
└── provider/
    └── theme-provider.tsx
```

## Contribución

Las contribuciones son bienvenidas. Por favor, abri un issue o un pull request para sugerir cambios o mejoras.
