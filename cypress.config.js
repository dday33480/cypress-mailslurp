const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    MAILSLURP_API_KEY:
    "f7c65f93cb77941029a21a9fe83cd0ccf9a2ea85d808b47cc96d7c24c6c484ec"
  },
  e2e: {
    defaultCommandTimeout: 40000,
    responseTimeout: 40000,
    requestTimeout: 40000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
