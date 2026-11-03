# language: es
Característica: Completar una tarea
  Como estudiante
  Quiero marcar una tarea como completada
  Para llevar el control de mi avance

  Escenario: Completar una tarea pendiente
    Dado que existe una tarea "Estudiar API" con prioridad "alta"
    Cuando envío PATCH a "/api/v1/tareas/{id}/completar"
    Entonces la respuesta tiene estado 200
    Y la tarea figura como completada

  Escenario: Completar una tarea inexistente
    Cuando envío PATCH a "/api/v1/tareas/999/completar"
    Entonces la respuesta tiene estado 404
    Y el código de error es "TASK_NOT_FOUND"

  Escenario: Completar dos veces la misma tarea
    Dado que existe una tarea "Estudiar API" con prioridad "alta"
    Y la tarea ya fue completada
    Cuando envío PATCH a "/api/v1/tareas/{id}/completar"
    Entonces la respuesta tiene estado 409
    Y el código de error es "TASK_ALREADY_COMPLETED"
