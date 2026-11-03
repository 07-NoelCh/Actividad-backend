import { Router } from "express";
import type { UsuariosController } from "./usuarios.controller.js";

export function crearUsuariosRouter(c: UsuariosController): Router {
  const r = Router();
  r.get("/", c.listar);
  r.get("/:id", c.obtener);
  r.post("/", c.crear);
  r.put("/:id", c.reemplazar);
  r.delete("/:id", c.eliminar);
  return r;
}
