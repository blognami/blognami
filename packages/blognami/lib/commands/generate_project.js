
import { spawnSync } from 'child_process';
import * as crypto from 'crypto';

const defaultDependencies = [
   'blognami',
   '@blognami/main',
   '@blognami/tags',
   '@blognami/posts',
   '@blognami/pages',
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

      const {
         core = false,
         with: _with = '',
         withoutPages = false,
         withoutPosts = false,
         withoutTags = false 
      } = this.params;

      let dependencies = core ? ['blognami'] : defaultDependencies;
      _with.split(/\s+/).map(dependency => dependency.trim()).filter(Boolean).forEach(dependency => {
         if(!dependencies.includes(dependency)) dependencies.push(dependency);
      });
      dependencies = dependencies.filter(dependency => {
         if(withoutPages && dependency == '@blognami/pages') return false;
         if(withoutPosts && dependency == '@blognami/posts') return false;
         if(withoutTags && dependency == '@blognami/tags') return false;
         return true;
      });
   
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
               line('blognami initialize-database');
               line('blognami start-server');
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
