# TaskFlow - Frontend Developer Technical Test

Este repositorio contiene la solución a la prueba técnica para la posición de Frontend Developer en **Orquestia**. 
La aplicación, denominada **TaskFlow**, es un gestor de tareas que integra un CRUD completo consumiendo la API pública de DummyJSON.

## 🚀 Guía de Instalación y Uso

El proyecto está configurado para ejecutarse localmente de forma sencilla siguiendo estos pasos:

1. **Clonar el repositorio:**
```bash   
git clone https://github.com/CAMIMONTEALE/pt-taskflow-Camila-Montealegre.git

```

2. **Instalar dependencias:**
Este proyecto requiere **pnpm** como gestor de paquetes.

```bash
pnpm install

```

3. **Configurar variables de entorno:**
Crea un archivo `.env.local` en la raíz del proyecto basándote en el archivo `.env.example` incluido.

```bash
NEXT_PUBLIC_API_URL=[https://dummyjson.com](https://dummyjson.com)

```

4. **Ejecutar en desarrollo:**
```bash
pnpm dev

```
La aplicación estará disponible en `http://localhost:3000`.

---

## 🛠️ Stack Tecnológico


**Framework:** Next.js (App Router).

**Lenguaje:** TypeScript (Tipado estricto).

**Estilos:** Tailwind CSS.

**Manejo de Estado y Fetching:** TanStack Query (React Query).

**Componentes de UI:** shadcn/ui (basado en Radix UI).

**Iconografía:** Lucide React.

**Calidad de Código:** ESLint y Prettier.


---

## 📝 Justificación Técnica y Decisiones de Arquitectura

Para cumplir con los objetivos de evaluación sobre código limpio y mantenibilidad, se tomaron las siguientes decisiones:

### 1. Manejo de Estado Híbrido (TanStack Query)

Se seleccionó **TanStack Query** para gestionar el estado del servidor:

**Sincronización:** Dado que la API de DummyJSON no persiste cambios en el servidor (POST, PUT, DELETE), se utiliza la caché de Query para simular la persistencia local tras operaciones exitosas, asegurando que la UI refleje los cambios inmediatamente.

**Estados de UI:** Maneja de forma nativa los estados de `loading`, `error` y éxito, permitiendo mostrar Skeletons o mensajes de error con opción de reintento.


### 2. Actualizaciones Optimistas (Optimistic Updates)

Para la funcionalidad de marcar tareas como completadas o pendientes, se implementaron **Optimistic Updates**:

**Justificación:** Mejora la experiencia de usuario al reflejar el cambio en la UI de forma instantánea. En caso de que la API falle, el sistema realiza un *rollback* al estado anterior para mantener la integridad de la información.

### 3. Modularización y Capas de Responsabilidad

**Custom Hooks:** Toda la lógica de fetching y mutaciones reside en hooks personalizados, separándola completamente de los componentes de UI.
**Componentes Reutilizables:** Se desarrollaron componentes independientes como `<TodoItem />`, `<EmptyState />` y `<LoadingWrapper />` para garantizar la consistencia y escalabilidad del código.

### 4. Calidad y Validación

**Tipado Estricto:** Se definieron interfaces de TypeScript para todos los modelos de la API, evitando el uso de `any` para garantizar la seguridad del código.

**Gitflow:** Se mantiene un historial de commits descriptivo, siguiendo el progreso funcionalidad por funcionalidad.

---

## 🎨 Funcionalidades Implementadas

**Listado Paginado:** Carga de tareas desde `/todos` con paginación de 10 elementos por página.

**CRUD Completo:** Creación (POST), actualización de estado (PATCH) y eliminación (DELETE) de tareas.

**Confirmación de Acción:** Diálogos de confirmación antes de eliminar tareas para evitar acciones accidentales.

**Filtro Local:** Filtrado dinámico por estado (Todas, Completadas, Pendientes) aplicado sobre el listado actual sin llamadas extra a la API.

---

Desplegado en **Vercel**

https://prueba-camila-orquestia.vercel.app/

```

