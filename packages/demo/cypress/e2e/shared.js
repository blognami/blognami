const LOGO_PNG = "cypress/e2e/logo.png";

export function describeApp(role) {
  context(`When a ${role} user`, () => {
    beforeEach(() => {
      cy.visit("http://127.0.0.1:3000");
      cy.waitForLoadingToFinish();
      cy.window().then((window) => {
        window.isPersistentContext = true;
      });
      if (role == "admin") cy.signIn("admin@example.com");
    });

    afterEach(() => {
      cy.waitForLoadingToFinish();
      cy.window().its("isPersistentContext").should("equal", true);
      cy.resetDatabaseFromSql();
    });

    describe("the home page", () => {
      describeNavbar();

      describe("main", () => {
        it(`should have the correct contents`, () => {
          cy.getByTestId("main").contains("Alexandra Burgs");

          assertLoadMoreButtonWorks([
            "Ellsworth Squares",
            "Graham Place",
            "Jaskolski Ways",
            "Kris Dale",
            "Lowe Lane",
            "Nicola Circle",
            "Schmeler Garden",
            "Tia Expressway",
            "Wisozk Row",
            "Zulauf Roads",
          ]);
        });

        if (role == "admin") {
          describe("meta", () => {
            it(`should have an interface to allow the user to edit the meta title`, () => {
              cy.title().should("contain", "Lorem ipsum");
              cy.getByTestId("main", "home-meta").should(
                "not.contain",
                "Meta title: Lorem ipsum"
              );
              cy.title().should("not.contain", "Apple pear");
              cy.getByTestId("main", "home-meta").should(
                "not.contain",
                "Meta title: Apple pear"
              );
              cy.getByTestId("main", "edit-home-meta").click();
              cy.topModal().submitForm({ metaTitle: "Apple pear" });
              cy.title().should("contain", "Apple pear");
              cy.getByTestId("main", "home-meta").should(
                "contain",
                "Meta title: Apple pear"
              );
              cy.title().should("not.contain", "Lorem ipsum");
            });

            it(`should have an interface to allow the user to edit the meta description`, () => {
              cy.get("head meta[name=description]").should("not.exist");
              cy.getByTestId("main", "home-meta").should(
                "not.contain",
                "Meta description: Apple plum"
              );
              cy.getByTestId("main", "edit-home-meta").click();
              cy.topModal().submitForm({ metaDescription: "Apple plum" });
              cy.get("head meta[name=description]").should(
                "have.attr",
                "content",
                "Apple plum"
              );
              cy.getByTestId("main", "home-meta").should(
                "contain",
                "Meta description: Apple plum"
              );
            });
          });
        }
      });

      describeSidebar();

      describeFooter();
    });

    describe("a post page", () => {
      beforeEach(() => {
        cy.getByTestId("main").contains("Alexandra Burgs").click();
        cy.getByTestId("main", "post-title").contains("Alexandra Burgs");
      });

      describeNavbar();

      describe("main", () => {
        it(`should have the correct contents`, () => {
          cy.getByTestId("main").contains("Similique fuga consequatur");
        });

        it(`should have an interface to allow the user to add/edit/delete comments`, () => {
          cy.getByTestId("main").contains("Apple").should("not.exist");
          cy.getByTestId("main").contains("Pear").should("not.exist");
          cy.getByTestId("main", "comment-created-at").should("not.exist");
          cy.getByTestId("main", "add-comment").contains("Add comment").click();
          cy.topModal().contains("Cancel").click();
          cy.getByTestId("main", "add-comment").contains("Add comment").click();
          cy.topModal().contains("Add comment");
          if (role == "guest") {
            cy.topModal().submitForm({ email: "bob@example.com", legal: true });
            cy.topModal().submitForm({ password: "bob@example.com" });
            cy.topModal().submitForm({ name: "Bob" });
          }
          cy.topModal().submitForm({ body: "Apple" });
          cy.getByTestId("main").contains("Apple").should("exist");
          cy.getByTestId("main").contains("Pear").should("not.exist");
          cy.getByTestId("main", "comment-created-at").should(
            "not.contain",
            "Invalid DateTime"
          );
          cy.getByTestId("main", "edit-comment").contains("Edit").click();
          cy.topModal().submitForm({ body: "Pear" });
          cy.getByTestId("main").contains("Apple").should("not.exist");
          cy.getByTestId("main").contains("Pear").should("exist");
          cy.getByTestId("main", "delete-comment").contains("Delete").click();
          cy.getByTestId("main").contains("Apple").should("not.exist");
          cy.getByTestId("main").contains("Pear").should("not.exist");
          cy.getByTestId("main", "comment-created-at").should("not.exist");
        });

        it(`should have an interface to allow the user to navigate to the previous/next posts`, () => {
          const postTitles = POST_TITLES.slice(0, 11);
          postTitles.forEach((postTitle, i) => {
            cy.getByTestId("main", "post-title").contains(postTitle);
            if (i < postTitles.length - 1)
              cy.getByTestId("main", "previous-post").click();
          });

          postTitles.reverse();

          postTitles.forEach((postTitle, i) => {
            cy.getByTestId("main", "post-title").contains(postTitle);
            if (i < postTitles.length - 1)
              cy.getByTestId("main", "next-post").click();
          });
        });

        if (role == "admin") {
          it(`should have an interface to allow the user to unpublish/publish the post`, () => {
            cy.getByTestId("main", "unpublish-post").should(
              "contain",
              "Unpublish"
            ).click();

            cy.getByTestId("main", "unpublish-post").should("not.exist");

            cy.getByTestId("main", "publish-post").should(
              "contain",
              "Publish"
            ).click();

            cy.topModal().submitForm({
               notifySubscribers: true,
            });

            cy.getByTestId("main", "publish-post").should("not.exist");

            cy.getByTestId("main", "unpublish-post").should(
              "contain",
              "Unpublish"
            );
          });

          it(`should have an interface to allow the user to edit the title`, () => {
            cy.getByTestId("main", "post-title").should(
              "not.contain",
              "Apple pear"
            );
            cy.getByTestId("main", "edit-post-title").click();
            cy.topModal().submitForm({ title: "Apple pear" });
            cy.getByTestId("main", "post-title").should(
              "contain",
              "Apple pear"
            );
          });

          it(`should have an interface to allow the user to edit the body`, () => {
            cy.getByTestId("main", "post-body").should(
              "not.contain",
              "Pear plum"
            );
            cy.getByTestId("main", "edit-post-body").click();
            cy.topModal().submitForm({ body: "Pear plum" });
            cy.getByTestId("main", "post-body").should("contain", "Pear plum");

            cy.getByTestId("main", "post-body").should(
              "not.contain",
              "Peach plum"
            );
            cy.getByTestId("main", "edit-post-body").click();
            cy.topModal().submitForm({ body: "Peach plum" });
            cy.getByTestId("main", "post-body").should("contain", "Peach plum");

            cy.getByTestId("main", "post-body").should(
              "not.contain",
              "Pear plum"
            );
            cy.getByTestId("main", "edit-post-body").click();
            cy.topModal().getByTestId("revisions").click();
            cy.topModal().find("tbody > tr").should("have.length", 2);
            cy.topModal().find("tbody > tr:last-child a").click();
            cy.topModal().submitForm({});
            cy.getByTestId("main", "post-body").should("contain", "Pear plum");

            cy.getByTestId("main", "post-body")
              .find('img[src="/logo-png"]')
              .should("not.exist");
            cy.getByTestId("main", "edit-post-body").click();
            cy.topModal().find('textarea[name="body"]').click();
            cy.topModal().find('textarea[name="value"]');
            cy.focused().clear().type(`/image`);
            cy.topModal().find("button").contains("Add Image").click();
            cy.topModal()
              .find('input[type="file"][name="file"]')
              .selectFile(LOGO_PNG);
            cy.topModal().find('button[type="submit"]').click();
            cy.waitForLoadingToFinish();
            cy.closeTopModal();
            cy.topModal().find('button[type="submit"]').click();
            cy.waitForLoadingToFinish();
            cy.getByTestId("main", "post-body")
              .find('img[src="/logo-png"]')
              .should("exist");
          });

          describe("tags", () => {
            it(`should have an interface to allow the user to edit the tags`, () => {
              ["Apple", "Pear", "Plum"].forEach((name) => {
                cy.getByTestId("navbar", "add-content").click();
                cy.topPopover().getByTestId("add-tag").click();
                cy.topModal().contains("Add tag");
                cy.topModal().submitForm({ name });
                cy.url().should("contain", name.toLowerCase());
                cy.go("back");
              });
              ["Apple", "Pear", "Plum"].forEach((title) => {
                cy.getByTestId("sidebar", "tags-section").should(
                  "not.contain",
                  title
                );
              });
              cy.getByTestId("main", "tagable-tags").should(
                "contain",
                "Tags: none"
              );
              cy.getByTestId("main", "edit-tagable-tags").click();
              ["Apple", "Pear", "Plum"].forEach((name) => {
                cy.topModal().contains(name).click();
                cy.waitForLoadingToFinish();
              });
              cy.closeTopModal();
              cy.getByTestId("main", "tagable-tags").should(
                "contain",
                'Tags: "Apple", "Pear", "Plum"'
              );
              ["Apple", "Pear", "Plum"].forEach((title) => {
                cy.getByTestId("sidebar", "tags-section").should(
                  "contain",
                  title
                );
              });
            });
          });

          describe("meta", () => {
            it(`should have an interface to allow the user to edit the meta title`, () => {
              cy.title().should("contain", "Alexandra Burgs");
              cy.getByTestId("main", "post-meta").should(
                "not.contain",
                "Meta title: Alexandra Burgs"
              );
              cy.title().should("not.contain", "Apple pear");
              cy.getByTestId("main", "post-meta").should(
                "not.contain",
                "Meta title: Apple pear"
              );
              cy.getByTestId("main", "edit-post-meta").click();
              cy.topModal().submitForm({ metaTitle: "Apple pear" });
              cy.title().should("contain", "Apple pear");
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Meta title: Apple pear"
              );
              cy.title().should("not.contain", "Alexandra Burgs");
            });

            it(`should have an interface to allow the user to edit the meta description`, () => {
              cy.get("head meta[name=description]").should("not.exist");
              cy.getByTestId("main", "post-meta").should(
                "not.contain",
                "Meta description: Apple plum"
              );
              cy.getByTestId("main", "edit-post-meta").click();
              cy.topModal().submitForm({ metaDescription: "Apple plum" });
              cy.get("head meta[name=description]").should(
                "have.attr",
                "content",
                "Apple plum"
              );
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Meta description: Apple plum"
              );
            });

            it(`should have an interface to allow the user to edit the slug`, () => {
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Slug: alexandra-burgs"
              );
              cy.url().should("contain", "/alexandra-burgs");
              cy.getByTestId("main", "post-meta").should(
                "not.contain",
                "Slug: foo-bar"
              );
              cy.url().should("not.contain", "/foo-bar");
              cy.getByTestId("main", "edit-post-meta").click();
              cy.topModal().submitForm({ slug: "foo-bar" });
              cy.getByTestId("main", "post-meta").should(
                "not.contain",
                "Slug: alexandra-burgs"
              );
              cy.url().should("not.contain", "/alexandra-burgs");
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Slug: foo-bar"
              );
              cy.url().should("contain", "/foo-bar");
            });

            it(`should have an interface to allow the user to edit the featured flag`, () => {
              cy.getByTestId("sidebar", "featured-section").should(
                "not.contain",
                "Alexandra Burgs"
              );
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Featured: false"
              );

              cy.getByTestId("main", "edit-post-meta").click();
              cy.topModal().submitForm({ featured: true });
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Featured: true"
              );
              cy.getByTestId("sidebar", "featured-section").should(
                "contain",
                "Alexandra Burgs"
              );

              cy.getByTestId("main", "edit-post-meta").click();
              cy.topModal().submitForm({ featured: false });
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Featured: false"
              );
              cy.getByTestId("sidebar", "featured-section").should(
                "not.contain",
                "Alexandra Burgs"
              );
            });

            it(`should have an interface to allow the user to edit the enableComments flag`, () => {
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Enable comments: true"
              );
              cy.getByTestId("main", "add-comment").should("exist");

              cy.getByTestId("main", "edit-post-meta").click();
              cy.topModal().submitForm({ enableComments: false });
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Enable comments: false"
              );
              cy.getByTestId("main", "add-comment").should("not.exist");

              cy.getByTestId("main", "edit-post-meta").click();
              cy.topModal().submitForm({ enableComments: true });
              cy.getByTestId("main", "post-meta").should(
                "contain",
                "Enable comments: true"
              );
              cy.getByTestId("main", "add-comment").should("exist");
            });
          });

          it(`should have an interface to allow the user to delete the current post`, () => {
            cy.getByTestId("main", "post-title").should("exist");
            cy.getByTestId("main", "toggle-danger-area").click();
            cy.getByTestId("main", "delete-post").click();
            cy.getByTestId("main", "post-title").should("not.exist");
          });
        }
      });

      describeSidebar();

      describeFooter();
    });

    describe("a basic page", () => {
      beforeEach(() => {
        cy.getByTestId("sidebar").contains("Osinski Extensions").click();
        cy.getByTestId("main").contains("h1", "Osinski Extensions");
      });

      describeNavbar();

      describe("main", () => {
        it(`should have the correct contents`, () => {
          cy.getByTestId("main").contains("Similique molestias illum");
        });

        if (role == "admin") {
          it(`should have an interface to allow the user to edit the title`, () => {
            cy.getByTestId("main", "page-title").should(
              "not.contain",
              "Apple pear"
            );
            cy.getByTestId("main", "edit-page-title").click();
            cy.topModal().submitForm({ title: "Apple pear" });
            cy.getByTestId("main", "page-title").should(
              "contain",
              "Apple pear"
            );
          });

          it(`should have an interface to allow the user to edit the body`, () => {
            cy.getByTestId("main", "page-body").should(
              "not.contain",
              "Pear plum"
            );
            cy.getByTestId("main", "edit-page-body").click();
            cy.topModal().submitForm({ body: "Pear plum" });
            cy.getByTestId("main", "page-body").should("contain", "Pear plum");

            cy.getByTestId("main", "page-body").should(
              "not.contain",
              "Peach plum"
            );
            cy.getByTestId("main", "edit-page-body").click();
            cy.topModal().submitForm({ body: "Peach plum" });
            cy.getByTestId("main", "page-body").should("contain", "Peach plum");

            cy.getByTestId("main", "page-body").should(
              "not.contain",
              "Pear plum"
            );
            cy.getByTestId("main", "edit-page-body").click();
            cy.topModal().getByTestId("revisions").click();
            cy.topModal().find("tbody > tr").should("have.length", 2);
            cy.topModal().find("tbody > tr:last-child a").click();
            cy.topModal().submitForm({});
            cy.getByTestId("main", "page-body").should("contain", "Pear plum");

            cy.getByTestId("main", "page-body")
              .find('img[src="/logo-png"]')
              .should("not.exist");
            cy.getByTestId("main", "edit-page-body").click();
            cy.topModal().find('textarea[name="body"]').click();
            cy.topModal().find('textarea[name="value"]');
            cy.focused().clear().type(`/image`);
            cy.topModal().find("button").contains("Add Image").click();
            cy.topModal()
              .find('input[type="file"][name="file"]')
              .selectFile(LOGO_PNG);
            cy.topModal().find('button[type="submit"]').click();
            cy.waitForLoadingToFinish();
            cy.closeTopModal();
            cy.topModal().find('button[type="submit"]').click();
            cy.waitForLoadingToFinish();
            cy.getByTestId("main", "page-body")
              .find('img[src="/logo-png"]')
              .should("exist");
          });

          describe("meta", () => {
            it(`should have an interface to allow the user to edit the meta title`, () => {
              cy.title().should("contain", "Osinski Extensions");
              cy.getByTestId("main", "page-meta").should(
                "not.contain",
                "Meta title: Osinski Extensions"
              );
              cy.title().should("not.contain", "Apple pear");
              cy.getByTestId("main", "page-meta").should(
                "not.contain",
                "Meta title: Apple pear"
              );
              cy.getByTestId("main", "edit-page-meta").click();
              cy.topModal().submitForm({ metaTitle: "Apple pear" });
              cy.title().should("contain", "Apple pear");
              cy.getByTestId("main", "page-meta").should(
                "contain",
                "Meta title: Apple pear"
              );
              cy.title().should("not.contain", "Osinski Extensions");
            });

            it(`should have an interface to allow the user to edit the meta description`, () => {
              cy.get("head meta[name=description]").should("not.exist");
              cy.getByTestId("main", "page-meta").should(
                "not.contain",
                "Meta description: Apple plum"
              );
              cy.getByTestId("main", "edit-page-meta").click();
              cy.topModal().submitForm({ metaDescription: "Apple plum" });
              cy.get("head meta[name=description]").should(
                "have.attr",
                "content",
                "Apple plum"
              );
              cy.getByTestId("main", "page-meta").should(
                "contain",
                "Meta description: Apple plum"
              );
            });

            it(`should have an interface to allow the user to edit the slug`, () => {
              cy.getByTestId("main", "page-meta").should(
                "contain",
                "Slug: osinski-extensions"
              );
              cy.url().should("contain", "/osinski-extensions");
              cy.getByTestId("main", "page-meta").should(
                "not.contain",
                "Slug: foo-bar"
              );
              cy.url().should("not.contain", "/foo-bar");
              cy.getByTestId("main", "edit-page-meta").click();
              cy.topModal().submitForm({ slug: "foo-bar" });
              cy.getByTestId("main", "page-meta").should(
                "not.contain",
                "Slug: osinski-extensions"
              );
              cy.url().should("not.contain", "/osinski-extensions");
              cy.getByTestId("main", "page-meta").should(
                "contain",
                "Slug: foo-bar"
              );
              cy.url().should("contain", "/foo-bar");
            });

            it(`should have an interface to allow the user to edit the published flag`, () => {
              cy.getByTestId("main", "page-meta").should(
                "contain",
                "Published: true"
              );

              cy.getByTestId("main", "edit-page-meta").click();
              cy.topModal().submitForm({ published: false });
              cy.getByTestId("main", "page-meta").should(
                "contain",
                "Published: false"
              );

              cy.getByTestId("main", "edit-page-meta").click();
              cy.topModal().submitForm({ published: true });
              cy.getByTestId("main", "page-meta").should(
                "contain",
                "Published: true"
              );
            });
          });

          it(`should have an interface to allow the user to delete the current page`, () => {
            cy.getByTestId("main", "page-title").should("exist");
            cy.getByTestId("main", "toggle-danger-area").click();
            cy.getByTestId("main", "delete-page").click();
            cy.getByTestId("main", "page-title").should("not.exist");
          });
        }
      });

      describeSidebar();

      describeFooter();
    });

    describe("a tag page", () => {
      beforeEach(() => {
        cy.getByTestId("sidebar").contains("Excepturi Corporis").click();
        cy.getByTestId("main").contains("h2", "Excepturi Corporis");
      });

      describeNavbar();

      describe("main", () => {
        it(`should have the correct contents`, () => {
          cy.getByTestId("main").contains("Altenwerth Ford");

          assertLoadMoreButtonWorks([
            "Parker Landing",
            "Toni Pine",
            "Zulauf Roads",
          ]);
        });

        if (role == "admin") {
          describe("meta", () => {
            it(`should have an interface to allow the user to edit the meta title`, () => {
              cy.title().should("contain", "Excepturi Corporis");
              cy.getByTestId("main", "tag-meta").should(
                "not.contain",
                "Meta title: Excepturi Corporis"
              );
              cy.title().should("not.contain", "Apple pear");
              cy.getByTestId("main", "tag-meta").should(
                "not.contain",
                "Meta title: Apple pear"
              );
              cy.getByTestId("main", "edit-tag-meta").click();
              cy.topModal().submitForm({ metaTitle: "Apple pear" });
              cy.title().should("contain", "Apple pear");
              cy.getByTestId("main", "tag-meta").should(
                "contain",
                "Meta title: Apple pear"
              );
              cy.title().should("not.contain", "Excepturi Corporis");
            });

            it(`should have an interface to allow the user to edit the meta description`, () => {
              cy.get("head meta[name=description]").should("not.exist");
              cy.getByTestId("main", "tag-meta").should(
                "not.contain",
                "Meta description: Apple plum"
              );
              cy.getByTestId("main", "edit-tag-meta").click();
              cy.topModal().submitForm({ metaDescription: "Apple plum" });
              cy.get("head meta[name=description]").should(
                "have.attr",
                "content",
                "Apple plum"
              );
              cy.getByTestId("main", "tag-meta").should(
                "contain",
                "Meta description: Apple plum"
              );
            });

            it(`should have an interface to allow the user to edit the name`, () => {
              cy.getByTestId("main", "tag-meta").should(
                "contain",
                "Name: Excepturi Corporis"
              );

              cy.getByTestId("main", "edit-tag-meta").click();
              cy.topModal().submitForm({ name: "Foo bar" });
              cy.getByTestId("main", "tag-meta").should(
                "contain",
                "Name: Foo bar"
              );

              cy.getByTestId("main", "edit-tag-meta").click();
              cy.topModal().submitForm({ name: "Excepturi Corporis" });
              cy.getByTestId("main", "tag-meta").should(
                "contain",
                "Name: Excepturi Corporis"
              );
            });

            it(`should have an interface to allow the user to edit the slug`, () => {
              cy.getByTestId("main", "tag-meta").should(
                "contain",
                "Slug: excepturi-corporis"
              );
              cy.url().should("contain", "/excepturi-corporis");
              cy.getByTestId("main", "tag-meta").should(
                "not.contain",
                "Slug: foo-bar"
              );
              cy.url().should("not.contain", "/foo-bar");
              cy.getByTestId("main", "edit-tag-meta").click();
              cy.topModal().submitForm({ slug: "foo-bar" });
              cy.getByTestId("main", "tag-meta").should(
                "not.contain",
                "Slug: excepturi-corporis"
              );
              cy.url().should("not.contain", "/excepturi-corporis");
              cy.getByTestId("main", "tag-meta").should(
                "contain",
                "Slug: foo-bar"
              );
              cy.url().should("contain", "/foo-bar");
            });
          });

          it(`should have an interface to allow the user to delete the current tag`, () => {
            cy.getByTestId("main", "tag-meta").should("exist");
            cy.getByTestId("main", "toggle-danger-area").click();
            cy.getByTestId("main", "delete-tag").click();
            cy.getByTestId("main", "tag-meta").should("not.exist");
          });
        }
      });

      describeSidebar();

      describeFooter();
    });

    describe("a user page", () => {
      beforeEach(() => {
        cy.getByTestId("main").contains("Alexandra Burgs").click();
        cy.getByTestId("main").contains("h1", "Alexandra Burgs");
        cy.getByTestId("main").contains("Admin").click();
        cy.getByTestId("main").contains("h2", "Admin");
      });

      describeNavbar();

      describe("main", () => {
        it(`should have the correct contents`, () => {
          cy.getByTestId("main").contains("Alexandra Burgs");

          assertLoadMoreButtonWorks([
            "Ellsworth Squares",
            "Graham Place",
            "Jaskolski Ways",
            "Kris Dale",
            "Lowe Lane",
            "Nicola Circle",
            "Schmeler Garden",
            "Tia Expressway",
            "Wisozk Row",
            "Zulauf Roads",
          ]);
        });

        if (role == "admin") {
          describe("meta", () => {
            it(`should have an interface to allow the user to edit the name`, () => {
              cy.getByTestId("main", "user-meta").should(
                "contain",
                "Name: Admin"
              );

              cy.getByTestId("main", "edit-user-meta").click();
              cy.topModal().submitForm({ name: "Foo bar" });
              cy.getByTestId("main", "user-meta").should(
                "contain",
                "Name: Foo bar"
              );

              cy.getByTestId("main", "edit-user-meta").click();
              cy.topModal().submitForm({ name: "Admin" });
              cy.getByTestId("main", "user-meta").should(
                "contain",
                "Name: Admin"
              );
            });

            it(`should have an interface to allow the user to edit the meta title`, () => {
              cy.title().should("contain", "Admin");
              cy.getByTestId("main", "user-meta").should(
                "not.contain",
                "Meta title: Admin"
              );
              cy.title().should("not.contain", "Apple pear");
              cy.getByTestId("main", "user-meta").should(
                "not.contain",
                "Meta title: Apple pear"
              );
              cy.getByTestId("main", "edit-user-meta").click();
              cy.topModal().submitForm({ metaTitle: "Apple pear" });
              cy.title().should("contain", "Apple pear");
              cy.getByTestId("main", "user-meta").should(
                "contain",
                "Meta title: Apple pear"
              );
              cy.title().should("not.contain", "Admin");
            });

            it(`should have an interface to allow the user to edit the meta description`, () => {
              cy.get("head meta[name=description]").should("not.exist");
              cy.getByTestId("main", "user-meta").should(
                "not.contain",
                "Meta description: Apple plum"
              );
              cy.getByTestId("main", "edit-user-meta").click();
              cy.topModal().submitForm({ metaDescription: "Apple plum" });
              cy.get("head meta[name=description]").should(
                "have.attr",
                "content",
                "Apple plum"
              );
              cy.getByTestId("main", "user-meta").should(
                "contain",
                "Meta description: Apple plum"
              );
            });

            it(`should have an interface to allow the user to edit the slug`, () => {
              cy.getByTestId("main", "user-meta").should(
                "contain",
                "Slug: admin"
              );
              cy.url().should("contain", "/admin");
              cy.getByTestId("main", "user-meta").should(
                "not.contain",
                "Slug: foo-bar"
              );
              cy.url().should("not.contain", "/foo-bar");
              cy.getByTestId("main", "edit-user-meta").click();
              cy.topModal().submitForm({ slug: "foo-bar" });
              cy.getByTestId("main", "user-meta").should(
                "not.contain",
                "Slug: admin"
              );
              cy.url().should("not.contain", "/admin");
              cy.getByTestId("main", "user-meta").should(
                "contain",
                "Slug: foo-bar"
              );
              cy.url().should("contain", "/foo-bar");
            });
          });

          it(`should have an interface to allow the user to delete the current user - but a user can't delete themself`, () => {
            cy.getByTestId("main", "user-meta").should("exist");
            cy.getByTestId("main", "toggle-danger-area").click();
            cy.getByTestId("main", "delete-user").click();
            cy.topModal().contains("Access denied");
            cy.topModal().contains(
              `You can't delete your own account - another admin must do this for you.`
            );
            cy.topModal().contains("OK").click();
            cy.getByTestId("main", "user-meta").should("exist");

            cy.getByTestId("navbar", "add-content").click();
            cy.topPopover().getByTestId("add-user").click();
            cy.topModal().contains("Add user");
            cy.topModal().submitForm({
              name: "Apple Orange",
              email: "apple.orange@example.com",
            });
            cy.url().should("contain", "apple-orange");
            cy.getByTestId("main", "user-meta").should("exist");
            cy.getByTestId("main", "toggle-danger-area").click();
            cy.getByTestId("main", "delete-user").click();
            cy.getByTestId("main", "user-meta").should("not.exist");
          });
        }
      });

      describeSidebar();

      describeFooter();
    });
  });

  function describeNavbar() {
    describe("navbar", () => {
      it(`should have the correct contents`, () => {
        cy.getByTestId("navbar", "title").contains("Lorem ipsum");
        if (role == "admin") {
          cy.getByTestId("navbar", "find-content").contains("Find");
          cy.getByTestId("navbar", "add-content").contains("Add");
          cy.getByTestId("navbar", "edit-settings").contains("Settings");
          cy.getByTestId("navbar", "your-account").contains("Admin");
        } else {
          cy.getByTestId("navbar", "sign-in").contains("Sign in");
        }
      });

      if (role == "admin") {
        it(`should have an interface to allow the user to add a page`, () => {
          cy.getByTestId("navbar", "add-content").click();
          cy.topPopover().getByTestId("add-page").click();
          cy.topModal().contains("Add page");
          cy.topModal().submitForm({ title: "Apple plum" });
          cy.url().should("contain", "apple-plum");
        });
        it(`should have an interface to allow the user to add a post`, () => {
          cy.getByTestId("navbar", "add-content").click();
          cy.topPopover().getByTestId("add-post").click();
          cy.topModal().contains("Add post");
          cy.topModal().submitForm({ title: "Apple pear" });
          cy.url().should("contain", "apple-pear");
        });
        it(`should have an interface to allow the user to add a tag`, () => {
          cy.getByTestId("navbar", "add-content").click();
          cy.topPopover().getByTestId("add-tag").click();
          cy.topModal().contains("Add tag");
          cy.topModal().submitForm({ name: "Apple peach" });
          cy.url().should("contain", "apple-peach");
        });
        it(`should have an interface to allow the user to add a user`, () => {
          cy.getByTestId("navbar", "add-content").click();
          cy.topPopover().getByTestId("add-user").click();
          cy.topModal().contains("Add user");
          cy.topModal().submitForm({
            name: "Apple Orange",
            email: "apple.orange@example.com",
          });
          cy.url().should("contain", "apple-orange");
        });

        it(`should have an interface to allow the user to find a post`, () => {
          cy.getByTestId("navbar", "find-content").click();
          cy.topPopover().getByTestId("find-post").click();
          cy.topModal().contains("Posts");
          cy.topModal().should("not.contain", "Graham Place");
          cy.topModal().find("input").type("Graham Place");
          cy.topModal().contains("Graham Place").click();
          cy.url().should("contain", "graham-place");
        });

        it(`should have an interface to allow the user to edit the site settings`, () => {
          cy.getByTestId("navbar").should("contain", "Lorem ipsum");
          cy.getByTestId("navbar").should("not.contain", "Apple peach");
          cy.getByTestId("navbar", "edit-settings").click();
          cy.topPopover().getByTestId("edit-site-meta").click();
          cy.topModal().contains("Edit site");
          cy.topModal().submitForm({ title: "Apple peach" });
          cy.getByTestId("navbar").should("contain", "Apple peach");
          cy.getByTestId("navbar").should("not.contain", "Lorem ipsum");
        });
      }
    });
  }

  function describeSidebar() {
    describe("sidebar", () => {
      it(`should have the correct contents`, () => {
        cy.getByTestId("sidebar", "about-section").contains("About");
        cy.getByTestId("sidebar", "about-section").contains(
          "Provident itaque iste."
        );

        cy.getByTestId("sidebar", "featured-section").contains("Featured");
        ["Gregg Locks", "Imogene Walks", "Mayert Overpass"].forEach((title) => {
          cy.getByTestId("sidebar", "featured-section").contains(title);
        });

        cy.getByTestId("sidebar", "tags-section").contains("Tags");
        ["Excepturi Corporis", "34 posts"].forEach((title) => {
          cy.getByTestId("sidebar", "tags-section").contains(title);
        });
      });
    });
  }

  function describeFooter() {
    describe(`footer`, () => {
      it(`should have the correct contents`, () => {
        cy.getByTestId("footer").contains("Lorem ipsum");
        cy.getByTestId("footer").contains("Powered by Blognami");
      });
    });
  }

  function assertLoadMoreButtonWorks(expectedTitles) {
    expectedTitles.forEach((expectedTitle) => {
      cy.getByTestId("main", "load-more").click();
      cy.getByTestId("main").contains(expectedTitle);
    });

    cy.getByTestId("main", "load-more").should("not.exist");
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
    "Zulauf Roads",
  ];
}
