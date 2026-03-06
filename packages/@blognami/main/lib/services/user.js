export default {
    create(){
        return this.defer(async () => this.context.root.getOrCreate('user', async () => {
            const session = await this.session;
            if(!session) return;
            return session.user;
        }));
    }
};