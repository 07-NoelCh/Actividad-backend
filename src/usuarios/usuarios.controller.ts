import type { Request, Response } from "express";
import type { UsuariosService } from "./usuarios.service.js";
import { validarUsuario } from "./usuarios.validators.js";
import { validarId } from "../shared/validators.js";

export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  listar = (_req: Request, res: Response) => { res.status(200).json({ data: this.service.obtenerTodos() }); };
  obtener = (req: Request, res: Response) => {
    res.status(200).json({ data: this.service.obtenerPorId(validarId(String(req.params.id))) });
  };
  crear = (req: Request, res: Response) => {
    const u = this.service.crear(validarUsuario(req.body));
    res.location(`/api/v1/usuarios/${u.id}`).status(201).json({ data: u });
  };
  reemplazar = (req: Request, res: Response) => {
    const id = validarId(String(req.params.id));
    res.status(200).json({ data: this.service.actualizar(id, validarUsuario(req.body)) });
  };
  eliminar = (req: Request, res: Response) => {
    this.service.eliminar(validarId(String(req.params.id)));
    res.status(204).send();
  };
}
