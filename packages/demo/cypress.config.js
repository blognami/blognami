import { defineConfig } from "cypress";
import { execSync } from 'child_process';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',

    setupNodeEvents(on, config) {
      on('task', {
        'reset-database-from-sql': () => {
          execSync(`blognami reset-database-from-sql`, {
            stdio: 'inherit'
          });
          return null;
        }
      })
    },
  },
  video: false
});
