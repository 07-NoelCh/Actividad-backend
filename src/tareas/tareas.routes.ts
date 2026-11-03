import { Router } from "express";
import type { TareasController } from "./tareas.controller.js";

export function crearTareasRouter(c: TareasController): Router {
  const router = Router();
  router.get("/", c.listar);
  router.get("/:id", c.obtener);
  router.post("/", c.crear);
  router.patch("/:id/completar", c.completar);
  router.patch("/:id", c.actualizar);
  router.put("/:id", c.reemplazar);
  router.delete("/:id", c.eliminar);
  return router;
}
