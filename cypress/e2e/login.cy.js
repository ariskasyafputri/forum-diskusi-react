describe('Login Flow', () => {

  it('should login successfully', () => {

    cy.visit('/login');

    cy.get('input[placeholder="Email"]')
      .type('test@mail.com');

    cy.get('input[placeholder="Password"]')
      .type('password');

    cy.get('button')
      .contains('Login')
      .click();

    cy.url().should('include', '/');

  });

});