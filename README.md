# Koara — Frontend

Frontend del sistema de facturación y gestión **Koara**, construido con [Next.js](https://nextjs.org), React, TypeScript y Tailwind CSS.

Esta aplicación consume la API del backend de Koara, disponible en:

 **Backend:** [AzaliaFlores19/Koara_backend](https://github.com/AzaliaFlores19/Koara_backend)

## Características

-  **Autenticación** — login, recuperación y restablecimiento de contraseña.
-  **Dashboard** — vista general con métricas del negocio.
-  **Facturación** — creación y gestión de facturas.
-  **Gestión de CAI** — control de rangos y autorizaciones de facturación.
-  **Productos e inventario** — catálogo y categorías.
-  **Clientes y usuarios** — administración de cuentas y permisos.
-  **Carrito de compras** — punto de venta.
-  **Reportes** — ventas, más vendidos, compradores frecuentes.
-  **Registros de auditoría** — historial de acciones.
-  **Branding** — personalización de la empresa.

## Tecnologías

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Axios](https://axios-http.com) para las peticiones HTTP
- [Lucide React](https://lucide.dev) para los iconos

## Requisitos previos

- [Node.js](https://nodejs.org) 18 o superior
- [pnpm](https://pnpm.io) (gestor de paquetes usado en el proyecto)
- El [backend de Koara](https://github.com/AzaliaFlores19/Koara_backend) corriendo localmente o desplegado.

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd koara_frontend

# Instalar dependencias
pnpm install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con la URL de la API del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> Si no se define esta variable, la aplicación usará `http://localhost:4000` por defecto.

## Uso

```bash
# Iniciar el servidor de desarrollo
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

### Otros comandos

```bash
pnpm build   # Compilar para producción
pnpm start   # Iniciar el servidor de producción
pnpm lint    # Ejecutar el linter
```

## Estructura del proyecto

```
src/
├── app/            # Rutas (App Router): autenticación y dashboard
├── components/     # Componentes reutilizables por módulo
├── lib/            # Configuración de API, contextos y tipos
├── services/       # Servicios que consumen la API del backend
└── styles/         # Estilos globales
```

## Proyectos relacionados

- **Backend:** [AzaliaFlores19/Koara_backend](https://github.com/AzaliaFlores19/Koara_backend)
