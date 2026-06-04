class PositionPage {
  visitPosition(id) {
    cy.visit(`/positions/${id}`);
  }

  visitPositionsList() {
    cy.visit('/positions');
  }

  navigateToPosition(positionTitle) {
    cy.contains('.card-title', positionTitle)
      .parents('.card')
      .contains('Ver proceso')
      .click();
  }

  getHeaderTitle() {
    return cy.get('h2');
  }

  getColumn(title) {
    return cy.get(`[data-testid="column-${title}"]`);
  }

  getCandidateCard(name) {
    return cy.get(`[data-testid="candidate-${name}"]`);
  }

  // Simulates dragging a card from its current column to a target column using mouse events
  dragAndDrop(candidateName, targetColumnTitle) {
    const BUTTON_INDEX = 0;
    const SLOPPY_CLICK_THRESHOLD = 10;

    cy.get(`[data-testid="column-${targetColumnTitle}"]`).then(($column) => {
      // Target the middle-top of the column Card Body
      const columnRect = $column[0].getBoundingClientRect();
      const dropX = columnRect.left + (columnRect.width / 2);
      const dropY = columnRect.top + 150; // Drag it into the Card Body area

      cy.get(`[data-testid="candidate-${candidateName}"]`).first().then(($card) => {
        const cardRect = $card[0].getBoundingClientRect();
        const dragX = cardRect.left + (cardRect.width / 2);
        const dragY = cardRect.top + (cardRect.height / 2);

        // Mousedown & small movement to initiate dragging state
        cy.wrap($card)
          .trigger('mousedown', { button: BUTTON_INDEX, clientX: dragX, clientY: dragY, force: true })
          .trigger('mousemove', { button: BUTTON_INDEX, clientX: dragX + SLOPPY_CLICK_THRESHOLD, clientY: dragY, force: true });
        
        // Wait briefly for react-beautiful-dnd to process the start drag event
        cy.wait(150);

        // Move to destination and release mouse
        cy.get('body')
          .trigger('mousemove', { button: BUTTON_INDEX, clientX: dropX, clientY: dropY, force: true })
          .trigger('mouseup', { force: true });
      });
    });
  }

  // Alternative keyboard-based drag and drop for react-beautiful-dnd
  dragAndDropKeyboard(candidateName, directions = ['ArrowRight']) {
    cy.get(`[data-testid="candidate-${candidateName}"]`).first().focus().then(($card) => {
      // Space to lift
      cy.wrap($card).trigger('keydown', { keyCode: 32, which: 32, force: true });
      cy.wait(100);

      // Move using arrow keys
      directions.forEach((direction) => {
        const keyCode = direction === 'ArrowRight' ? 39 : direction === 'ArrowLeft' ? 37 : direction === 'ArrowDown' ? 40 : 38;
        cy.wrap($card).trigger('keydown', { keyCode, which: keyCode, key: direction, force: true });
        cy.wait(100);
      });

      // Space to drop
      cy.wrap($card).trigger('keydown', { keyCode: 32, which: 32, force: true });
      cy.wait(100);
    });
  }
}

export default new PositionPage();
