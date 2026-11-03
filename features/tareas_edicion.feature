# language: es
Característica: Edición de tareas
  Como estudiante
  Quiero modificar mis tareas
  Para mantener la información actualizada

  Escenario: Cambiar solo la prioridad con PATCH
    Dado que existe una tarea "Estudiar API" con prioridad "alta"
    Cuando envío PATCH a "/api/v1/tareas/{id}" con el cuerpo:
      """
      {"prioridad": "baja"}
      """
    Entonces la respuesta tiene estado 200
    Y el campo "prioridad" vale "baja"
    Y el campo "titulo" vale "Estudiar API"

  Escenario: PATCH sin campos
    Dado que existe una tarea "Estudiar API" con prioridad "alta"
    Cuando envío PATCH a "/api/v1/tareas/{id}" con el cuerpo:
      """
      {}
      """
    Entonces la respuesta tiene estado 422
    Y el código de error es "EMPTY_UPDATE"

  Escenario: Reemplazar una tarea completa con PUT
    Dado que existe una tarea "Estudiar API" con prioridad "alta"
    Cuando envío PUT a "/api/v1/tareas/{id}" con el cuerpo:
      """
      {"titulo": "Informe final", "prioridad": "media", "completada": true}
      """
    Entonces la respuesta tiene estado 200
    Y el campo "titulo" vale "Informe final"
    Y el campo "completada" vale "true"
