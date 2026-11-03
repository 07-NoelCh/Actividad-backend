import { AppError } from "../errors/app-error.js";
import type { Usuario, UsuarioDto } from "./usuario.js";
import type { UsuariosRepository } from "./usuarios.repository.js";

const noEncontrado = () => new AppError(404, "USER_NOT_FOUND", "El usuario solicitado no existe");
const emailDuplicado = () => new AppError(409, "EMAIL_ALREADY_EXISTS", "Ya existe un usuario con ese email");

export class UsuariosService {
  constructor(private readonly repository: UsuariosRepository) {}

  crear(dto: UsuarioDto): Usuario {
    if (this.repository.buscarPorEmail(dto.email)) throw emailDuplicado();
    return this.repository.guardar(dto);
  }
  obtenerTodos(): Usuario[] { return this.repository.obtenerTodos(); }
  obtenerPorId(id: number): Usuario {
    const u = this.repository.buscarPorId(id);
    if (!u) throw noEncontrado();
    return u;
  }
  actualizar(id: number, dto: UsuarioDto): Usuario {
    this.obtenerPorId(id);
    const otro = this.repository.buscarPorEmail(dto.email);
    if (otro && otro.id !== id) throw emailDuplicado();
    return this.repository.actualizar({ id, ...dto });
  }
  eliminar(id: number): void {
    if (!this.repository.eliminar(id)) throw noEncontrado();
  }
}
