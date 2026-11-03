import { AppError } from "../errors/app-error.js";

export function validarId(valor: string): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "INVALID_ID", "El id debe ser un entero positivo");
  }
  return id;
}

export function exigirObjeto(datos: unknown): Record<string, unknown> {
  if (typeof datos !== "object" || datos === null || Array.isArray(datos)) {
    throw new AppError(400, "INVALID_BODY", "El cuerpo debe ser un objeto JSON");
  }
  return datos as Record<string, unknown>;
}
