import { AppError } from "../errors/app-error.js";
import type { Categoria, CategoriaDto } from "./categoria.js";
import type { CategoriasRepository } from "./categorias.repository.js";

const noEncontrada = () => new AppError(404, "CATEGORY_NOT_FOUND", "La categoría solicitada no existe");
const duplicada = () => new AppError(409, "CATEGORY_ALREADY_EXISTS", "Ya existe una categoría con ese nombre");

export class CategoriasService {
  constructor(private readonly repository: CategoriasRepository) {}

  crear(dto: CategoriaDto): Categoria {
    if (this.repository.buscarPorNombre(dto.nombre)) throw duplicada();
    return this.repository.guardar(dto);
  }
  obtenerTodas(): Categoria[] { return this.repository.obtenerTodas(); }
  obtenerPorId(id: number): Categoria {
    const c = this.repository.buscarPorId(id);
    if (!c) throw noEncontrada();
    return c;
  }
  actualizar(id: number, dto: CategoriaDto): Categoria {
    this.obtenerPorId(id);
    const otra = this.repository.buscarPorNombre(dto.nombre);
    if (otra && otra.id !== id) throw duplicada();
    return this.repository.actualizar({ id, ...dto });
  }
  eliminar(id: number): void {
    if (!this.repository.eliminar(id)) throw noEncontrada();
  }
}
