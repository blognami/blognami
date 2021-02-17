
context('navigation', () => {
    it("can follow links", () => {
        cy.visit('http://localhost:3000');
        cy.window().then(window => window.pageHasNotReloadedMarker = "page has not reloaded marker");
        cy.get('[data-test=posts-link]').should('be.visible').click();
        cy.get('h1').should('have.text', 'Posts');
        cy.get('[data-test=about-link]').should('be.visible').click();
        cy.get('h1').should('have.text', 'About');
        cy.window().its('pageHasNotReloadedMarker').should('exist');
    });
});
