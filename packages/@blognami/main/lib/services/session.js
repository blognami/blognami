
export default {
    create(){
        return this.defer(async () => {
            const { sintraSession } = this.cookies;
            if(!sintraSession){
                return;
            }
            const [ id, passString ] = sintraSession.split(/:/);
            const session = await this.database.sessions.where({ id, passString }).first();
            if(session && session.lastAccessedAt < (Date.now() - 1000 * 60 * 5)){
                await session.update({
                    lastAccessedAt: Date.now()
                });
            }
            return session;
        });
    }
};
