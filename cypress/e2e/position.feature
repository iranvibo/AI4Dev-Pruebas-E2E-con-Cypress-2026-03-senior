# language: es

Característica: Gestión de Candidatos en la Vista de Posición
  Como reclutador
  Quiero visualizar el tablero de una posición y mover a los candidatos entre sus fases
  Para gestionar el avance de los candidatos en el proceso de selección

  Antecedentes:
    Dado que el reclutador ha iniciado sesión en la plataforma de reclutamiento
    Y que existe la posición "Desarrollador Full Stack" con candidatos asignados

  Escenario: Carga y visualización correcta del tablero de la posición
    Dado que el reclutador navega a la página de la posición "Desarrollador Full Stack"
    Entonces se debe mostrar el título de la posición "Desarrollador Full Stack" en la cabecera de la página
    Y se deben visualizar todas las columnas que representan las fases del proceso de contratación
    Y las tarjetas de cada candidato deben renderizarse inicialmente en la columna correspondiente a su fase actual

  Escenario: Cambio de fase de un candidato mediante arrastrar y soltar (Drag and Drop)
    Dado que el reclutador se encuentra en el tablero de la posición "Desarrollador Full Stack"
    Y el candidato "Juan Pérez" está asignado a la columna "Aplicados"
    Cuando el reclutador arrastra la tarjeta de "Juan Pérez" de la columna "Aplicados" y la suelta en la columna "Entrevista Técnica"
    Entonces la tarjeta de "Juan Pérez" debe reubicarse visualmente dentro de la columna "Entrevista Técnica"
    Y se debe realizar una petición HTTP PUT al endpoint "/candidate/{id}" del servidor para actualizar su fase a "Entrevista Técnica"
    Y la respuesta del servidor debe confirmar la actualización exitosa de la fase en la base de datos