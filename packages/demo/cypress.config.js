import { defineConfig } from "cypress";
import { execSync } from 'child_process';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',

    setupNodeEvents(on, config) {
      on('after:spec', () => {
        execSync(`pinstripe reset-database`, {
          stdio: 'inherit'
        });
      });
    },
  },
});
