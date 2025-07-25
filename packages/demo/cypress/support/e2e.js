// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

Cypress.on('uncaught:exception', (error, runnable) => {
    console.error(error);
    return false;
});

Cypress.on('window:before:load', (win) => {
  // Unregister all service workers before the test
  if ('serviceWorker' in win.navigator) {
    win.navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
});


// Alternatively you can use CommonJS syntax:
// require('./commands')