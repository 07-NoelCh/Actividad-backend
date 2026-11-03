import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { abrirBaseDeDatos } from "../src/db/database";
import { crearApp } from "../src/app";

const B = "/api/v1/usuarios";

describe("API /usuarios (SQLite en memoria)", () => {
  let app: ReturnType<typeof crearApp>;
  let id: number;
  beforeEach(async () => {
    app = crearApp(abrirBaseDeDatos(":memory:"));
    id = (await request(app).post(B).send({ nombre: "Ana Pérez", email: "ana@mail.com" })).body.data.id;
  });

  it("POST 201", async () => {
    const r = await request(app).post(B).send({ nombre: "Luis Gómez", email: "luis@mail.com" });
    expect(r.status).toBe(201);
    expect(r.headers.location).toBe(`${B}/${r.body.data.id}`);
  });
  it("POST 422 con nombre corto o email inválido", async () => {
    const a = await request(app).post(B).send({ nombre: "A", email: "a@mail.com" });
    expect(a.status).toBe(422); expect(a.body.error.code).toBe("INVALID_NAME");
    const b = await request(app).post(B).send({ nombre: "Luis Gómez", email: "no-es-email" });
    expect(b.status).toBe(422); expect(b.body.error.code).toBe("INVALID_EMAIL");
  });
  it("POST 409 con email duplicado", async () => {
    const r = await request(app).post(B).send({ nombre: "Otra Ana", email: "ana@mail.com" });
    expect(r.status).toBe(409);
  });
  it("GET lista y por id (200/404/400)", async () => {
    expect((await request(app).get(B)).body.data).toHaveLength(1);
    expect((await request(app).get(`${B}/${id}`)).status).toBe(200);
    expect((await request(app).get(`${B}/999`)).status).toBe(404);
    expect((await request(app).get(`${B}/abc`)).status).toBe(400);
  });
  it("PUT 200, 404 y 409 si el email es de otro usuario", async () => {
    await request(app).post(B).send({ nombre: "Luis Gómez", email: "luis@mail.com" });
    expect((await request(app).put(`${B}/${id}`).send({ nombre: "Ana P.", email: "ana@mail.com" })).status).toBe(200);
    expect((await request(app).put(`${B}/999`).send({ nombre: "Ana P.", email: "x@mail.com" })).status).toBe(404);
    expect((await request(app).put(`${B}/${id}`).send({ nombre: "Ana P.", email: "luis@mail.com" })).status).toBe(409);
  });
  it("DELETE 204 y luego 404", async () => {
    expect((await request(app).delete(`${B}/${id}`)).status).toBe(204);
    expect((await request(app).get(`${B}/${id}`)).status).toBe(404);
  });
});
