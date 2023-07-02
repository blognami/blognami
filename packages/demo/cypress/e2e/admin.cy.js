/// <reference types="cypress" />

context('Admin', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:3000')
    })

    describe('Home page - signed out', () => {
        it(`should have correct navbar`, () => {
            cy.getByTestId('navbar', 'title').contains('Lorem ipsum');
            cy.getByTestId('navbar', 'sign-in').contains('Sign in');
        });
    });

    describe('Home page - signed in', () => {
        it(`should have correct text`, () => {
            cy.signIn('admin@example.com');
            cy.getByTestId('navbar').contains('Add');
            cy.signOut();
        });
    });
});