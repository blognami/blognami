
export default async ({ cookies, database }) => {
    const { pinstripeSession } = cookies;
    if(!pinstripeSession){
        return;
    }
    const [ sessionId, passString ] = pinstripeSession.split(/:/);
    const session = await database.sessions.idEq(sessionId).passStringEq(passString).first();
    if(session && session.lastAccessedAt < (Date.now() - 1000 * 60 * 5)){
        await session.update({
            lastAccessedAt: Date.now()
        });
    }
    return session;
};
