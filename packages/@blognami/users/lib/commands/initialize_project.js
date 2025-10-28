
export default {
   meta(){
      this.addHook('generateSeedData', 'generateUserSeedData');
   },

   generateUserSeedData({ line, indent }){
      line(`this.user = await this.database.users.insert({`);
      indent(({ line }) => {
         line(`name: 'Admin',`);
         line(`email: 'admin@example.com',`);
         line(`role: 'admin'`);
      });
      line('});');
   }
};
