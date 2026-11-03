import { describe, it, expect, beforeEach } from "vitest";
import { UsuariosService } from "../src/usuarios/usuarios.service";
import type { UsuariosRepository } from "../src/usuarios/usuarios.repository";
import type { Usuario } from "../src/usuarios/usuario";

class RepoMock implements UsuariosRepository {
  datos: Usuario[] = [{ id: 1, nombre: "Ana Pérez", email: "ana@mail.com" }];
  guardar(u: Omit<Usuario, "id">) { const n = { id: this.datos.length + 1, ...u }; this.datos.push(n); return n; }
  buscarPorId(id: number) { return this.datos.find(u => u.id === id); }
  buscarPorEmail(email: string) { return this.datos.find(u => u.email === email); }
  obtenerTodos() { return [...this.datos]; }
  actualizar(u: Usuario) { const i = this.datos.findIndex(x => x.id === u.id); this.datos[i] = u; return u; }
  eliminar(id: number) { const i = this.datos.findIndex(u => u.id === id); if (i < 0) return false; this.datos.splice(i, 1); return true; }
}

describe("UsuariosService (mock)", () => {
  let s: UsuariosService;
  beforeEach(() => { s = new UsuariosService(new RepoMock()); });

  it("crea un usuario", () => {
    expect(s.crear({ nombre: "Luis Gómez", email: "luis@mail.com" })).toMatchObject({ id: 2 });
  });
  it("409 si el email ya existe", () => {
    try { s.crear({ nombre: "Otra Ana", email: "ana@mail.com" }); throw new Error("no lanzó"); }
    catch (e: any) { expect(e.status).toBe(409); expect(e.code).toBe("EMAIL_ALREADY_EXISTS"); }
  });
  it("404 si no existe", () => {
    try { s.obtenerPorId(99); throw new Error("no lanzó"); }
    catch (e: any) { expect(e.status).toBe(404); expect(e.code).toBe("USER_NOT_FOUND"); }
  });
  it("permite actualizar conservando su propio email", () => {
    expect(s.actualizar(1, { nombre: "Ana P.", email: "ana@mail.com" }).nombre).toBe("Ana P.");
  });
  it("elimina", () => { s.eliminar(1); expect(s.obtenerTodos()).toHaveLength(0); });
});
