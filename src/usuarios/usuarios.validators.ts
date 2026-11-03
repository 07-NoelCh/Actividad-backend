import { AppError } from "../errors/app-error.js";
import { exigirObjeto } from "../shared/validators.js";
import type { UsuarioDto } from "./usuario.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarUsuario(datos: unknown): UsuarioDto {
  const o = exigirObjeto(datos);
  if (typeof o.nombre !== "string" || o.nombre.trim().length < 3) {
    throw new AppError(422, "INVALID_NAME", "El nombre debe tener al menos tres caracteres");
  }
  if (typeof o.email !== "string" || !EMAIL.test(o.email.trim())) {
    throw new AppError(422, "INVALID_EMAIL", "El email no tiene un formato válido");
  }
  return { nombre: o.nombre.trim(), email: o.email.trim().toLowerCase() };
}
