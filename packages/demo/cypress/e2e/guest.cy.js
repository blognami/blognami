context('Guest', () => {
    beforeEach(() => {
      cy.visit('http://127.0.0.1:3000');
      cy.window().then((window) => {
        window.isPersistentContext = true
      })
    });

    afterEach(() => {
        cy.window().its('isPersistentContext').should('equal', true);
    });

    describe('The home page', () => {
        itShouldHaveCorrectNavbar();

        it(`should have the correct body`, () => {
            cy.getByTestId('body').contains('Alexandra Burgs');

            assertLoadMoreButtonWorks([
                'Ellsworth Squares',
                'Graham Place',
                'Jaskolski Ways',
                'Kris Dale',
                'Lowe Lane',
                'Nicola Circle',
                'Schmeler Garden',
                'Tia Expressway',
                'Wisozk Row',
                'Zulauf Roads'
            ]);
        });

        itShouldHaveCorrectSidebar();

        itShouldHaveCorrectFooter();
    });

    describe('A post page', () => {
        beforeEach(() => {
            cy.getByTestId('body').contains('Alexandra Burgs').click();
            cy.getByTestId('body').contains('h1', 'Alexandra Burgs');
        });

        itShouldHaveCorrectNavbar();

        it(`should have the correct body`, () => {
            cy.getByTestId('body').contains('Similique fuga consequatur');
        });

        itShouldHaveCorrectSidebar();

        itShouldHaveCorrectFooter();
        
    });

    describe('A basic page', () => {
        beforeEach(() => {
            cy.getByTestId('sidebar').contains('Osinski Extensions').click();
            cy.getByTestId('body').contains('h1', 'Osinski Extensions');
        });

        itShouldHaveCorrectNavbar();

        it(`should have the correct body`, () => {
            cy.getByTestId('body').contains('Similique molestias illum');
        });

        itShouldHaveCorrectSidebar();

        itShouldHaveCorrectFooter();
        
    });

    describe('A tag page', () => {
        beforeEach(() => {
            cy.getByTestId('sidebar').contains('Excepturi Corporis').click();
            cy.getByTestId('body').contains('h2', 'Excepturi Corporis');
        });

        itShouldHaveCorrectNavbar();

        it(`should have the correct body`, () => {
            cy.getByTestId('body').contains('Altenwerth Ford');

            assertLoadMoreButtonWorks([
                'Parker Landing',
                'Toni Pine',
                'Zulauf Roads'
            ]);
        });

        itShouldHaveCorrectSidebar();

        itShouldHaveCorrectFooter();
    });

    describe('A user page', () => {
        beforeEach(() => {
            cy.getByTestId('body').contains('Alexandra Burgs').click();
            cy.getByTestId('body').contains('h1', 'Alexandra Burgs');
            cy.getByTestId('body').contains('Admin').click();
            cy.getByTestId('body').contains('h2', 'Admin');
        });

        itShouldHaveCorrectNavbar();

        it(`should have the correct body`, () => {
            cy.getByTestId('body').contains('Alexandra Burgs');

            assertLoadMoreButtonWorks([
                'Ellsworth Squares',
                'Graham Place',
                'Jaskolski Ways',
                'Kris Dale',
                'Lowe Lane',
                'Nicola Circle',
                'Schmeler Garden',
                'Tia Expressway',
                'Wisozk Row',
                'Zulauf Roads'
            ]);
        });

        itShouldHaveCorrectSidebar();

        itShouldHaveCorrectFooter();
    });
});

function itShouldHaveCorrectNavbar(){
    it(`should have correct navbar`, () => {
        cy.getByTestId('navbar', 'title').contains('Lorem ipsum');
        cy.getByTestId('navbar', 'sign-in').contains('Sign in');
    });
}

function itShouldHaveCorrectSidebar(){
    it(`should have the correct sidebar`, () => {
        cy.getByTestId('sidebar', 'about-section').contains('About');
        cy.getByTestId('sidebar', 'about-section').contains('Provident itaque iste.');

        cy.getByTestId('sidebar', 'featured-section').contains('Featured');
        ['Gregg Locks', 'Imogene Walks', 'Mayert Overpass'].forEach((title) => {
            cy.getByTestId('sidebar', 'featured-section').contains(title);
        });

        cy.getByTestId('sidebar', 'tags-section').contains('Tags');
        ['Excepturi Corporis', '34 posts'].forEach((title) => {
            cy.getByTestId('sidebar', 'tags-section').contains(title);
        });
        
    });
}

function itShouldHaveCorrectFooter(){
    it(`should have the correct footer`, () => {
        cy.getByTestId('footer').contains('Lorem ipsum');
        cy.getByTestId('footer').contains('Powered by Blognami');
    });
}

function assertLoadMoreButtonWorks(expectedTitles){
    expectedTitles.forEach(expectedTitle => {
        cy.getByTestId('body', 'load-more').click();
        cy.getByTestId('body').contains(expectedTitle);
    });

    cy.getByTestId('body', 'load-more').should('not.exist');
}