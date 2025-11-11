
export default {
   meta(){
      this.addHook('generateSeedData', 'generateSiteSeedData');
   },

   generateSiteSeedData({ line, indent }){
      line(`await this.database.site.update({`);
      indent(async ({ line }) => {
         line(`title: '${this.inflector.capitalize(await this.project.name)}'`);
      });
      line(`});`);
   }
};
