import { defineConfig } from "cypress";
import { execSync } from 'child_process';
import fs from 'fs';

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',

    defaultCommandTimeout: 10000,

    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            fs.unlinkSync(results.video)
          }
        }
      });
    },
  },
  
  video: process.env.CI == 'true'
});
