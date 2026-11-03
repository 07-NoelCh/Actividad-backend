import type { Db } from "../db/database.js";
import type { Tarea } from "./tarea.js";

interface Fila { id: number; titulo: string; prioridad: Tarea["prioridad"]; completada: number; fechaCreacion: string }

const aEntidad = (f: Fila): Tarea => ({ ...f, completada: f.completada === 1 });

export interface TareasRepository {
  guardar(t: Omit<Tarea, "id">): Tarea;
  buscarPorId(id: number): Tarea | undefined;
  obtenerTodas(): Tarea[];
  eliminar(id: number): boolean;
  actualizar(t: Tarea): Tarea;
}

export class TareasSqliteRepository implements TareasRepository {
  constructor(private readonly db: Db) {}

  guardar(t: Omit<Tarea, "id">): Tarea {
    const r = this.db
      .prepare("INSERT INTO tareas (titulo, prioridad, completada, fechaCreacion) VALUES (?,?,?,?)")
      .run(t.titulo, t.prioridad, t.completada ? 1 : 0, t.fechaCreacion);
    return { id: Number(r.lastInsertRowid), ...t };
  }

  buscarPorId(id: number): Tarea | undefined {
    const f = this.db.prepare("SELECT * FROM tareas WHERE id = ?").get(id) as Fila | undefined;
    return f ? aEntidad(f) : undefined;
  }

  obtenerTodas(): Tarea[] {
    return (this.db.prepare("SELECT * FROM tareas ORDER BY id").all() as Fila[]).map(aEntidad);
  }

  eliminar(id: number): boolean {
    return this.db.prepare("DELETE FROM tareas WHERE id = ?").run(id).changes > 0;
  }

  actualizar(t: Tarea): Tarea {
    this.db
      .prepare("UPDATE tareas SET titulo=?, prioridad=?, completada=? WHERE id=?")
      .run(t.titulo, t.prioridad, t.completada ? 1 : 0, t.id);
    return t;
  }
}
