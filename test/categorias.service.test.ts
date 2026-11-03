import { describe, it, expect, beforeEach } from "vitest";
import { CategoriasService } from "../src/categorias/categorias.service";
import type { CategoriasRepository } from "../src/categorias/categorias.repository";
import type { Categoria } from "../src/categorias/categoria";

class RepoMock implements CategoriasRepository {
  datos: Categoria[] = [{ id: 1, nombre: "Backend", descripcion: "Servidores" }];
  guardar(c: Omit<Categoria, "id">) { const n = { id: this.datos.length + 1, ...c }; this.datos.push(n); return n; }
  buscarPorId(id: number) { return this.datos.find(c => c.id === id); }
  buscarPorNombre(nombre: string) { return this.datos.find(c => c.nombre.toLowerCase() === nombre.toLowerCase()); }
  obtenerTodas() { return [...this.datos]; }
  actualizar(c: Categoria) { const i = this.datos.findIndex(x => x.id === c.id); this.datos[i] = c; return c; }
  eliminar(id: number) { const i = this.datos.findIndex(c => c.id === id); if (i < 0) return false; this.datos.splice(i, 1); return true; }
}

describe("CategoriasService (mock)", () => {
  let s: CategoriasService;
  beforeEach(() => { s = new CategoriasService(new RepoMock()); });

  it("crea una categoría", () => {
    const c = s.crear({ nombre: "Frontend", descripcion: "UI" });
    expect(c).toMatchObject({ id: 2, nombre: "Frontend" });
  });
  it("409 si el nombre ya existe", () => {
    try { s.crear({ nombre: "backend", descripcion: "" }); throw new Error("no lanzó"); }
    catch (e: any) { expect(e.status).toBe(409); expect(e.code).toBe("CATEGORY_ALREADY_EXISTS"); }
  });
  it("404 al buscar una inexistente", () => {
    try { s.obtenerPorId(99); throw new Error("no lanzó"); }
    catch (e: any) { expect(e.status).toBe(404); expect(e.code).toBe("CATEGORY_NOT_FOUND"); }
  });
  it("actualiza y elimina", () => {
    expect(s.actualizar(1, { nombre: "Servidores", descripcion: "x" }).nombre).toBe("Servidores");
    s.eliminar(1);
    expect(s.obtenerTodas()).toHaveLength(0);
  });
});
