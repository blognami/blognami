// The key `worker/index.js` keeps the time of the last alarm run under.
const LAST_RUN_KEY = 'lastAlarmRun';
// Over one interval of the engine's `*/5 * * * *` schedules, so each has an occurrence since.
const LAST_RUN_AGE_MS = 6 * 60 * 1000;

// Has the alarm run now with every schedule due.
export default {
    async render(){
        const storage = this.initialParams._cloudflare.DATABASE;
        await storage.put(LAST_RUN_KEY, Date.now() - LAST_RUN_AGE_MS);
        await storage.setAlarm(Date.now());
        return [200, { 'content-type': 'application/json' }, [JSON.stringify({})]];
    }
};
