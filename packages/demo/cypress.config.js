import { defineConfig } from "cypress";
import { execSync } from 'child_process';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',

    setupNodeEvents(on, config) {
      on('task', {
        'database:reset-from-sql': () => {
          execSync(`pinstripe database:reset-from-sql`, {
            stdio: 'inherit'
          });
          return null;
        }
      })
    },
  },
  video: false
});
