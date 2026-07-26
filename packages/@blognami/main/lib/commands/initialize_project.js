
export default {
   meta(){
      this.addHook('generateSeedData', 'generateSiteSeedData');
      this.addHook('generateSeedData', 'generateAdminUserSeedData');
      this.addHook('generateReadmeNotes', 'generateAdminUserReadmeNotes');
   },

   generateSiteSeedData({ line, indent }){
      line(`await this.database.site.update({`);
      indent(async ({ line }) => {
         line(`title: '${this.inflector.capitalize(await this.project.name)}'`);
      });
      line(`});`);
   },

   generateAdminUserSeedData({ line, indent }){
      line(`await this.database.users.insert({`);
      indent(({ line }) => {
         line(`name: 'Admin',`);
         line(`email: 'admin@example.com',`);
         line(`role: 'admin'`);
      });
      line(`});`);
   },

   generateAdminUserReadmeNotes({ line }){
      line('## Signing in');
      line();
      line('Visit [http://127.0.0.1:3000/](http://127.0.0.1:3000/) and sign in as `admin@example.com`.');
      line();
      line("In development, the one time password is printed to the server's console.");
   }
};
