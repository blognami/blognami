
import { spawnSync } from 'child_process';
import * as crypto from 'crypto';

const defaultDependencies = [
   'blognami'
];

export default {
   meta(){
      this.assignProps({
          external: true,
          internal: false
      });
  },

   async run(){
      const name = this.params.name || '';
      if(name == ''){
         console.error('A project --name must be given.');
         process.exit();
      }

      let { with: dependencies = '', core = false } = this.params;

      dependencies = dependencies.split(/\s+/).map(dependency => dependency.trim());

      if(!core) defaultDependencies.forEach(dependency => {
         if(!dependencies.includes(dependency)) dependencies.unshift(dependency);
      });
      if(!dependencies.includes('pinstripe')) dependencies.unshift('pinstripe');

   
      const { generateDir, generateFile, line, indent, echo } = this.fsBuilder;
   
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

         await generateFile(`pinstripe.config.js`, () => {
            line();
            line(`const environment = process.env.NODE_ENV || 'development';`);
            line();
            line(`let database;`);
            line(`if(environment == 'production'){`)
            indent(() => {
               line(`database = {`);
               indent(() => {
                  line(`adapter: 'mysql',`)
                  line(`host: 'localhost',`);
                  line(`user: 'root',`);
                  line(`password: '',`);
                  line(`database: \`${this.inflector.snakeify(name)}_\${environment}\``);
               });
               line(`};`);
            });
            line(`} else {`);
            indent(() => {
               line(`database = {`);
               indent(() => {
                  line(`adapter: 'sqlite',`);
                  line(`filename: \`\${environment}.db\``)
               });
               line(`};`);
            });
            line(`}`);
            line();
            line(`let mail;`);
            line(`if(environment == 'production'){`)
            indent(() => {
               line(`mail = {`);
               indent(() => {
                  line(`adapter: 'smtp',`)
                  line(`host: "smtp.example.com",`)
                  line(`port: 465,`);
                  line(`secure: true, // use TLS`);
                  line(`auth: {`);
                  indent(() => {
                     line(`user: "username",`);
                     line(`pass: "password",`);
                  });
                  line(`}`);
               });
               line(`};`);
            });
            line(`} else {`);
            indent(() => {
               line(`mail = {`);
               indent(() => {
                  line(`adapter: 'dummy'`);
               });
               line(`};`);
            });
            line(`}`);
            line();
            line(`export default {`);
            indent(() => {
               line(`database,`);
               line(`mail,`);
               line(`salt: '${crypto.randomUUID()}'`)
            })
            line(`};`);
         });
   
         await generateFile(`lib/index.js`, () => {
            line();
            dependencies.forEach((dependency) => {
               if(dependency != 'pinstripe') line(`import '${dependency}';`);
            });
            line();
            line(`import { importAll } from 'pinstripe';`);
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
               line('pinstripe database:init');
               line('pinstripe start-server');
            });
            line('```');
            line();
         });
   
         spawnSync('npm', [ 'install', ...dependencies ], {
            stdio: 'inherit'
         });
      });
   }
};
