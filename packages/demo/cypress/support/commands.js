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

Cypress.Commands.add('resetDatabaseFromSql', async () => {
    await fetch(`/test/reset-database-from-sql`);
});

Cypress.Commands.add('signIn', (email) => {
    cy.getByTestId('navbar', 'sign-in').click();
    cy.topModal().submitForm({ email });
    cy.topModal().submitForm({ password: email });
});

Cypress.Commands.add('signOut', () => {
    cy.getByTestId('navbar', 'sign-out').click();
});

Cypress.Commands.add('getByTestId', (...path) => cy.waitForLoadingToFinish().then(() => path.reduce((cy, testId, i) => {
    if(i == 0) return cy.get(`[data-test-id="${testId}"]`);
    return cy.find(`[data-test-id="${testId}"]`);
}, cy)));

Cypress.Commands.add('submitForm', { prevSubject: true }, (subject, values = {}) => {
    Object.keys(values).forEach((name) => {
        const value = values[name];
        cy.get(subject).find(`input[name="${name}"], textarea[name="${name}"]`).then(($input) => {
            if($input.is('input[type="password"]')){
                cy.wrap($input).clear().typeOtpFor(value);
            } else if($input.is('input[type="checkbox"]')){
                if(value){
                    cy.wrap($input).check();
                } else {
                    cy.wrap($input).uncheck();
                }
            } else if($input.is('[data-test-id="markdown-input"]')){
                cy.wrap($input).click();
                cy.get('textarea[name="value"]');
                cy.focused().clear().type(value);
                cy.closeTopModal();
            } else {
                cy.wrap($input).clear().type(value);
            }
        });
    })
    cy.get(subject).find('button[type="submit"]').click();
    cy.waitForLoadingToFinish();
});

Cypress.Commands.add('typeOtpFor', { prevSubject: true }, async (subject, email) => {
    const response = await fetch(`/test/generate-otp?email=${encodeURIComponent(email)}`);
    const { otp } = await response.json();
    cy.get(subject).type(otp);
    return subject;
 });

Cypress.Commands.add('topModal',() => cy.waitForLoadingToFinish().then(() => cy.get('pinstripe-modal').last()));

Cypress.Commands.add('closeTopModal', () => cy.topModal().shadow().find('button').click());

Cypress.Commands.add('waitForLoadingToFinish', () => {
    cy.window().then(async (window) => {
        while(true){
            await new Promise(resolve => setTimeout(resolve, 100));
            if(window.document._component.progressBar.startCount == 0) break;
        }
    });
});