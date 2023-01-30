/// <reference types="cypress" />

context('Admin', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:3000')
    })

    describe('Home page - signed out', () => {
        it(`should have correct navbar`, () => {
            cy.get('.navbar-item').contains('Hello World!');
            cy.get('.navbar-item').contains('Sign in');
        });
    });

    describe('Home page - signed in', () => {
        it(`should have correct text`, () => {
            cy.signIn('admin@example.com');
            cy.get('.navbar-item').contains('Add');
            cy.signOut();
        });
    });
});