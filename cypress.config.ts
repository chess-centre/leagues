import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/(e2e|integration)/**/*.cy.{js,ts,jsx,tsx}",
    baseUrl: "http://localhost:3000/",
    video: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
