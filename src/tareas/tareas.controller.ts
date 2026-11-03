import type { Request, Response } from "express";
import type { TareasService } from "./tareas.service.js";
import { validarActualizarTarea, validarCrearTarea, validarId, validarReemplazarTarea } from "./tareas.validators.js";

export class TareasController {
  constructor(private readonly service: TareasService) {}

  listar = (_req: Request, res: Response) => {
    res.status(200).json({ data: this.service.obtenerTodas() });
  };

  obtener = (req: Request, res: Response) => {
    const id = validarId(String(req.params.id));
    res.status(200).json({ data: this.service.obtenerPorId(id) });
  };

  crear = (req: Request, res: Response) => {
    const tarea = this.service.crear(validarCrearTarea(req.body));
    res.location(`/api/v1/tareas/${tarea.id}`).status(201).json({ data: tarea });
  };

  eliminar = (req: Request, res: Response) => {
    this.service.eliminar(validarId(String(req.params.id)));
    res.status(204).send();
  };

  completar = (req: Request, res: Response) => {
    const id = validarId(String(req.params.id));
    res.status(200).json({ data: this.service.completar(id) });
  };

  actualizar = (req: Request, res: Response) => {
    const id = validarId(String(req.params.id));
    res.status(200).json({ data: this.service.actualizarParcial(id, validarActualizarTarea(req.body)) });
  };

  reemplazar = (req: Request, res: Response) => {
    const id = validarId(String(req.params.id));
    res.status(200).json({ data: this.service.reemplazar(id, validarReemplazarTarea(req.body)) });
  };
}
