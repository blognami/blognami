
export default {
   meta(){
      this.addHook('run', 'generateSeedDatabaseCommand');
   },

   async generateSeedDatabaseCommand(){
      const { inProjectRootDir, generateFile } = this.fsBuilder;

      await inProjectRootDir(async () => {

         await generateFile(`lib/commands/_file_importer.js`, { skipIfExists: true }, ({ line }) => {
            line();
            line(`export { Command as default } from 'pinstripe';`);
            line();
         });

         await generateFile(`lib/commands/seed_database.js`, ({ line, indent }) => {
            line();
            line(`export default {`);
            indent(({ line, indent }) => {
               line('async run(){');
               indent(async (...args) => this.runHook('generateSeedData', { 
                  args,
                  betweenEach({ line }){
                     line();
                  },
                  ifNone({ line }){
                     line('// Generate seed data here');
                  }
               }));
               line('}');
            });
            line('};');
            line();
         });
      });
   },
};
