import { describe, it, expect } from "vitest";
import request from "supertest";
import { abrirBaseDeDatos } from "../src/db/database";
import { crearApp } from "../src/app";

describe("Base existente (Tareas)", () => {
  it("POST crea y GET devuelve 200", async () => {
    const app = crearApp(abrirBaseDeDatos(":memory:"));
    const c = await request(app).post("/api/v1/tareas").send({ titulo: "Estudiar API", prioridad: "alta" });
    expect(c.status).toBe(201);
    const g = await request(app).get(`/api/v1/tareas/${c.body.data.id}`);
    expect(g.status).toBe(200);
  });
});
