// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('typeOtpFor', { prevSubject: true }, async (subject, email) => {
   const response = await fetch(`/test/generate-otp?email=${encodeURIComponent(email)}`);
   const { otp } = await response.json();
   cy.get(subject.selector).type(otp);
   return subject;
});

Cypress.Commands.add('getByTestId', (...path) => path.reduce((cy, testId, i) => {
    if(i == 0) return cy.get(`[data-testid="${testId}"]`);
    return cy.find(`[data-testid="${testId}"]`);
}, cy));

Cypress.Commands.add('signIn', (email) => {
    cy.get('.navbar-item').contains('Sign in').click();
    cy.get('input[name="email"]').type(email);
    cy.get('button[type="submit"]').contains('Next').click();
    cy.get('input[name="password"]').typeOtpFor(email);
    cy.get('button[type="submit"]').contains('Next').click();
});

Cypress.Commands.add('signOut', () => {
    cy.get('.navbar-item').contains('Sign out').click();
});
