
import { spawnSync } from 'child_process';
import * as crypto from 'crypto';
import { readFile } from 'fs/promises';

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

      Object.assign(this, { name, dependencies });
   
      const { generateDir, generateFile, line, indent } = this.fsBuilder;
   
      await generateDir(name, async () => {
         await this.generatePackageJson();

         await this.generateBlognamiConfig();
   
         await this.generateLibIndex();
      
         await this.generateReadme();

         await this.generateSeedDatabaseCommand();

         this.installDependencies();
      });
   },

   async generatePackageJson(){
      const { generateFile, echo } = this.fsBuilder;

      await generateFile(`package.json`, () => {
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

   async generateBlognamiConfig(){
      const { generateFile, line, indent } = this.fsBuilder;

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
               line(`database: \`${this.inflector.snakeify(this.name)}_\${environment}\``);
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
   },

   async generateLibIndex(){
      const { generateFile, line } = this.fsBuilder;

      await generateFile(`lib/index.js`, () => {
         line();
         this.dependencies.forEach((dependency) => {
            if(dependency != 'blognami') line(`import '${dependency}';`);
         });
         line();
         line(`import { importAll } from 'blognami';`);
         line();
         line(`importAll(import.meta.url);`);
         line();
      });
   },

   async generateReadme(){
      const { generateFile, line, indent } = this.fsBuilder;

      await generateFile(`README.md`, () => {
         line();
         line(`# ${this.name}`);
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
   },

   async generateSeedDatabaseCommand(){
      const { generateFile, line, indent, echo } = this.fsBuilder;

      await generateFile(`lib/commands/_file_importer.js`, { skipIfExists: true }, () => {
         line();
         line(`export { Command as default } from 'blognami';`);
         line();
      });

      await generateFile(`lib/commands/seed_database/_file_importer.js`, { skipIfExists: true }, () => {
         line();
         line(`export default undefined;`);
         line();
      });

      const currentDir = new URL('.', import.meta.url).pathname;

      const termsOfService = await readFile(`${currentDir}generate_project/legal/terms_of_service.md`, 'utf8');
      const privacyPolicy = await readFile(`${currentDir}generate_project/legal/privacy_policy.md`, 'utf8');
      const cookiePolicy = await readFile(`${currentDir}generate_project/legal/cookie_policy.md`, 'utf8');

      await generateFile(`lib/commands/seed_database/legal/terms_of_service.md`, { skipIfExists: true }, () => {
         echo(termsOfService);
      });

      await generateFile(`lib/commands/seed_database/legal/privacy_policy.md`, { skipIfExists: true }, () => {
         echo(privacyPolicy);
      });

      await generateFile(`lib/commands/seed_database/legal/cookie_policy.md`, { skipIfExists: true }, () => {
         echo(cookiePolicy);
      });

      await generateFile(`lib/commands/seed_database.js`, () => {
         line();
         line(`import { readFile } from 'fs/promises';`);
         line();
         line(`export default {`);
         indent(() => {
            line('async run(){');
            indent(() => {
               line(`const currentDir = new URL('.', import.meta.url).pathname;`);
               line(`const termsOfService = await readFile(\`\${currentDir}seed_database/legal/terms_of_service.md\`, 'utf8');`);
               line(`const privacyPolicy = await readFile(\`\${currentDir}seed_database/legal/privacy_policy.md\`, 'utf8');`);
               line(`const cookiePolicy = await readFile(\`\${currentDir}seed_database/legal/cookie_policy.md\`, 'utf8');`);
               line();
               line(`await this.database.site.update({`);
               indent(() => {
                  line(`title: '${this.inflector.capitalize(this.name)}',`)
                  line(`termsOfService,`);
                  line(`privacyPolicy,`);
                  line(`cookiePolicy`);
               });
               line(`});`);
               line();
               line(`this.user = await this.database.users.insert({`);
               indent(() => {
                  line(`name: 'Admin',`);
                  line(`email: 'admin@example.com',`);
                  line(`role: 'admin'`);
               });
               line('});')
            });
            line('}');
         });
         line('};');
         line();
      });
   },

   installDependencies(){
      spawnSync('npm', [ 'install', ...this.dependencies ], {
         stdio: 'inherit'
      });
   }

};
