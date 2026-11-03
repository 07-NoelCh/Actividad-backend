import { AppError } from "../errors/app-error.js";
import type { ActualizarTareaDto, CrearTareaDto, ReemplazarTareaDto, Tarea } from "./tarea.js";
import type { TareasRepository } from "./tareas.repository.js";

const tareaNoEncontrada = () =>
  new AppError(404, "TASK_NOT_FOUND", "La tarea solicitada no existe");

export class TareasService {
  constructor(private readonly repository: TareasRepository) {}

  crear(dto: CrearTareaDto): Tarea {
    return this.repository.guardar({
      titulo: dto.titulo,
      prioridad: dto.prioridad,
      completada: false,
      fechaCreacion: new Date().toISOString()
    });
  }

  obtenerTodas(): Tarea[] {
    return this.repository.obtenerTodas();
  }

  obtenerPorId(id: number): Tarea {
    const tarea = this.repository.buscarPorId(id);
    if (!tarea) throw tareaNoEncontrada();
    return tarea;
  }

  eliminar(id: number): void {
    if (!this.repository.eliminar(id)) {
      throw tareaNoEncontrada();
    }
  }

  completar(id: number): Tarea {
    const tarea = this.obtenerPorId(id); // lanza 404 si no existe
    if (tarea.completada) {
      throw new AppError(409, "TASK_ALREADY_COMPLETED", "La tarea ya estaba completada");
    }
    return this.repository.actualizar({ ...tarea, completada: true });
  }

  actualizarParcial(id: number, dto: ActualizarTareaDto): Tarea {
    const tarea = this.obtenerPorId(id);
    return this.repository.actualizar({ ...tarea, ...dto });
  }

  reemplazar(id: number, dto: ReemplazarTareaDto): Tarea {
    const tarea = this.obtenerPorId(id);
    return this.repository.actualizar({ ...tarea, ...dto });
  }
}
