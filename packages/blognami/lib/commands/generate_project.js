
import { spawnSync } from 'child_process';
import * as crypto from 'crypto';

export default {
   meta(){
      this.assignProps({
         description: 'Generates a new Blognami project with the specified dependencies and configuration.'
      });

      this.hasParam('name', { type: 'string', alias: 'arg1', description: 'The name of the project to create.' });
      this.hasParam('with', { type: 'string', optional: true, description: 'Additional dependencies to include (space-separated).' });
      this.hasParam('withoutMain', { type: 'boolean', optional: true, description: 'Omit @blognami/main from the generated dependencies and imports.' });
      this.hasParam('withoutPages', { type: 'boolean', optional: true, description: 'Omit @blognami/pages from the generated dependencies and imports.' });
      this.hasParam('withoutPosts', { type: 'boolean', optional: true, description: 'Omit @blognami/posts from the generated dependencies and imports.' });
      this.hasParam('withoutTags', { type: 'boolean', optional: true, description: 'Omit @blognami/tags from the generated dependencies and imports.' });
      this.hasParam('core', { type: 'boolean', optional: true, description: 'Shortcut for --without-main, --without-pages, --without-posts and --without-tags.' });
   },

   async run(){
      const name = this.params.name;
      const {
         with: _with = '',
         core = false,
         withoutMain = core,
         withoutPages = core,
         withoutPosts = core,
         withoutTags = core
      } = this.params;

      const excluded = new Set();
      if(withoutMain) excluded.add('@blognami/main');
      if(withoutPages) excluded.add('@blognami/pages');
      if(withoutPosts) excluded.add('@blognami/posts');
      if(withoutTags) excluded.add('@blognami/tags');

      const dependencies = ['blognami', '@blognami/main', '@blognami/pages', '@blognami/posts', '@blognami/tags']
         .filter(dependency => !excluded.has(dependency));
      _with.split(/\s+/).map(dependency => dependency.trim()).filter(Boolean).forEach(dependency => {
         if(!dependencies.includes(dependency)) dependencies.push(dependency);
      });

      Object.assign(this, { name, dependencies });
   
      const { generateDir } = this.fsBuilder;
   
      await generateDir(name, async () => {
         await this.generatePackageJson();

         await this.generateBlognamiConfig();
   
         await this.generateLibIndex();

         this.installDependencies();

         await this.initializeProject();
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

   async generateBlognamiConfig(){
      const { generateFile } = this.fsBuilder;

      await generateFile(`blognami.config.js`, ({ line, indent }) => {
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
            if(dependency != 'blognami') line(`import '${dependency}';`);
         });
         line();
         line(`import { importAll } from 'blognami';`);
         line();
         line(`importAll(import.meta.url);`);
         line();
      });
   },

   installDependencies(){
      spawnSync('npm', [ 'install', ...this.dependencies ], {
         stdio: 'inherit'
      });
   },

   initializeProject(){
      spawnSync('npx', [ 'blognami', 'initialize-project'], {
         stdio: 'inherit',
         env: {
            ...process.env,
            BLOGNAMI_KEEP_ALL_COMMANDS: 'true',
         }
      });
   }
};
