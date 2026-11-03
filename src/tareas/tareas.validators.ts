import { AppError } from "../errors/app-error.js";
import type { ActualizarTareaDto, CrearTareaDto, Prioridad, ReemplazarTareaDto } from "./tarea.js";
import { exigirObjeto } from "../shared/validators.js";

export { validarId } from "../shared/validators.js";

const PRIORIDADES = ["baja", "media", "alta"];
const tituloValido = (v: unknown) => typeof v === "string" && v.trim().length >= 3;
const prioridadValida = (v: unknown) => typeof v === "string" && PRIORIDADES.includes(v);

export function validarCrearTarea(datos: unknown): CrearTareaDto {
  if (typeof datos !== "object" || datos === null) {
    throw new AppError(400, "INVALID_BODY", "El cuerpo debe ser un objeto JSON");
  }
  const o = datos as Record<string, unknown>;
  if (typeof o.titulo !== "string" || o.titulo.trim().length < 3) {
    throw new AppError(422, "INVALID_TITLE", "El título debe tener al menos tres caracteres");
  }
  const prioridades = ["baja", "media", "alta"];
  if (typeof o.prioridad !== "string" || !prioridades.includes(o.prioridad)) {
    throw new AppError(422, "INVALID_PRIORITY", "La prioridad no es válida");
  }
  return { titulo: o.titulo.trim(), prioridad: o.prioridad as Prioridad };
}

export function validarActualizarTarea(datos: unknown): ActualizarTareaDto {
  const o = exigirObjeto(datos);
  const dto: ActualizarTareaDto = {};
  if (o.titulo !== undefined) {
    if (!tituloValido(o.titulo)) throw new AppError(422, "INVALID_TITLE", "El título debe tener al menos tres caracteres");
    dto.titulo = (o.titulo as string).trim();
  }
  if (o.prioridad !== undefined) {
    if (!prioridadValida(o.prioridad)) throw new AppError(422, "INVALID_PRIORITY", "La prioridad no es válida");
    dto.prioridad = o.prioridad as Prioridad;
  }
  if (o.completada !== undefined) {
    if (typeof o.completada !== "boolean") throw new AppError(422, "INVALID_COMPLETED", "completada debe ser booleano");
    dto.completada = o.completada;
  }
  if (Object.keys(dto).length === 0) {
    throw new AppError(422, "EMPTY_UPDATE", "Debe enviar al menos un campo para modificar");
  }
  return dto;
}

export function validarReemplazarTarea(datos: unknown): ReemplazarTareaDto {
  const o = exigirObjeto(datos);
  if (!tituloValido(o.titulo)) throw new AppError(422, "INVALID_TITLE", "El título debe tener al menos tres caracteres");
  if (!prioridadValida(o.prioridad)) throw new AppError(422, "INVALID_PRIORITY", "La prioridad no es válida");
  if (typeof o.completada !== "boolean") throw new AppError(422, "INVALID_COMPLETED", "completada debe ser booleano");
  return { titulo: (o.titulo as string).trim(), prioridad: o.prioridad as Prioridad, completada: o.completada };
}
