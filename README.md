

# API de tareas y categorías

Backend en **TypeScript + Express + SQLite** organizado por capas (punto 7 del material), con un endpoint nuevo desarrollado aplicando la técnica **XP (test primero → código)**.



## Requisitos y ejecución

```bash
npm install
npm start          # servidor en http://localhost:3000
npm run dev        # igual, con recarga automática
```

La base se crea sola en el archivo `tareas.db` al iniciar.

## Estructura del proyecto

```
src/
├── app.ts                    # Composición de dependencias y middlewares
├── server.ts                 # Arranque del servidor (puerto 3000)
├── db/
│   └── database.ts           # Conexión SQLite y creación de la tabla
├── errors/
│   └── app-error.ts          # Error de aplicación (status, code, message)
├── middlewares/
│   ├── error-handler.ts      # Respuesta uniforme de errores
│   └── not-found.ts          # 404 para rutas desconocidas
├── shared/
│   └── validators.ts         # validarId y exigirObjeto (reutilizados)
├── categorias/               # categoria, validators, repository, service, controller, routes
├── usuarios/                 # usuario, validators, repository, service, controller, routes
└── tareas/
    ├── tarea.ts              # Entidad y DTO
    ├── tareas.validators.ts  # Validación de cuerpo e id
    ├── tareas.routes.ts      # Rutas
    ├── tareas.controller.ts  # HTTP ↔ servicio
    ├── tareas.service.ts     # Reglas de negocio
    └── tareas.repository.ts  # Acceso a SQLite
test/
├── base.test.ts                  # Prueba del backend base
├── completar.service.test.ts     # Unitarias con repositorio mock
├── completar.api.test.ts         # Integración con Supertest
├── categorias.service.test.ts    # Unitarias (mock)
├── categorias.api.test.ts        # Integración
├── usuarios.service.test.ts      # Unitarias (mock)
├── usuarios.api.test.ts          # Integración
└── tareas.edicion.test.ts        # PUT y PATCH de Tareas
features/
├── completar_tarea.feature       # Escenarios Gherkin (español)
├── categorias.feature
├── usuarios.feature
├── tareas_edicion.feature
├── support/contexto.ts           # Estado compartido entre pasos
└── step_definitions/http.steps.ts
```

## Endpoints

Base: `http://localhost:3000/api/v1`

### Tareas — `/tareas`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/` | Lista todas las tareas | 200 |
| GET | `/:id` | Busca una tarea por id | 200, 400, 404 |
| POST | `/` | Crea una tarea | 201, 400, 422 |
| PUT | `/:id` | Reemplaza la tarea completa (`titulo`, `prioridad`, `completada`) | 200, 400, 404, 422 |
| PATCH | `/:id` | Modifica solo los campos enviados | 200, 400, 404, 422 |
| **PATCH** | **`/:id/completar`** | **Marca como completada (endpoint desarrollado primero con XP)** | **200, 400, 404, 409** |
| DELETE | `/:id` | Elimina una tarea | 204, 400, 404 |

### Categorías — `/categorias`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/` | Lista | 200 |
| GET | `/:id` | Busca por id | 200, 400, 404 |
| POST | `/` | Crea (`nombre` ≥ 3 caracteres, `descripcion` opcional, nombre único) | 201, 422, 409 |
| PUT | `/:id` | Reemplaza | 200, 400, 404, 409, 422 |
| DELETE | `/:id` | Elimina | 204, 400, 404 |

### Usuarios — `/usuarios`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/` | Lista | 200 |
| GET | `/:id` | Busca por id | 200, 400, 404 |
| POST | `/` | Crea (`nombre` ≥ 3 caracteres, `email` válido y único) | 201, 422, 409 |
| PUT | `/:id` | Reemplaza | 200, 400, 404, 409, 422 |
| DELETE | `/:id` | Elimina | 204, 400, 404 |

Cuerpo para crear una tarea: `{ "titulo": "Estudiar API", "prioridad": "alta" }` (prioridad: `baja`, `media` o `alta`).

Formato de error uniforme:

```json
{ "error": { "code": "TASK_NOT_FOUND", "message": "La tarea solicitada no existe", "details": [] } }
```

## Desarrollo del endpoint nuevo con XP

**Historia de usuario:** *Como estudiante quiero marcar una tarea como completada para llevar el control de mi avance.*

**Reglas de negocio:** la tarea debe existir (404); el id debe ser un entero positivo (400); una tarea ya completada no puede completarse de nuevo (409).

### 1. Rojo — el test antes que el código
Se escribieron `completar.service.test.ts` y `completar.api.test.ts`. Al ejecutarlos fallaron 8 tests (`service.completar is not a function` y 404 por ruta inexistente).

### 2. Verde — el código mínimo, de abajo hacia arriba
1. **Repository:** método `actualizar(t)` con `UPDATE` en SQLite.
2. **Service:** `completar(id)` con las reglas 404 y 409.
3. **Controller:** `completar` valida el id y responde 200.
4. **Routes:** `router.patch("/:id/completar", c.completar)`.

Resultado: 9 tests en verde.

### 3. Refactor
Se extrajo `tareaNoEncontrada()` en el servicio para eliminar el error 404 duplicado. Los tests se mantuvieron en verde.

## Pruebas

```bash
npm test          # Vitest: unitarias (mock) + integración (SQLite en memoria)
npm run test:watch
npm run bdd       # Cucumber: escenarios Gherkin
npx tsc --noEmit  # chequeo de tipos
```

| Tipo | Archivos | Qué usa |
|---|---|---|
| Unitaria | `*.service.test.ts` | Repositorio **mock** con datos de prueba |
| Integración | `*.api.test.ts`, `tareas.edicion.test.ts` | Supertest + SQLite `:memory:` |
| Gherkin | `features/*.feature` | Cucumber + Supertest |

Estado final: **36 tests** (Vitest) y **17 escenarios / 82 pasos** (Cucumber), todos en verde.

## Probar con curl y Postman

### curl

```bash
# Crear
curl -i -X POST -H "Content-Type: application/json" \
  -d '{"titulo":"Estudiar API","prioridad":"alta"}' \
  http://localhost:3000/api/v1/tareas

# Completar (endpoint nuevo) → 200
curl -i -X PATCH http://localhost:3000/api/v1/tareas/1/completar

# Repetir → 409 TASK_ALREADY_COMPLETED
curl -i -X PATCH http://localhost:3000/api/v1/tareas/1/completar

# Inexistente → 404 / inválido → 400
curl -i -X PATCH http://localhost:3000/api/v1/tareas/999/completar
curl -i -X PATCH http://localhost:3000/api/v1/tareas/abc/completar

# Verificar
curl http://localhost:3000/api/v1/tareas/1
```

### curl: Categorías, Usuarios y edición de Tareas

```bash
H='Content-Type: application/json'; U=http://localhost:3000/api/v1

# Categorías
curl -i -X POST -H "$H" -d '{"nombre":"Backend","descripcion":"Servidores"}' $U/categorias
curl -i $U/categorias/1
curl -i -X PUT -H "$H" -d '{"nombre":"Servidores","descripcion":"Node"}' $U/categorias/1
curl -i -X DELETE $U/categorias/1

# Usuarios
curl -i -X POST -H "$H" -d '{"nombre":"Ana Pérez","email":"ana@mail.com"}' $U/usuarios
curl -i $U/usuarios/1

# Tareas: edición parcial y total
curl -i -X PATCH -H "$H" -d '{"prioridad":"baja"}' $U/tareas/1
curl -i -X PUT -H "$H" -d '{"titulo":"Informe final","prioridad":"media","completada":true}' $U/tareas/1
```

### Postman

- Método `PATCH`, URL `http://localhost:3000/api/v1/tareas/1/completar`.
- No requiere body ni headers especiales.
- Pestaña *Tests* (opcional): `pm.test("200", () => pm.response.to.have.status(200));`

## CRUD/entidades

| Requisito | Estado |
|---|---|
| Reestructurar con el formato del punto 7 | Hecho (Router → Controller → Service → Repository) |
| Crear 2 entidades nuevas | Hecho: Categorías y Usuarios |
| CRUD completo, incluida búsqueda por id | Hecho en las dos entidades |
| Motor SQLite | Hecho (`better-sqlite3`) |
| Pruebas con datos mock | Hecho (`*.service.test.ts`) |
| Pruebas con Gherkin | Hecho (`features/*.feature`) |


