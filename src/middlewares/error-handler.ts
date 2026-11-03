import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.status).json({
      error: { code: error.code, message: error.message, details: error.details }
    });
    return;
  }
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: { code: "INVALID_JSON", message: "JSON mal formado", details: [] } });
    return;
  }
  console.error(error);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Ocurrió un error interno" } });
};
