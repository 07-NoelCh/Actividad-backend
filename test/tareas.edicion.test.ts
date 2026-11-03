import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { abrirBaseDeDatos } from "../src/db/database";
import { crearApp } from "../src/app";

const B = "/api/v1/tareas";

describe("Edición de Tareas: PUT (reemplazo total) y PATCH (parcial)", () => {
  let app: ReturnType<typeof crearApp>;
  let id: number;
  beforeEach(async () => {
    app = crearApp(abrirBaseDeDatos(":memory:"));
    id = (await request(app).post(B).send({ titulo: "Estudiar API", prioridad: "alta" })).body.data.id;
  });

  it("PATCH cambia solo el campo enviado", async () => {
    const r = await request(app).patch(`${B}/${id}`).send({ prioridad: "baja" });
    expect(r.status).toBe(200);
    expect(r.body.data).toMatchObject({ titulo: "Estudiar API", prioridad: "baja", completada: false });
  });
  it("PATCH 422 con prioridad inválida, cuerpo vacío o completada no booleana", async () => {
    expect((await request(app).patch(`${B}/${id}`).send({ prioridad: "urgente" })).status).toBe(422);
    const v = await request(app).patch(`${B}/${id}`).send({});
    expect(v.status).toBe(422); expect(v.body.error.code).toBe("EMPTY_UPDATE");
    expect((await request(app).patch(`${B}/${id}`).send({ completada: "si" })).status).toBe(422);
  });
  it("PATCH 404 y 400", async () => {
    expect((await request(app).patch(`${B}/999`).send({ titulo: "Nuevo título" })).status).toBe(404);
    expect((await request(app).patch(`${B}/abc`).send({ titulo: "Nuevo título" })).status).toBe(400);
  });
  it("PUT reemplaza todos los campos", async () => {
    const r = await request(app).put(`${B}/${id}`).send({ titulo: "Informe final", prioridad: "media", completada: true });
    expect(r.status).toBe(200);
    expect(r.body.data).toMatchObject({ id, titulo: "Informe final", prioridad: "media", completada: true });
  });
  it("PUT 422 si falta un campo y 404 si no existe", async () => {
    expect((await request(app).put(`${B}/${id}`).send({ titulo: "Informe final", prioridad: "media" })).status).toBe(422);
    expect((await request(app).put(`${B}/999`).send({ titulo: "Informe final", prioridad: "media", completada: false })).status).toBe(404);
  });
});
