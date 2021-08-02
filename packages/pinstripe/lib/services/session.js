
import { defineService } from 'pinstripe';

defineService('session', ({ cookies, database }) => {
    const { pinstripeSession } = cookies;
    if(!pinstripeSession){
        return;
    }
    const [ sessionId, passString ] = pinstripeSession.split(/:/);
    return database.sessions.idEq(sessionId).passStringEq(passString).first();
});
