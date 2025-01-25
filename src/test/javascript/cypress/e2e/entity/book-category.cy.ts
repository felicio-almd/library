import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('BookCategory e2e test', () => {
  const bookCategoryPageUrl = '/book-category';
  const bookCategoryPageUrlPattern = new RegExp('/book-category(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const bookCategorySample = { name: 'upon' };

  let bookCategory;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/book-categories+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/book-categories').as('postEntityRequest');
    cy.intercept('DELETE', '/api/book-categories/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (bookCategory) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/book-categories/${bookCategory.id}`,
      }).then(() => {
        bookCategory = undefined;
      });
    }
  });

  it('BookCategories menu should load BookCategories page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('book-category');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BookCategory').should('exist');
    cy.url().should('match', bookCategoryPageUrlPattern);
  });

  describe('BookCategory page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(bookCategoryPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create BookCategory page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/book-category/new$'));
        cy.getEntityCreateUpdateHeading('BookCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCategoryPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/book-categories',
          body: bookCategorySample,
        }).then(({ body }) => {
          bookCategory = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/book-categories+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/book-categories?page=0&size=20>; rel="last",<http://localhost/api/book-categories?page=0&size=20>; rel="first"',
              },
              body: [bookCategory],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(bookCategoryPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details BookCategory page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('bookCategory');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCategoryPageUrlPattern);
      });

      it('edit button click should load edit BookCategory page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BookCategory');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCategoryPageUrlPattern);
      });

      it('edit button click should load edit BookCategory page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BookCategory');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCategoryPageUrlPattern);
      });

      it('last delete button click should delete instance of BookCategory', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('bookCategory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookCategoryPageUrlPattern);

        bookCategory = undefined;
      });
    });
  });

  describe('new BookCategory page', () => {
    beforeEach(() => {
      cy.visit(`${bookCategoryPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('BookCategory');
    });

    it('should create an instance of BookCategory', () => {
      cy.get(`[data-cy="name"]`).type('lest');
      cy.get(`[data-cy="name"]`).should('have.value', 'lest');

      cy.get(`[data-cy="description"]`).type('polarisation');
      cy.get(`[data-cy="description"]`).should('have.value', 'polarisation');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        bookCategory = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', bookCategoryPageUrlPattern);
    });
  });
});
