export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('isSignedOut', async () => !(await this.user)));
    }
};