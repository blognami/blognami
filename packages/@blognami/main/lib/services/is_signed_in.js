export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('isSignedIn', async () => !!(await this.user)));
    }
};