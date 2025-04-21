
import { spawnSync } from 'child_process';
import * as crypto from 'crypto';
import { readFile } from 'fs/promises';

export default {
   async run(){
      const name = this.params.name || '';
      if(name == ''){
         console.error('A project --name must be given.');
         process.exit();
      }

      const { with: _with = '' } = this.params;

      const dependencies = ['sintra'];
      _with.split(/\s+/).map(dependency => dependency.trim()).filter(Boolean).forEach(dependency => {
         if(!dependencies.includes(dependency)) dependencies.push(dependency);
      });

      Object.assign(this, { name, dependencies });
   
      const { generateDir } = this.fsBuilder;
   
      await generateDir(name, async () => {
         await this.generatePackageJson();

         await this.generateSintraConfig();
   
         await this.generateLibIndex();
      
         await this.generateReadme();

         this.installDependencies();

         this.initializeProject();
      });
   },

   async generatePackageJson(){
      const { generateFile } = this.fsBuilder;

      await generateFile(`package.json`, ({ echo }) => {
         echo(JSON.stringify({
            type: "module",
            name: this.name,
            version: "0.0.0",
            license: "MIT",
            exports: {
               ".": "./lib/index.js"
            },
         }, null, 2));
      });
   },

   async generateSintraConfig(){
      const { generateFile } = this.fsBuilder;

      await generateFile(`sintra.config.js`, ({ line, indent }) => {
         line();
         line(`const environment = process.env.NODE_ENV || 'development';`);
         line();
         line(`let database;`);
         line(`if(environment == 'production'){`)
         indent(({ line, indent }) => {
            line(`database = {`);
            indent(({ line }) => {
               line(`adapter: 'mysql',`)
               line(`host: 'localhost',`);
               line(`user: 'root',`);
               line(`password: '',`);
               line(`database: \`${this.inflector.snakeify(this.name)}_\${environment}\``);
            });
            line(`};`);
         });
         line(`} else {`);
         indent(({ line, indent }) => {
            line(`database = {`);
            indent(({ line }) => {
               line(`adapter: 'sqlite',`);
               line(`filename: \`\${environment}.db\``)
            });
            line(`};`);
         });
         line(`}`);
         line();
         line(`let mail;`);
         line(`if(environment == 'production'){`)
         indent(({ line, indent }) => {
            line(`mail = {`);
            indent(({ line, indent }) => {
               line(`adapter: 'smtp',`)
               line(`host: "smtp.example.com",`)
               line(`port: 465,`);
               line(`secure: true, // use TLS`);
               line(`auth: {`);
               indent(({ line }) => {
                  line(`user: "username",`);
                  line(`pass: "password",`);
               });
               line(`}`);
            });
            line(`};`);
         });
         line(`} else {`);
         indent(({ line, indent }) => {
            line(`mail = {`);
            indent(({ line }) => {
               line(`adapter: 'dummy'`);
            });
            line(`};`);
         });
         line(`}`);
         line();
         line(`export default {`);
         indent(({ line }) => {
            line(`database,`);
            line(`mail,`);
            line(`salt: '${crypto.randomUUID()}'`)
         })
         line(`};`);
      });
   },

   async generateLibIndex(){
      const { generateFile } = this.fsBuilder;

      await generateFile(`lib/index.js`, ({ line }) => {
         line();
         this.dependencies.forEach((dependency) => {
            if(dependency != 'sintra') line(`import '${dependency}';`);
         });
         line();
         line(`import { importAll } from 'sintra';`);
         line();
         line(`importAll(import.meta.url);`);
         line();
      });
   },

   async generateReadme(){
      const { generateFile } = this.fsBuilder;

      await generateFile(`README.md`, ({ line, indent }) => {
         line();
         line(`# ${this.name}`);
         line();
         line('## Getting started');
         line();
         line('```bash');
         indent(({ line }) => {
            line('sintra initialize-database');
            line('sintra start-server');
         });
         line('```');
         line();
      });
   },

   installDependencies(){
      spawnSync('npm', [ 'install', ...this.dependencies ], {
         stdio: 'inherit'
      });
   },

   initializeProject(){
      spawnSync('npx', [ 'sintra', 'initialize-project'], {
         stdio: 'inherit',
         env: {
            ...process.env,
            SINTRA_KEEP_INITIALIZE_PROJECT_COMMAND: 'true',
         }
      });
   }
};
