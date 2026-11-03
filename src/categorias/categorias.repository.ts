import type { Db } from "../db/database.js";
import type { Categoria } from "./categoria.js";

export interface CategoriasRepository {
  guardar(c: Omit<Categoria, "id">): Categoria;
  buscarPorId(id: number): Categoria | undefined;
  buscarPorNombre(nombre: string): Categoria | undefined;
  obtenerTodas(): Categoria[];
  actualizar(c: Categoria): Categoria;
  eliminar(id: number): boolean;
}

export class CategoriasSqliteRepository implements CategoriasRepository {
  constructor(private readonly db: Db) {}

  guardar(c: Omit<Categoria, "id">): Categoria {
    const r = this.db.prepare("INSERT INTO categorias (nombre, descripcion) VALUES (?,?)").run(c.nombre, c.descripcion);
    return { id: Number(r.lastInsertRowid), ...c };
  }
  buscarPorId(id: number) {
    return this.db.prepare("SELECT * FROM categorias WHERE id = ?").get(id) as Categoria | undefined;
  }
  buscarPorNombre(nombre: string) {
    return this.db.prepare("SELECT * FROM categorias WHERE nombre = ?").get(nombre) as Categoria | undefined;
  }
  obtenerTodas() {
    return this.db.prepare("SELECT * FROM categorias ORDER BY id").all() as Categoria[];
  }
  actualizar(c: Categoria): Categoria {
    this.db.prepare("UPDATE categorias SET nombre=?, descripcion=? WHERE id=?").run(c.nombre, c.descripcion, c.id);
    return c;
  }
  eliminar(id: number): boolean {
    return this.db.prepare("DELETE FROM categorias WHERE id = ?").run(id).changes > 0;
  }
}
