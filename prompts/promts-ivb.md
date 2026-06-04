PROMT 1:
**Rol:** QA Automation Engineer / Developer
**Tarea:** Redacción de Escenarios de Prueba E2E en formato BDD (Gherkin)
**Entregable:** Archivo(s) `.feature` con la especificación Gherkin.

---

### OBJETIVO
Definir los escenarios de prueba de comportamiento (BDD) para la interfaz "Position" utilizando la sintaxis Gherkin (en español). 

**IMPORTANTE (Límite del alcance):** 
En esta fase, tu tarea se limita **estrictamente** a redactar los escenarios en Gherkin. NO debes escribir código de automatización, ni definiciones de pasos (Step Definitions), ni configurar frameworks de prueba. Solo necesitamos la especificación del comportamiento en lenguaje natural estructurado.

---

### ESCENARIOS A CUBRIR

Debes estructurar el archivo de características (`.feature`) para cubrir los siguientes casos de prueba:

#### 1. Carga de la Página de Position
*   **Verificación de Título:** Comprobar que el título de la posición se renderiza y muestra de manera correcta.
*   **Estructura de Columnas:** Comprobar que se visualizan todas las columnas que representan las fases del proceso de contratación.
*   **Distribución de Candidatos:** Comprobar que las tarjetas de los candidatos aparecen inicialmente en la columna que corresponde a su estado/fase actual.

#### 2. Cambio de Fase de un Candidato (Drag & Drop + Backend)
*   **Acción del Usuario:** Simular el arrastre (drag and drop) de la tarjeta de un candidato desde su columna origen a una columna destino.
*   **Efecto Visual:** Confirmar que la tarjeta se posiciona físicamente en la nueva columna.
*   **Persistencia (Backend):** Verificar que esta acción desencadena la actualización del estado en el servidor mediante el endpoint `PUT /candidate/:id` con los datos correctos.

---

### DIRECTRICES DE REDACCIÓN (GHERKIN)
1. Usa la estructura estándar en español: `Característica`, `Antecedentes` (si aplica), `Escenario`, `Dado`, `Cuando`, `Entonces`, `Y`.
2. Mantén los pasos declarativos en lugar de imperativos (enfócate en el *qué* hace el usuario y no en el detalle técnico de cómo hace clic en un selector CSS específico).
3. Asegúrate de incluir cómo se representará la verificación del llamado al API (`PUT /candidate/:id`) a nivel conceptual dentro del flujo del escenario.

Por favor, entrega el resultado en un bloque de código markdown listo para revisión.

