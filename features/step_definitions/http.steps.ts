import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import request from "supertest";
import { ctx } from "../support/contexto";

const ruta = (r: string) => r.replace("{id}", String(ctx.id));

// ----- Dado -----
Given("que existe una tarea {string} con prioridad {string}", async (titulo: string, prioridad: string) => {
  ctx.id = (await request(ctx.app).post("/api/v1/tareas").send({ titulo, prioridad })).body.data.id;
});
Given("la tarea ya fue completada", async () => {
  await request(ctx.app).patch(`/api/v1/tareas/${ctx.id}/completar`);
});
Given("que existe una categoría {string}", async (nombre: string) => {
  ctx.id = (await request(ctx.app).post("/api/v1/categorias").send({ nombre })).body.data.id;
});
Given("que existe un usuario {string} con email {string}", async (nombre: string, email: string) => {
  ctx.id = (await request(ctx.app).post("/api/v1/usuarios").send({ nombre, email })).body.data.id;
});

// ----- Cuando -----
When("envío {word} a {string}", async (metodo: string, r: string) => {
  ctx.res = await (request(ctx.app) as any)[metodo.toLowerCase()](ruta(r));
});
When("envío {word} a {string} con el cuerpo:", async (metodo: string, r: string, cuerpo: string) => {
  ctx.res = await (request(ctx.app) as any)[metodo.toLowerCase()](ruta(r)).send(JSON.parse(cuerpo));
});

// ----- Entonces -----
Then("la respuesta tiene estado {int}", (estado: number) => { assert.equal(ctx.res.status, estado); });
Then("el código de error es {string}", (codigo: string) => { assert.equal(ctx.res.body.error.code, codigo); });
Then("la tarea figura como completada", () => { assert.equal(ctx.res.body.data.completada, true); });
Then("el campo {string} vale {string}", (campo: string, valor: string) => {
  assert.equal(String(ctx.res.body.data[campo]), valor);
});
