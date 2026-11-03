import Database from "better-sqlite3";

export type Db = Database.Database;

/** Abre SQLite. Con ":memory:" cada test obtiene una BD limpia. */
export function abrirBaseDeDatos(archivo = "tareas.db"): Db {
  const db = new Database(archivo);
  db.exec(`
    CREATE TABLE IF NOT EXISTS tareas (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo         TEXT NOT NULL,
      prioridad      TEXT NOT NULL CHECK (prioridad IN ('baja','media','alta')),
      completada     INTEGER NOT NULL DEFAULT 0,
      fechaCreacion  TEXT NOT NULL
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS categorias (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre       TEXT NOT NULL UNIQUE COLLATE NOCASE,
      descripcion  TEXT NOT NULL DEFAULT ''
    )
  `);
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre  TEXT NOT NULL,
      email   TEXT NOT NULL UNIQUE
    )
  `);
  return db;
}
