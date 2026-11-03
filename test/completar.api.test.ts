import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { abrirBaseDeDatos } from "../src/db/database";
import { crearApp } from "../src/app";

describe("PATCH /api/v1/tareas/:id/completar (integración, SQLite en memoria)", () => {
  let app: ReturnType<typeof crearApp>;
  let id: number;

  beforeEach(async () => {
    app = crearApp(abrirBaseDeDatos(":memory:"));
    const r = await request(app).post("/api/v1/tareas").send({ titulo: "Estudiar API", prioridad: "alta" });
    id = r.body.data.id;
  });

  it("200 y completada=true para una tarea pendiente", async () => {
    const r = await request(app).patch(`/api/v1/tareas/${id}/completar`);
    expect(r.status).toBe(200);
    expect(r.body.data.completada).toBe(true);
  });
  it("el cambio persiste (GET posterior)", async () => {
    await request(app).patch(`/api/v1/tareas/${id}/completar`);
    const r = await request(app).get(`/api/v1/tareas/${id}`);
    expect(r.body.data.completada).toBe(true);
  });
  it("404 si el id no existe", async () => {
    const r = await request(app).patch("/api/v1/tareas/999/completar");
    expect(r.status).toBe(404);
    expect(r.body.error.code).toBe("TASK_NOT_FOUND");
  });
  it("400 si el id es inválido", async () => {
    const r = await request(app).patch("/api/v1/tareas/abc/completar");
    expect(r.status).toBe(400);
  });
  it("409 si ya estaba completada", async () => {
    await request(app).patch(`/api/v1/tareas/${id}/completar`);
    const r = await request(app).patch(`/api/v1/tareas/${id}/completar`);
    expect(r.status).toBe(409);
    expect(r.body.error.code).toBe("TASK_ALREADY_COMPLETED");
  });
});
