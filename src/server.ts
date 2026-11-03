import { abrirBaseDeDatos } from "./db/database.js";
import { crearApp } from "./app.js";

const app = crearApp(abrirBaseDeDatos("tareas.db"));
app.listen(3000, () => console.log("API en http://localhost:3000/api/v1/tareas"));
