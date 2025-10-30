export default {
    create(){
        return this.defer(async () => {
            const session = await this.session;
            if(!session) return;
            return session.user;
        });
    }
};