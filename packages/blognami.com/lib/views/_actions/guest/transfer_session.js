
import crypto from 'crypto';

export default {
    async render(){
        const { id: existingSessionId, passString: existingPassString } = this.params;

        const existingSession = await this.database.withoutTenantScope.sessions.where({
            id: existingSessionId,
            passString: existingPassString
        }).first();

        if(!existingSession) return  this.renderView('_404');

        const existingUser = await existingSession.user;

        if(!existingUser) return  this.renderView('_404');

        let user = await this.database.users.where({ email: existingUser.email }).first();
        if(!user){
            user = await this.database.users.insert({
                email: existingUser.email,
                name: existingUser.name
            });
        }

        const passString = crypto.randomUUID();
        const session = await this.database.sessions.insert({
            userId: user.id,
            passString,
            lastAccessedAt: Date.now()
        });

        return [302, { 
            'Location': '/',
            'Set-Cookie': `pinstripeSession=${session.id}:${passString}; Path=/`
        }, []];
    }
};
