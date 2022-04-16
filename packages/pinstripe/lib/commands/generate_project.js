
import { spawnSync } from 'child_process';

export default async ({
   cliUtils: { extractArg, extractOptions },
   fsBuilder: { generateDir, generateFile, line, indent, echo }
}) => {
   const name = extractArg('');
   if(name == ''){
      console.error('A project name must be given.');
      process.exit();
   }

   const { with: dependencies } = extractOptions({
      with: []
   });

   if(!dependencies.includes('pinstripe')){
      dependencies.unshift('pinstripe')
   }

   await generateDir(name, async () => {

      await generateFile(`package.json`, () => {
         echo(JSON.stringify({
            type: "module",
            name,
            version: "0.0.0",
            license: "MIT",
            exports: {
               ".": "./lib/index.js"
            },
         }, null, 2));
      });

      await generateFile(`lib/index.js`, () => {
         line();
         line(`import { importAll } from 'pinstripe';`);
         dependencies.forEach((dependency) => {
            if(dependency != 'pinstripe') line(`import '${dependency}';`);
         });
         line();
         line(`importAll(import.meta.url);`);
         line();
      });

      await generateFile(`README.md`, () => {
         line();
         line(`# ${name}`);
         line();
         line('## Getting started');
         line();
         line('```bash');
         indent(() => {
            line('pinstripe init-database');
            line('pinstripe start-server');
         });
         line('```');
         line();
      });

      spawnSync('yarn', [ 'add', ...dependencies ], {
         stdio: 'inherit'
      });

   });
};
