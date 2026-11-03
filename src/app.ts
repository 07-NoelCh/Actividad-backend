import express from "express";
import type { Db } from "./db/database.js";
import { TareasSqliteRepository } from "./tareas/tareas.repository.js";
import { TareasService } from "./tareas/tareas.service.js";
import { TareasController } from "./tareas/tareas.controller.js";
import { crearTareasRouter } from "./tareas/tareas.routes.js";
import { CategoriasSqliteRepository } from "./categorias/categorias.repository.js";
import { CategoriasService } from "./categorias/categorias.service.js";
import { CategoriasController } from "./categorias/categorias.controller.js";
import { crearCategoriasRouter } from "./categorias/categorias.routes.js";
import { UsuariosSqliteRepository } from "./usuarios/usuarios.repository.js";
import { UsuariosService } from "./usuarios/usuarios.service.js";
import { UsuariosController } from "./usuarios/usuarios.controller.js";
import { crearUsuariosRouter } from "./usuarios/usuarios.routes.js";
import { notFound } from "./middlewares/not-found.js";
import { errorHandler } from "./middlewares/error-handler.js";

/** Composición de dependencias (inyección por constructor). */
export function crearApp(db: Db) {
  const repository = new TareasSqliteRepository(db);
  const service = new TareasService(repository);
  const controller = new TareasController(service);

  const categorias = new CategoriasController(new CategoriasService(new CategoriasSqliteRepository(db)));
  const usuarios = new UsuariosController(new UsuariosService(new UsuariosSqliteRepository(db)));

  const app = express();
  app.use(express.json());
  app.use("/api/v1/tareas", crearTareasRouter(controller));
  app.use("/api/v1/categorias", crearCategoriasRouter(categorias));
  app.use("/api/v1/usuarios", crearUsuariosRouter(usuarios));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
