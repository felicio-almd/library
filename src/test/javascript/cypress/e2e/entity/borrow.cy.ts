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

describe('Borrow e2e test', () => {
  const borrowPageUrl = '/borrow';
  const borrowPageUrlPattern = new RegExp('/borrow(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const borrowSample = { borrowDateTime: '2025-01-24T11:03:32.917Z' };

  let borrow;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/borrows+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/borrows').as('postEntityRequest');
    cy.intercept('DELETE', '/api/borrows/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (borrow) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/borrows/${borrow.id}`,
      }).then(() => {
        borrow = undefined;
      });
    }
  });

  it('Borrows menu should load Borrows page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('borrow');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Borrow').should('exist');
    cy.url().should('match', borrowPageUrlPattern);
  });

  describe('Borrow page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(borrowPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Borrow page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/borrow/new$'));
        cy.getEntityCreateUpdateHeading('Borrow');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/borrows',
          body: borrowSample,
        }).then(({ body }) => {
          borrow = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/borrows+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/borrows?page=0&size=20>; rel="last",<http://localhost/api/borrows?page=0&size=20>; rel="first"',
              },
              body: [borrow],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(borrowPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Borrow page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('borrow');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowPageUrlPattern);
      });

      it('edit button click should load edit Borrow page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Borrow');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowPageUrlPattern);
      });

      it('edit button click should load edit Borrow page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Borrow');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowPageUrlPattern);
      });

      it('last delete button click should delete instance of Borrow', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('borrow').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', borrowPageUrlPattern);

        borrow = undefined;
      });
    });
  });

  describe('new Borrow page', () => {
    beforeEach(() => {
      cy.visit(`${borrowPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Borrow');
    });

    it('should create an instance of Borrow', () => {
      cy.get(`[data-cy="borrowDateTime"]`).type('2025-01-23T17:52');
      cy.get(`[data-cy="borrowDateTime"]`).blur();
      cy.get(`[data-cy="borrowDateTime"]`).should('have.value', '2025-01-23T17:52');

      cy.get(`[data-cy="returnDateTime"]`).type('2025-01-24T04:20');
      cy.get(`[data-cy="returnDateTime"]`).blur();
      cy.get(`[data-cy="returnDateTime"]`).should('have.value', '2025-01-24T04:20');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        borrow = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', borrowPageUrlPattern);
    });
  });
});
