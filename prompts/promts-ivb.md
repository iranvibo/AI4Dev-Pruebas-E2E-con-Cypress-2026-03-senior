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

PROMT 2:
**Rol:** QA Automation Engineer / Senior Developer
**Tarea:** Análisis del proyecto e Implementación de Pruebas E2E en Cypress a partir de Gherkin
**Origen:** cypress/e2e/position.feature
**Entregables:** Reporte de análisis técnico inicial, Step Definitions en JS/TS y Page Objects.

---

### FASE 1: ANÁLISIS Y DIAGNÓSTICO DEL PROYECTO (Antes de programar)
Antes de comenzar con la escritura de código, debes analizar el estado actual del repositorio para definir los límites técnicos de la implementación. Investiga e informa sobre los siguientes puntos:

1. **Configuración de Cypress & Gherkin:**
   * ¿Cuál es la versión de Cypress instalada en `package.json`?
   * ¿Está configurado y funcionando el preprocesador de Cucumber (`@badeball/cypress-cucumber-preprocessor` u otro)? ¿Dónde están mapeados los archivos `.feature` y las carpetas de `step_definitions` en el archivo de configuración (`cypress.config.js` o `cypress.json`)?
2. **Soporte para Drag & Drop:**
   * Revisa en `package.json` si contamos con librerías externas de arrastre (ej. `@4tw/cypress-drag-drop`). De no ser así, identifica si la interfaz de usuario utiliza HTML5 nativo o alguna librería de React/Vue/Angular (como React Beautiful DND) que requiera eventos específicos del DOM (`trigger('dragstart')`, etc.).
3. **Estructura del Backend y API:**
   * Confirma la URL base del backend y la estructura exacta del endpoint `PUT /candidate/:id`. ¿Cómo maneja la aplicación la autenticación para este llamado?
4. **Reutilización de Código:**
   * Identifica si existen Page Objects, comandos personalizados (`cypress/support/commands.js`) o fixtures que deban ser reutilizados para mantener la consistencia con otros tests del proyecto.

*Nota: Comparte tus hallazgos de esta Fase 1 brevemente con el equipo antes de proceder a la Fase 2.*

---

### FASE 2: IMPLEMENTACIÓN E2E EN CYPRESS

Una vez acordados los límites técnicos del análisis, procede a la implementación de los escenarios definidos en el archivo `position.feature`.

1. **Estructura de Código:**
   * Utiliza el patrón **Page Object Model (POM)** para interactuar con la página de "Position", abstrayendo los selectores y las interacciones del DOM.
   * Utiliza atributos estables para localizar elementos (preferiblemente `data-testid` o selectores de accesibilidad).

2. **Acción de Arrastre (Drag & Drop):**
   * Automatiza la acción de mover al candidato entre columnas utilizando el método de arrastre identificado en la Fase 1 que sea compatible con la UI.

3. **Interceptación y Validación de Red:**
   * Usa obligatoriamente `cy.intercept()` para vigilar la petición al servidor.
   * Intercepta la llamada `PUT` al endpoint `/candidate/*` antes del arrastre.
   * Tras la acción, realiza un `cy.wait()` sobre el alias de la interceptación y verifica:
     * Que el cuerpo de la petición (`request.body`) contiene los campos esperados (ej. `phaseId` o `status` del candidato).
     * Que la respuesta del servidor es satisfactoria (código HTTP 200 o 201).

4. **Robustez:**
   * No uses esperas fijas de tiempo (`cy.wait(ms)`). Todo flujo de sincronización debe basarse en el estado de elementos del DOM o en la resolución de llamadas de red.

---

### ENTREGABLES
1. Los archivos de **Step Definitions** correspondientes a `position.feature`.
2. Las clases **Page Object** o soporte de selectores desarrollados.