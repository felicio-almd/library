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

describe('BookLocation e2e test', () => {
  const bookLocationPageUrl = '/book-location';
  const bookLocationPageUrlPattern = new RegExp('/book-location(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const bookLocationSample = { aisle: 'woot', shelf: 'gosh restaurant however' };

  let bookLocation;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/book-locations+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/book-locations').as('postEntityRequest');
    cy.intercept('DELETE', '/api/book-locations/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (bookLocation) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/book-locations/${bookLocation.id}`,
      }).then(() => {
        bookLocation = undefined;
      });
    }
  });

  it('BookLocations menu should load BookLocations page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('book-location');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('BookLocation').should('exist');
    cy.url().should('match', bookLocationPageUrlPattern);
  });

  describe('BookLocation page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(bookLocationPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create BookLocation page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/book-location/new$'));
        cy.getEntityCreateUpdateHeading('BookLocation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookLocationPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/book-locations',
          body: bookLocationSample,
        }).then(({ body }) => {
          bookLocation = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/book-locations+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/book-locations?page=0&size=20>; rel="last",<http://localhost/api/book-locations?page=0&size=20>; rel="first"',
              },
              body: [bookLocation],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(bookLocationPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details BookLocation page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('bookLocation');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookLocationPageUrlPattern);
      });

      it('edit button click should load edit BookLocation page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BookLocation');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookLocationPageUrlPattern);
      });

      it('edit button click should load edit BookLocation page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('BookLocation');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookLocationPageUrlPattern);
      });

      it('last delete button click should delete instance of BookLocation', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('bookLocation').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bookLocationPageUrlPattern);

        bookLocation = undefined;
      });
    });
  });

  describe('new BookLocation page', () => {
    beforeEach(() => {
      cy.visit(`${bookLocationPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('BookLocation');
    });

    it('should create an instance of BookLocation', () => {
      cy.get(`[data-cy="aisle"]`).type('tinted frightfully than');
      cy.get(`[data-cy="aisle"]`).should('have.value', 'tinted frightfully than');

      cy.get(`[data-cy="shelf"]`).type('lest uh-huh');
      cy.get(`[data-cy="shelf"]`).should('have.value', 'lest uh-huh');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        bookLocation = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', bookLocationPageUrlPattern);
    });
  });
});
