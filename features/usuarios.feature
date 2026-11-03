# language: es
Característica: Gestión de usuarios
  Como administrador
  Quiero administrar usuarios
  Para saber quiénes usan la aplicación

  Escenario: Crear un usuario
    Cuando envío POST a "/api/v1/usuarios" con el cuerpo:
      """
      {"nombre": "Ana Pérez", "email": "ana@mail.com"}
      """
    Entonces la respuesta tiene estado 201
    Y el campo "email" vale "ana@mail.com"

  Escenario: Rechazar un email inválido
    Cuando envío POST a "/api/v1/usuarios" con el cuerpo:
      """
      {"nombre": "Ana Pérez", "email": "no-es-email"}
      """
    Entonces la respuesta tiene estado 422
    Y el código de error es "INVALID_EMAIL"

  Escenario: No permitir emails repetidos
    Dado que existe un usuario "Ana Pérez" con email "ana@mail.com"
    Cuando envío POST a "/api/v1/usuarios" con el cuerpo:
      """
      {"nombre": "Otra Ana", "email": "ana@mail.com"}
      """
    Entonces la respuesta tiene estado 409
    Y el código de error es "EMAIL_ALREADY_EXISTS"

  Escenario: Buscar un usuario por id
    Dado que existe un usuario "Ana Pérez" con email "ana@mail.com"
    Cuando envío GET a "/api/v1/usuarios/{id}"
    Entonces la respuesta tiene estado 200

  Escenario: Eliminar un usuario y no encontrarlo después
    Dado que existe un usuario "Ana Pérez" con email "ana@mail.com"
    Cuando envío DELETE a "/api/v1/usuarios/{id}"
    Entonces la respuesta tiene estado 204
    Cuando envío GET a "/api/v1/usuarios/{id}"
    Entonces la respuesta tiene estado 404
