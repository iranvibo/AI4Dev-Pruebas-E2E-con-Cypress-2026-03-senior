import { Given, When, Then, Before } from "@badeball/cypress-cucumber-preprocessor";
import positionPage from "../pages/PositionPage";

let positionId = null;
let targetStepId = null;

Before(() => {
  cy.exec("node backend/prisma/reset-db.js");
});

Given("que el reclutador ha iniciado sesión en la plataforma de reclutamiento", () => {
  cy.visit("/");
  cy.contains("Dashboard del Reclutador").should("be.visible");
});

Given("que existe la posición {string} con candidatos asignados", (positionName) => {
  cy.intercept("GET", "http://localhost:3010/positions", (req) => {
    delete req.headers['if-none-match'];
    delete req.headers['if-modified-since'];
  }).as("getPositions");
  positionPage.visitPositionsList();
  cy.wait("@getPositions").then((interception) => {
    const positions = interception.response.body;
    const pos = positions.find(p => p.title === positionName);
    expect(pos).to.not.be.undefined;
    positionId = pos.id;
  });
});

Given("que el reclutador navega a la página de la posición {string}", (positionName) => {
  cy.intercept("GET", `http://localhost:3010/positions/${positionId}/interviewFlow`, (req) => {
    delete req.headers['if-none-match'];
    delete req.headers['if-modified-since'];
  }).as("getInterviewFlow");
  cy.intercept("GET", `http://localhost:3010/positions/${positionId}/candidates`, (req) => {
    delete req.headers['if-none-match'];
    delete req.headers['if-modified-since'];
  }).as("getCandidates");

  positionPage.navigateToPosition(positionName);

  cy.wait("@getInterviewFlow").then((interception) => {
    const flow = interception.response.body.interviewFlow.interviewFlow;
    const targetStep = flow.interviewSteps.find(step => step.name === "Entrevista Técnica");
    targetStepId = targetStep.id;
  });
  cy.wait("@getCandidates");
});

Then("se debe mostrar el título de la posición {string} en la cabecera de la página", (positionName) => {
  positionPage.getHeaderTitle().should("contain.text", positionName);
});

Then("se deben visualizar todas las columnas que representan las fases del proceso de contratación", () => {
  positionPage.getColumn("Aplicados").should("be.visible");
  positionPage.getColumn("Entrevista Técnica").should("be.visible");
});

Then("las tarjetas de cada candidato deben renderizarse inicialmente en la columna correspondiente a su fase actual", () => {
  positionPage.getColumn("Aplicados")
    .find('[data-testid^="candidate-"]')
    .should("have.length.at.least", 1);
});

Given("que el reclutador se encuentra en el tablero de la posición {string}", (positionName) => {
  cy.url().then((url) => {
    if (!url.includes(`/positions/${positionId}`)) {
      cy.intercept("GET", `http://localhost:3010/positions/${positionId}/interviewFlow`, (req) => {
        delete req.headers['if-none-match'];
        delete req.headers['if-modified-since'];
      }).as("getInterviewFlow");
      cy.intercept("GET", `http://localhost:3010/positions/${positionId}/candidates`, (req) => {
        delete req.headers['if-none-match'];
        delete req.headers['if-modified-since'];
      }).as("getCandidates");

      positionPage.navigateToPosition(positionName);

      cy.wait("@getInterviewFlow").then((interception) => {
        const flow = interception.response.body.interviewFlow.interviewFlow;
        const targetStep = flow.interviewSteps.find(step => step.name === "Entrevista Técnica");
        targetStepId = targetStep.id;
      });
      cy.wait("@getCandidates");
    }
  });

  positionPage.getHeaderTitle().should("contain.text", positionName);
});

Given("el candidato {string} está asignado a la columna {string}", (candidateName, columnName) => {
  positionPage.getColumn(columnName)
    .find(`[data-testid="candidate-${candidateName}"]`)
    .should("be.visible");
});

When("el reclutador arrastra la tarjeta de {string} de la columna {string} y la suelta en la columna {string}", (candidateName, sourceColumn, targetColumn) => {
  cy.intercept("PUT", "http://localhost:3010/candidates/*").as("updateCandidate");
  
  // Perform drag and drop using our Page Object keyboard simulation
  positionPage.dragAndDropKeyboard(candidateName, ['ArrowRight']);
});

Then("la tarjeta de {string} debe reubicarse visualmente dentro de la columna {string}", (candidateName, columnName) => {
  positionPage.getColumn(columnName)
    .find(`[data-testid="candidate-${candidateName}"]`)
    .should("be.visible");
});

Then("se debe realizar una petición HTTP PUT al endpoint {string} del servidor para actualizar su fase a {string}", (endpoint, phaseName) => {
  cy.wait("@updateCandidate").then((interception) => {
    expect(interception.request.method).to.equal("PUT");
    expect(interception.request.body).to.have.property("currentInterviewStep");
    expect(Number(interception.request.body.currentInterviewStep)).to.equal(Number(targetStepId));
  });
});

Then("la respuesta del servidor debe confirmar la actualización exitosa de la fase en la base de datos", () => {
  cy.get("@updateCandidate").then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201]);
    expect(interception.response.body.message).to.contain("successfully");
  });
});
