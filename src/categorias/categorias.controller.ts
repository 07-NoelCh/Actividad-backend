import type { Request, Response } from "express";
import type { CategoriasService } from "./categorias.service.js";
import { validarCategoria } from "./categorias.validators.js";
import { validarId } from "../shared/validators.js";

export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  listar = (_req: Request, res: Response) => { res.status(200).json({ data: this.service.obtenerTodas() }); };
  obtener = (req: Request, res: Response) => {
    res.status(200).json({ data: this.service.obtenerPorId(validarId(String(req.params.id))) });
  };
  crear = (req: Request, res: Response) => {
    const c = this.service.crear(validarCategoria(req.body));
    res.location(`/api/v1/categorias/${c.id}`).status(201).json({ data: c });
  };
  reemplazar = (req: Request, res: Response) => {
    const id = validarId(String(req.params.id));
    res.status(200).json({ data: this.service.actualizar(id, validarCategoria(req.body)) });
  };
  eliminar = (req: Request, res: Response) => {
    this.service.eliminar(validarId(String(req.params.id)));
    res.status(204).send();
  };
}
