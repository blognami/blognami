

export function describeApp(role){
    context(`When a ${role} user`, () => {
        beforeEach(() => {
            cy.visit('http://127.0.0.1:3000');
            cy.window().then((window) => {
                window.isPersistentContext = true;
            });
            if(role == 'admin') cy.signIn('admin@example.com');
        });

        afterEach(() => {
            cy.window().its('isPersistentContext').should('equal', true);
            cy.resetDatabaseFromSql();
        });

        describe('the home page', () => {
            describeNavbar();

            describe('main', () => {
                it(`should have the correct contents`, () => {
                    cy.getByTestId('main').contains('Alexandra Burgs');
    
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
            });

            describeSidebar();

            describeFooter();
        });

        describe('a post page', () => {
            beforeEach(() => {
                cy.getByTestId('main').contains('Alexandra Burgs').click();
                cy.getByTestId('main', 'post-title').contains('Alexandra Burgs');
            });

            describeNavbar();

            describe('main', () => {
                it(`should have the correct contents`, () => {
                    cy.getByTestId('main').contains('Similique fuga consequatur');
                });
    
                it(`should have an interface to allow the user to add/edit/delete comments`, () => {
                    cy.getByTestId('main').contains("Apple").should('not.exist');
                    cy.getByTestId('main').contains("Pear").should('not.exist');
                    cy.getByTestId('main', 'comment-created-at').should('not.exist');
                    cy.getByTestId('main', 'add-comment').contains("Add comment").click();
                    cy.topModal().contains("Cancel").click();
                    cy.getByTestId('main', 'add-comment').contains("Add comment").click();
                    cy.topModal().contains('Add comment');
                    if(role == 'guest'){
                        cy.topModal().submitForm({ email: 'bob@example.com' });
                        cy.topModal().submitForm({ password: 'bob@example.com' });
                        cy.topModal().submitForm({ name: 'Bob' });
                    }
                    cy.topModal().submitForm({ body: 'Apple' });
                    cy.getByTestId('main').contains("Apple").should('exist');
                    cy.getByTestId('main').contains("Pear").should('not.exist');
                    cy.getByTestId('main', 'comment-created-at').should('not.contain', 'Invalid DateTime');
                    cy.getByTestId('main', 'edit-comment').contains("Edit").click();
                    cy.topModal().submitForm({ body: 'Pear' });
                    cy.getByTestId('main').contains("Apple").should('not.exist');
                    cy.getByTestId('main').contains("Pear").should('exist');
                    cy.getByTestId('main', 'delete-comment').contains("Delete").click();
                    cy.getByTestId('main').contains("Apple").should('not.exist');
                    cy.getByTestId('main').contains("Pear").should('not.exist');
                    cy.getByTestId('main', 'comment-created-at').should('not.exist');
                });

                it(`should have an interface to allow the user to navigate to the previous/next posts`, () => {
                    const postTitles = POST_TITLES.slice(0, 11);
                    postTitles.forEach((postTitle, i) => {
                        cy.getByTestId('main', 'post-title').contains(postTitle);
                        if(i < postTitles.length - 1) cy.getByTestId('main', 'previous-post').click();
                    });

                    postTitles.reverse();

                    postTitles.forEach((postTitle, i) => {
                        cy.getByTestId('main', 'post-title').contains(postTitle);
                        if(i < postTitles.length - 1) cy.getByTestId('main', 'next-post').click();
                    });
                });
    
                if(role == 'admin'){
                    it(`should have an interface to allow the user to edit the title`, () => {
                        cy.getByTestId('main', 'post-title').should('not.contain', 'Apple pear');
                        cy.getByTestId('main', 'edit-post-title').click();
                        cy.topModal().submitForm({ title: 'Apple pear' });
                        cy.getByTestId('main', 'post-title').should('contain', 'Apple pear');
                    });
    
                    it(`should have an interface to allow the user to edit the body`, () => {
                        cy.getByTestId('main', 'post-body').should('not.contain', 'Pear plum');
                        cy.getByTestId('main', 'edit-post-body').click();
                        cy.topModal().submitForm({ body: 'Pear plum' });
                        cy.getByTestId('main', 'post-body').should('contain', 'Pear plum');
                        
                        cy.getByTestId('main', 'post-body').should('not.contain', 'Peach plum');
                        cy.getByTestId('main', 'edit-post-body').click();
                        cy.topModal().submitForm({ body: 'Peach plum' });
                        cy.getByTestId('main', 'post-body').should('contain', 'Peach plum');

                        cy.getByTestId('main', 'post-body').should('not.contain', 'Pear plum');
                        cy.getByTestId('main', 'edit-post-body').click();
                        cy.topModal().getByTestId('revisions').click();
                        cy.topModal().find('tbody > tr').should('have.length', 2);
                        cy.topModal().find('tbody > tr:last-child a').click();
                        cy.topModal().submitForm({});
                        cy.getByTestId('main', 'post-body').should('contain', 'Pear plum');
                    });

                    describe('meta', () => {
                        it(`should have an interface to allow the user to edit the slug`, () => {
                            cy.getByTestId('main', 'post-meta').should('contain', 'Slug: alexandra-burgs');
                            cy.url().should('contain', '/alexandra-burgs');
                            cy.getByTestId('main', 'post-meta').should('not.contain', 'Slug: foo-bar');
                            cy.url().should('not.contain', '/foo-bar');
                            cy.getByTestId('main', 'edit-post-meta').click();
                            cy.topModal().submitForm({ slug: 'foo-bar' });
                            cy.getByTestId('main', 'post-meta').should('not.contain', 'Slug: alexandra-burgs');
                            cy.url().should('not.contain', '/alexandra-burgs');
                            cy.getByTestId('main', 'post-meta').should('contain', 'Slug: foo-bar');
                            cy.url().should('contain', '/foo-bar');
                        });

                        it(`should have an interface to allow the user to edit the tags`, () => {
                            ['Apple', 'Pear', 'Plum'].forEach((title) => {
                                cy.getByTestId('sidebar', 'tags-section').should('not.contain', title);
                            });
                            cy.getByTestId('main', 'post-meta').should('contain', 'Tags: none');
                            cy.getByTestId('main', 'edit-post-meta').click();
                            cy.topModal().submitForm({ tags: ['Apple', 'Pear', 'Plum'].join('\n') });
                            cy.getByTestId('main', 'post-meta').should('contain', 'Tags: "Apple", "Pear", "Plum"');
                            ['Apple', 'Pear', 'Plum'].forEach((title) => {
                                cy.getByTestId('sidebar', 'tags-section').should('contain', title);
                            });
                        });

                        it(`should have an interface to allow the user to edit the featured flag`, () => {
                            cy.getByTestId('sidebar', 'featured-section').should('not.contain', 'Alexandra Burgs');
                            cy.getByTestId('main', 'post-meta').should('contain', 'Featured: false');

                            cy.getByTestId('main', 'edit-post-meta').click();
                            cy.topModal().submitForm({ featured: true });
                            cy.getByTestId('main', 'post-meta').should('contain', 'Featured: true');
                            cy.getByTestId('sidebar', 'featured-section').should('contain', 'Alexandra Burgs');

                            cy.getByTestId('main', 'edit-post-meta').click();
                            cy.topModal().submitForm({ featured: false });
                            cy.getByTestId('main', 'post-meta').should('contain', 'Featured: false');
                            cy.getByTestId('sidebar', 'featured-section').should('not.contain', 'Alexandra Burgs');
                        });

                        it(`should have an interface to allow the user to edit the published flag`, () => {
                            cy.getByTestId('main', 'post-meta').should('contain', 'Published: true');

                            cy.getByTestId('main', 'edit-post-meta').click();
                            cy.topModal().submitForm({ published: false });
                            cy.getByTestId('main', 'post-meta').should('contain', 'Published: false');

                            cy.getByTestId('main', 'edit-post-meta').click();
                            cy.topModal().submitForm({ published: true });
                            cy.getByTestId('main', 'post-meta').should('contain', 'Published: true');
                        });

                        it(`should have an interface to allow the user to edit the enableComments flag`, () => {
                            cy.getByTestId('main', 'post-meta').should('contain', 'enableComments: true');
                            cy.getByTestId('main', 'add-comment').should('exist');

                            cy.getByTestId('main', 'edit-post-meta').click();
                            cy.topModal().submitForm({ enableComments: false });
                            cy.getByTestId('main', 'post-meta').should('contain', 'enableComments: false');
                            cy.getByTestId('main', 'add-comment').should('not.exist');

                            cy.getByTestId('main', 'edit-post-meta').click();
                            cy.topModal().submitForm({ enableComments: true });
                            cy.getByTestId('main', 'post-meta').should('contain', 'enableComments: true');
                            cy.getByTestId('main', 'add-comment').should('exist');
                        });
                    });
    
                
                    it(`should have an interface to allow the user to delete the current post`, () => {
                        cy.getByTestId('main', 'post-title').should('exist');
                        cy.getByTestId('main', 'delete-post').click();
                        cy.getByTestId('main', 'post-title').should('not.exist');
                    });
                }
            });

            describeSidebar();

            describeFooter();
        });

        describe('a basic page', () => {
            beforeEach(() => {
                cy.getByTestId('sidebar').contains('Osinski Extensions').click();
                cy.getByTestId('main').contains('h1', 'Osinski Extensions');
            });

            describeNavbar();

            describe('main', () => {
                it(`should have the correct contents`, () => {
                    cy.getByTestId('main').contains('Similique molestias illum');
                });

                if(role == 'admin'){
                    it(`should have an interface to allow the user to edit the title`, () => {
                        cy.getByTestId('main', 'page-title').should('not.contain', 'Apple pear');
                        cy.getByTestId('main', 'edit-page-title').click();
                        cy.topModal().submitForm({ title: 'Apple pear' });
                        cy.getByTestId('main', 'page-title').should('contain', 'Apple pear');
                    });
    
                    it(`should have an interface to allow the user to edit the body`, () => {
                        cy.getByTestId('main', 'page-body').should('not.contain', 'Pear plum');
                        cy.getByTestId('main', 'edit-page-body').click();
                        cy.topModal().submitForm({ body: 'Pear plum' });
                        cy.getByTestId('main', 'page-body').should('contain', 'Pear plum');

                        cy.getByTestId('main', 'page-body').should('not.contain', 'Peach plum');
                        cy.getByTestId('main', 'edit-page-body').click();
                        cy.topModal().submitForm({ body: 'Peach plum' });
                        cy.getByTestId('main', 'page-body').should('contain', 'Peach plum');

                        cy.getByTestId('main', 'page-body').should('not.contain', 'Pear plum');
                        cy.getByTestId('main', 'edit-page-body').click();
                        cy.topModal().getByTestId('revisions').click();
                        cy.topModal().find('tbody > tr').should('have.length', 2);
                        cy.topModal().find('tbody > tr:last-child a').click();
                        cy.topModal().submitForm({});
                        cy.getByTestId('main', 'page-body').should('contain', 'Pear plum');
                    });

                    describe('meta', () => {
                        it(`should have an interface to allow the user to edit the slug`, () => {
                            cy.getByTestId('main', 'page-meta').should('contain', 'Slug: osinski-extensions');
                            cy.url().should('contain', '/osinski-extensions');
                            cy.getByTestId('main', 'page-meta').should('not.contain', 'Slug: foo-bar');
                            cy.url().should('not.contain', '/foo-bar');
                            cy.getByTestId('main', 'edit-page-meta').click();
                            cy.topModal().submitForm({ slug: 'foo-bar' });
                            cy.getByTestId('main', 'page-meta').should('not.contain', 'Slug: osinski-extensions');
                            cy.url().should('not.contain', '/osinski-extensions');
                            cy.getByTestId('main', 'page-meta').should('contain', 'Slug: foo-bar');
                            cy.url().should('contain', '/foo-bar');
                        });

                        it(`should have an interface to allow the user to edit the published flag`, () => {
                            cy.getByTestId('main', 'page-meta').should('contain', 'Published: true');

                            cy.getByTestId('main', 'edit-page-meta').click();
                            cy.topModal().submitForm({ published: false });
                            cy.getByTestId('main', 'page-meta').should('contain', 'Published: false');

                            cy.getByTestId('main', 'edit-page-meta').click();
                            cy.topModal().submitForm({ published: true });
                            cy.getByTestId('main', 'page-meta').should('contain', 'Published: true');
                        });
                    });
    
                
                    it(`should have an interface to allow the user to delete the current page`, () => {
                        cy.getByTestId('main', 'page-title').should('exist');
                        cy.getByTestId('main', 'delete-page').click();
                        cy.getByTestId('main', 'page-title').should('not.exist');
                    });
                }
            });

            describeSidebar();

            describeFooter();
            
        });

        describe('a tag page', () => {
            beforeEach(() => {
                cy.getByTestId('sidebar').contains('Excepturi Corporis').click();
                cy.getByTestId('main').contains('h2', 'Excepturi Corporis');
            });

            describeNavbar();

            describe('main', () => {
                it(`should have the correct contents`, () => {
                    cy.getByTestId('main').contains('Altenwerth Ford');
    
                    assertLoadMoreButtonWorks([
                        'Parker Landing',
                        'Toni Pine',
                        'Zulauf Roads'
                    ]);
                });
            });

            describeSidebar();

            describeFooter();
        });

        describe('a user page', () => {
            beforeEach(() => {
                cy.getByTestId('main').contains('Alexandra Burgs').click();
                cy.getByTestId('main').contains('h1', 'Alexandra Burgs');
                cy.getByTestId('main').contains('Admin').click();
                cy.getByTestId('main').contains('h2', 'Admin');
            });

            describeNavbar();

            describe('main', () => {
                it(`should have the correct contents`, () => {
                    cy.getByTestId('main').contains('Alexandra Burgs');
    
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
            });

            describeSidebar();

            describeFooter();
        });
    });

    function describeNavbar(){
        describe('navbar', () => {
            it(`should have the correct contents`, () => {
                cy.getByTestId('navbar', 'title').contains('Lorem ipsum');
                if(role == 'admin'){
                    cy.getByTestId('navbar', 'sign-out').contains('Sign out');
                    cy.getByTestId('navbar').contains('Add');
                    cy.getByTestId('navbar').contains('Page');
                    cy.getByTestId('navbar').contains('Post');
                } else {
                    cy.getByTestId('navbar', 'sign-in').contains('Sign in');
                }
            });

            if(role == 'admin'){
                it(`should have an interface to allow the user to add a post`, () => {
                    cy.getByTestId('navbar').contains('Post').click({ force: true });
                    cy.topModal().contains('Add post');
                    cy.topModal().submitForm({ title: 'Apple pear' });
                    cy.url().should('contain', 'apple-pear');
                });
                it(`should have an interface to allow the user to add a page`, () => {
                    cy.getByTestId('navbar').contains('Page').click({ force: true });
                    cy.topModal().contains('Add page');
                    cy.topModal().submitForm({ title: 'Apple plum' });
                    cy.url().should('contain', 'apple-plum');
                });
            }
        })
    }

    function describeSidebar(){
        describe('sidebar', () => {
            it(`should have the correct contents`, () => {
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
        });
    }

    function describeFooter(){
        describe(`footer`, () => {
            it(`should have the correct contents`, () => {
                cy.getByTestId('footer').contains('Lorem ipsum');
                cy.getByTestId('footer').contains('Powered by Blognami');
            });
        });
    }
    
    function assertLoadMoreButtonWorks(expectedTitles){
        expectedTitles.forEach(expectedTitle => {
            cy.getByTestId('main', 'load-more').click();
            cy.getByTestId('main').contains(expectedTitle);
        });
    
        cy.getByTestId('main', 'load-more').should('not.exist');
    }


    const POST_TITLES = [
        "Alexandra Burgs",
        "Altenwerth Ford",
        "Amber Trail",
        "Balistreri Light",
        "Ben Route",
        "Brianne Falls",
        "Camron Creek",
        "Carter Fort",
        "Celestine Crossing",
        "Chester Ferry",
        "Chester Roads",
        "Colton Station",
        "Cristobal Via",
        "Dawn Freeway",
        "Denesik Plaza",
        "Dessie Shore",
        "Dicki Spring",
        "Earline Wells",
        "Efrain Coves",
        "Ellsworth Squares",
        "Estefania Course",
        "Estell Overpass",
        "Eudora Ridge",
        "Ewell Canyon",
        "Fadel Valley",
        "Feest Wells",
        "Florine Brook",
        "Gerard Shoals",
        "Goldner Walks",
        "Graham Place",
        "Gregg Locks",
        "Gutmann Pines",
        "Gutmann Village",
        "Heidenreich Forge",
        "Hermann Stream",
        "Hessel Views",
        "Hilll Motorway",
        "Hilll Ville",
        "Imogene Walks",
        "Jaskolski Ways",
        "Jaylon Orchard",
        "Jazlyn Street",
        "Jenkins Mills",
        "Jesus Junction",
        "Jude Ville",
        "Kaycee Street",
        "Kemmer Keys",
        "Kilback Path",
        "Klocko Dale",
        "Kris Dale",
        "Kristy Trail",
        "Lamar Roads",
        "Lamont Camp",
        "Leffler Plains",
        "Lesly Glen",
        "Lewis Spring",
        "Lisandro Burgs",
        "Llewellyn Mill",
        "Lora Cliffs",
        "Lowe Lane",
        "Marjolaine View",
        "Mauricio Springs",
        "Mavis Camp",
        "Mayert Overpass",
        "Mollie Dale",
        "Mosciski Alley",
        "Muller Ridges",
        "Nathan Dale",
        "Neil Streets",
        "Nicola Circle",
        "Parker Landing",
        "Paucek Course",
        "Randi Pine",
        "Rau Walks",
        "Reese Points",
        "Rempel Forest",
        "Rosalee Keys",
        "Rosenbaum Stravenue",
        "Ruecker Fort",
        "Schmeler Garden",
        "Schulist Glens",
        "Sedrick Grove",
        "Shields Glen",
        "Sibyl Island",
        "Smitham Pass",
        "Stehr Island",
        "Swift Parkway",
        "Teagan Square",
        "Thompson Expressway",
        "Tia Expressway",
        "Toney Ridges",
        "Toni Pine",
        "Tony Prairie",
        "Tristian Mission",
        "Tyra Groves",
        "Ullrich Heights",
        "Vita Estates",
        "Von Tunnel",
        "Wilkinson Locks",
        "Wisozk Row",
        "Zulauf Roads"
    ];
}
