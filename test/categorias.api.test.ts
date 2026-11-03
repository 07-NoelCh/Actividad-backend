import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { abrirBaseDeDatos } from "../src/db/database";
import { crearApp } from "../src/app";

const B = "/api/v1/categorias";

describe("API /categorias (SQLite en memoria)", () => {
  let app: ReturnType<typeof crearApp>;
  let id: number;
  beforeEach(async () => {
    app = crearApp(abrirBaseDeDatos(":memory:"));
    id = (await request(app).post(B).send({ nombre: "Backend", descripcion: "Servidores" })).body.data.id;
  });

  it("POST 201 con Location", async () => {
    const r = await request(app).post(B).send({ nombre: "Frontend" });
    expect(r.status).toBe(201);
    expect(r.headers.location).toBe(`${B}/${r.body.data.id}`);
    expect(r.body.data.descripcion).toBe("");
  });
  it("POST 422 si el nombre es corto", async () => {
    const r = await request(app).post(B).send({ nombre: "ab" });
    expect(r.status).toBe(422);
    expect(r.body.error.code).toBe("INVALID_NAME");
  });
  it("POST 409 si el nombre está duplicado", async () => {
    const r = await request(app).post(B).send({ nombre: "Backend" });
    expect(r.status).toBe(409);
  });
  it("GET lista 200", async () => {
    const r = await request(app).get(B);
    expect(r.status).toBe(200);
    expect(r.body.data).toHaveLength(1);
  });
  it("GET por id: 200, 404 y 400", async () => {
    expect((await request(app).get(`${B}/${id}`)).status).toBe(200);
    expect((await request(app).get(`${B}/999`)).status).toBe(404);
    expect((await request(app).get(`${B}/abc`)).status).toBe(400);
  });
  it("PUT reemplaza (200), 404 y 422", async () => {
    const r = await request(app).put(`${B}/${id}`).send({ nombre: "Servidores", descripcion: "API" });
    expect(r.status).toBe(200);
    expect(r.body.data.nombre).toBe("Servidores");
    expect((await request(app).put(`${B}/999`).send({ nombre: "Servidores" })).status).toBe(404);
    expect((await request(app).put(`${B}/${id}`).send({ nombre: "" })).status).toBe(422);
  });
  it("DELETE 204 y luego GET 404", async () => {
    expect((await request(app).delete(`${B}/${id}`)).status).toBe(204);
    expect((await request(app).get(`${B}/${id}`)).status).toBe(404);
    expect((await request(app).delete(`${B}/${id}`)).status).toBe(404);
  });
});
