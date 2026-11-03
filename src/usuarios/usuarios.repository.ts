import type { Db } from "../db/database.js";
import type { Usuario } from "./usuario.js";

export interface UsuariosRepository {
  guardar(u: Omit<Usuario, "id">): Usuario;
  buscarPorId(id: number): Usuario | undefined;
  buscarPorEmail(email: string): Usuario | undefined;
  obtenerTodos(): Usuario[];
  actualizar(u: Usuario): Usuario;
  eliminar(id: number): boolean;
}

export class UsuariosSqliteRepository implements UsuariosRepository {
  constructor(private readonly db: Db) {}

  guardar(u: Omit<Usuario, "id">): Usuario {
    const r = this.db.prepare("INSERT INTO usuarios (nombre, email) VALUES (?,?)").run(u.nombre, u.email);
    return { id: Number(r.lastInsertRowid), ...u };
  }
  buscarPorId(id: number) {
    return this.db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id) as Usuario | undefined;
  }
  buscarPorEmail(email: string) {
    return this.db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email) as Usuario | undefined;
  }
  obtenerTodos() {
    return this.db.prepare("SELECT * FROM usuarios ORDER BY id").all() as Usuario[];
  }
  actualizar(u: Usuario): Usuario {
    this.db.prepare("UPDATE usuarios SET nombre=?, email=? WHERE id=?").run(u.nombre, u.email, u.id);
    return u;
  }
  eliminar(id: number): boolean {
    return this.db.prepare("DELETE FROM usuarios WHERE id = ?").run(id).changes > 0;
  }
}
