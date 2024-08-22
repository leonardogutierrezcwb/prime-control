const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Adicione seus event listeners aqui, se necessário.
    },
    baseUrl: 'https://challenge.primecontrol.com.br',
    viewportWidth: 1024,
    viewportHeight: 768,
    browser: "chrome",
    chromeWebSecurity: false,
    args: ["--incognito"]
  }
});

const { verifyDownloadTasks } = require('cy-verify-downloads');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', verifyDownloadTasks);
      
    },
  },
});