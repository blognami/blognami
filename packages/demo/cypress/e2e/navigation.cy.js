/// <reference types="cypress" />

context('Aliasing', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:3000')
    })

    describe('Home page', () => {
        it(`should have correct text`, () => {
            cy.get('.navbar-brand > .navbar-item').should('have.text', 'Hello World!')
        });
    });

});