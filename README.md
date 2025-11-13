# 🎬 MovieHub Frontend (Angular 20)

**MovieHub** es la interfaz web desarrollada en **Angular 20** (standalone components) para la plataforma MovieHub, un sistema de gestión y visualización de películas conectado a un backend basado en microservicios **Spring Boot + Spring Cloud**.

> 🔗 Este frontend se comunica con el [backend de MovieHub](https://github.com/MarquezJesus24/MovieHub/tree/master) mediante el **API Gateway (puerto 8080)**.

---

## 🧱 Tabla de contenidos
- [Requisitos](#requisitos)
- [Estructura del-proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Rutas principales](#rutas-principales)
- [Problemas frecuentes](#problemas-frecuentes)
- [Notas de desarrollo](#notas-de-desarrollo)
- [Enlace al backend](#enlace-al-backend)

---

## ⚙️ Requisitos

| Herramienta | Versión recomendada |
|--------------|--------------------|
| Node.js | 20.x |
| npm | 10+ |
| Angular CLI | 20.x |
| Git | Última versión |

Instalar Angular CLI (si no la tienes):

```bash
npm install -g @angular/cli@20
```

Verifica tus versiones:

```bash
node -v
npm -v
ng version
```

---

## 📁 Estructura del proyecto

```text
moviehub-frontend/
├─ src/
│  ├─ app/                  # Componentes standalone y servicios
│  ├─ environments/         # Configuración por entorno
│  └─ main.ts
├─ package.json
└─ angular.json
```

---

## 🔧 Configuración

Archivo clave: `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api' // ⚠️ sin barra final
};
```

> **Importante:** No agregues una barra final (`/`) al `apiUrl`, ya que puede causar errores 404 en Spring Boot 3.

---

## ▶️ Ejecución

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   ng serve
   ```

3. Abre el navegador en:  
   👉 [http://localhost:4200](http://localhost:4200)

El frontend consumirá la API a través del **API Gateway (http://localhost:8080)**.

---

## 🌐 Rutas principales

| Sección | URL |
|----------|-----|
| Catálogo público | `/catalog` |
| Detalle de película | `/movie/:id` |
| Administración | `/admin/movies` |

---

## 🧩 Integración con el backend

El frontend se comunica con el **API Gateway** del backend de MovieHub.  
Asegúrate de que todos los microservicios y el Gateway estén corriendo antes de levantar Angular.

> Ver documentación completa del backend:  
> 🔗 [MovieHub Backend — Microservicios Spring Boot](https://github.com/MarquezJesus24/MovieHub/tree/master)

---

## 🧰 Problemas frecuentes

| Problema | Solución |
|-----------|-----------|
| ❌ *404 desde Angular, pero Postman funciona* | Revisa que `environment.apiUrl` no tenga barra final `/`. |
| ⚠️ *Error CORS* | Verifica que el backend (API Gateway) tenga CORS habilitado para `http://localhost:4200`. |
| 🚫 *"Could not resolve @angular/animations"* | Instala la dependencia: `npm i @angular/animations@20.x`. |
| ⚙️ *Backend no responde (503)* | Asegúrate de que Eureka y el API Gateway estén en ejecución. |

---

## 🧠 Notas de desarrollo

- Proyecto Angular 20 con **Standalone Components** y control de flujo moderno (`@if`, `@for`).
- Usa **environment.ts** para configurar URLs.
- Evita hardcodear puertos en componentes.
- Si agregas nuevas rutas de API, actualiza `environment.apiUrl`.

---

## 🧱 Stack

- **Frontend:** Angular 20 + TypeScript  
- **Backend:** Spring Boot 3 + Spring Cloud  
- **Comunicación:** HTTP a través del API Gateway  

---

## 🔗 Enlace al backend

➡️ [Ver README del backend (Spring Boot)](https://github.com/MarquezJesus24/MovieHub/tree/master)
