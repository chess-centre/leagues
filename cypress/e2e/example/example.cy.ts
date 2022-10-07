describe("Cypress init", () => {
  it("Check homepage is rendered", () => {
    cy.visit("/");
    cy.findByText(/Hello World!/i);
  });
});

export {};
