export type Prioridad = "baja" | "media" | "alta";

export interface Tarea {
  id: number;
  titulo: string;
  prioridad: Prioridad;
  completada: boolean;
  fechaCreacion: string;
}

export interface CrearTareaDto {
  titulo: string;
  prioridad: Prioridad;
}

export interface ActualizarTareaDto {
  titulo?: string;
  prioridad?: Prioridad;
  completada?: boolean;
}

export interface ReemplazarTareaDto {
  titulo: string;
  prioridad: Prioridad;
  completada: boolean;
}
