
import { spawnSync } from 'child_process';
import * as crypto from 'crypto';

const defaultDependencies = [
   '@blognami/main'
];

export default {
   async run(){

      const { extractArg, extractOptions } = this.cliUtils;
      const name = extractArg('');
      if(name == ''){
         console.error('A project name must be given.');
         process.exit();
      }
      const { with: dependencies, core } = extractOptions({
         with: [],
         core: false
      });

      if(!core) defaultDependencies.forEach(dependency => {
         if(!dependencies.includes(dependency)) dependencies.unshift(dependency);
      });
      if(!dependencies.includes('blognami')) dependencies.unshift('blognami');

   
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

         await generateFile(`blognami.config.js`, () => {
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
               if(dependency != 'blognami') line(`import '${dependency}';`);
            });
            line();
            line(`import { importAll } from 'blognami';`);
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
               line('blognami init-database');
               line('blognami start-server');
            });
            line('```');
            line();
         });
   
         spawnSync('yarn', [ 'add', ...dependencies ], {
            stdio: 'inherit'
         });
      });
   }
};
