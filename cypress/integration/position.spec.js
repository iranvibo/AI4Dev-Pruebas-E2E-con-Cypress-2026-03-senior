import positionPage from '../e2e/pages/PositionPage';

describe('Gestión de Candidatos en la Vista de Posición (Cypress Puro)', () => {
  let positionId = null;
  let targetStepId = null;

  beforeEach(() => {
    // Reset database state before each test run
    cy.exec('node backend/prisma/reset-db.js');
    
    // Login mock / Dashboard verification
    cy.visit('/');
    cy.contains('Dashboard del Reclutador').should('be.visible');
  });

  it('Carga y visualización correcta del tablero de la posición', () => {
    // Intercept positions list GET
    cy.intercept('GET', 'http://localhost:3010/positions', (req) => {
      delete req.headers['if-none-match'];
      delete req.headers['if-modified-since'];
    }).as('getPositions');
    
    positionPage.visitPositionsList();
    cy.wait('@getPositions').then((interception) => {
      const positions = interception.response.body;
      const pos = positions.find(p => p.title === 'Desarrollador Full Stack');
      expect(pos).to.not.be.undefined;
      positionId = pos.id;

      // Intercept details flow & candidates GET
      cy.intercept('GET', `http://localhost:3010/positions/${positionId}/interviewFlow`, (req) => {
        delete req.headers['if-none-match'];
        delete req.headers['if-modified-since'];
      }).as('getInterviewFlow');
      cy.intercept('GET', `http://localhost:3010/positions/${positionId}/candidates`, (req) => {
        delete req.headers['if-none-match'];
        delete req.headers['if-modified-since'];
      }).as('getCandidates');
    });

    positionPage.navigateToPosition('Desarrollador Full Stack');
    cy.wait('@getInterviewFlow');
    cy.wait('@getCandidates');

    // Assert title and columns
    positionPage.getHeaderTitle().should('contain.text', 'Desarrollador Full Stack');
    positionPage.getColumn('Aplicados').should('be.visible');
    positionPage.getColumn('Entrevista Técnica').should('be.visible');
    
    // Assert candidate is rendered inside Aplicados column
    positionPage.getColumn('Aplicados')
      .find('[data-testid="candidate-Juan Pérez"]')
      .should('be.visible');
  });

  it('Cambio de fase de un candidato mediante arrastrar y soltar (Drag and Drop)', () => {
    // Resolve positionId
    cy.intercept('GET', 'http://localhost:3010/positions', (req) => {
      delete req.headers['if-none-match'];
      delete req.headers['if-modified-since'];
    }).as('getPositions');
    
    positionPage.visitPositionsList();
    cy.wait('@getPositions').then((interception) => {
      const positions = interception.response.body;
      const pos = positions.find(p => p.title === 'Desarrollador Full Stack');
      positionId = pos.id;

      // Navigate to position board and intercept flow details
      cy.intercept('GET', `http://localhost:3010/positions/${positionId}/interviewFlow`, (req) => {
        delete req.headers['if-none-match'];
        delete req.headers['if-modified-since'];
      }).as('getInterviewFlow');
      cy.intercept('GET', `http://localhost:3010/positions/${positionId}/candidates`, (req) => {
        delete req.headers['if-none-match'];
        delete req.headers['if-modified-since'];
      }).as('getCandidates');
    });

    positionPage.navigateToPosition('Desarrollador Full Stack');
    cy.wait('@getInterviewFlow').then((interception) => {
      const flow = interception.response.body.interviewFlow.interviewFlow;
      const targetStep = flow.interviewSteps.find(step => step.name === 'Entrevista Técnica');
      targetStepId = targetStep.id;
    });
    cy.wait('@getCandidates');

    // Intercept PUT request
    cy.intercept('PUT', 'http://localhost:3010/candidates/*').as('updateCandidate');

    // Perform Drag & Drop
    positionPage.dragAndDropKeyboard('Juan Pérez', ['ArrowRight']);

    // Assert visual reallocation
    positionPage.getColumn('Entrevista Técnica')
      .find('[data-testid="candidate-Juan Pérez"]')
      .should('be.visible');

    // Assert network payload and response
    cy.wait('@updateCandidate').then((interception) => {
      expect(interception.request.method).to.equal('PUT');
      expect(interception.request.body).to.have.property('currentInterviewStep');
      expect(Number(interception.request.body.currentInterviewStep)).to.equal(Number(targetStepId));
      expect(interception.response.statusCode).to.be.oneOf([200, 201]);
      expect(interception.response.body.message).to.contain('successfully');
    });
  });
});
