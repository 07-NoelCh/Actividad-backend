import { AppError } from "../errors/app-error.js";
import { exigirObjeto } from "../shared/validators.js";
import type { CategoriaDto } from "./categoria.js";

export function validarCategoria(datos: unknown): CategoriaDto {
  const o = exigirObjeto(datos);
  if (typeof o.nombre !== "string" || o.nombre.trim().length < 3) {
    throw new AppError(422, "INVALID_NAME", "El nombre debe tener al menos tres caracteres");
  }
  if (o.descripcion !== undefined && typeof o.descripcion !== "string") {
    throw new AppError(422, "INVALID_DESCRIPTION", "La descripción debe ser texto");
  }
  return { nombre: o.nombre.trim(), descripcion: (o.descripcion as string | undefined)?.trim() ?? "" };
}
