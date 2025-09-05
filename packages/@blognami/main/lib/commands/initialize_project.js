
export default {
    async run(){
        const { inProjectRootDir } = this.fsBuilder;
    
        await inProjectRootDir(async () => {
            await this.generateSeedDatabaseCommand();
        });
    },

    async generateSeedDatabaseCommand(){
        const { generateFile } = this.fsBuilder;
  
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
              indent(({ line, indent }) => {
                 line(`await this.database.site.update({`);
                 indent(async ({ line }) => {
                    line(`title: '${this.inflector.capitalize(await this.project.name)}'`);
                 });
                 line(`});`);
                 line();
                 line(`this.user = await this.database.users.insert({`);
                 indent(({ line }) => {
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
};
