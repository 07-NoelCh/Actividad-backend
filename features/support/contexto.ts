import { Before } from "@cucumber/cucumber";
import type request from "supertest";
import { abrirBaseDeDatos } from "../../src/db/database";
import { crearApp } from "../../src/app";

/** Estado compartido entre los pasos de un escenario. */
export const ctx = {} as { app: ReturnType<typeof crearApp>; id: number; res: request.Response };

Before(() => { ctx.app = crearApp(abrirBaseDeDatos(":memory:")); ctx.id = 0; });
