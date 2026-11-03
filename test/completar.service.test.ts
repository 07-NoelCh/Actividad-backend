import { describe, it, expect, beforeEach } from "vitest";
import { TareasService } from "../src/tareas/tareas.service";
import type { TareasRepository } from "../src/tareas/tareas.repository";
import type { Tarea } from "../src/tareas/tarea";

// Repositorio MOCK en memoria (datos mock, sin SQLite)
class RepoMock implements TareasRepository {
  datos: Tarea[] = [
    { id: 1, titulo: "Estudiar API", prioridad: "alta", completada: false, fechaCreacion: "2026-11-02T00:00:00.000Z" },
    { id: 2, titulo: "Hacer informe", prioridad: "media", completada: true, fechaCreacion: "2026-11-02T00:00:00.000Z" }
  ];
  guardar(t: Omit<Tarea, "id">) { const n = { id: this.datos.length + 1, ...t }; this.datos.push(n); return n; }
  buscarPorId(id: number) { return this.datos.find(t => t.id === id); }
  obtenerTodas() { return [...this.datos]; }
  eliminar(id: number) { const i = this.datos.findIndex(t => t.id === id); if (i < 0) return false; this.datos.splice(i, 1); return true; }
  actualizar(t: Tarea) { const i = this.datos.findIndex(x => x.id === t.id); this.datos[i] = t; return t; }
}

describe("TareasService.completar (unitario con mock)", () => {
  let service: TareasService;
  beforeEach(() => { service = new TareasService(new RepoMock()); });

  it("marca como completada una tarea pendiente", () => {
    expect(service.completar(1).completada).toBe(true);
  });
  it("lanza 404 si la tarea no existe", () => {
    expect(() => service.completar(99)).toThrowError(/no existe/);
  });
  it("lanza 409 si ya estaba completada", () => {
    try { service.completar(2); throw new Error("no lanzó"); }
    catch (e: any) { expect(e.status).toBe(409); expect(e.code).toBe("TASK_ALREADY_COMPLETED"); }
  });
});
