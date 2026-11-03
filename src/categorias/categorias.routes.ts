import { Router } from "express";
import type { CategoriasController } from "./categorias.controller.js";

export function crearCategoriasRouter(c: CategoriasController): Router {
  const r = Router();
  r.get("/", c.listar);
  r.get("/:id", c.obtener);
  r.post("/", c.crear);
  r.put("/:id", c.reemplazar);
  r.delete("/:id", c.eliminar);
  return r;
}
