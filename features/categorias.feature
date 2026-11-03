# language: es
Característica: Gestión de categorías
  Como estudiante
  Quiero administrar categorías
  Para organizar mis tareas

  Escenario: Crear una categoría
    Cuando envío POST a "/api/v1/categorias" con el cuerpo:
      """
      {"nombre": "Backend", "descripcion": "Servidores y APIs"}
      """
    Entonces la respuesta tiene estado 201
    Y el campo "nombre" vale "Backend"

  Escenario: No permitir categorías duplicadas
    Dado que existe una categoría "Backend"
    Cuando envío POST a "/api/v1/categorias" con el cuerpo:
      """
      {"nombre": "Backend"}
      """
    Entonces la respuesta tiene estado 409
    Y el código de error es "CATEGORY_ALREADY_EXISTS"

  Escenario: Buscar una categoría por id
    Dado que existe una categoría "Backend"
    Cuando envío GET a "/api/v1/categorias/{id}"
    Entonces la respuesta tiene estado 200
    Y el campo "nombre" vale "Backend"

  Escenario: Buscar una categoría inexistente
    Cuando envío GET a "/api/v1/categorias/999"
    Entonces la respuesta tiene estado 404
    Y el código de error es "CATEGORY_NOT_FOUND"

  Escenario: Modificar una categoría
    Dado que existe una categoría "Backend"
    Cuando envío PUT a "/api/v1/categorias/{id}" con el cuerpo:
      """
      {"nombre": "Servidores", "descripcion": "Node y Express"}
      """
    Entonces la respuesta tiene estado 200
    Y el campo "nombre" vale "Servidores"

  Escenario: Eliminar una categoría
    Dado que existe una categoría "Backend"
    Cuando envío DELETE a "/api/v1/categorias/{id}"
    Entonces la respuesta tiene estado 204
