const ADMIN_ROLE = 'admin';
// Past the 30 minutes `purge_old_sessions` keeps a session for.
const OLD_SESSION_AGE_MS = 31 * 60 * 1000;
const OLD_SESSION_PASS_STRING = 'old-session';
const MINUTE_MS = 60 * 1000;
const EXPIRED_USED_HASH = 'expired-used-hash';
const UNEXPIRED_USED_HASH = 'unexpired-used-hash';
// No other case sends to it.
const NOTIFIED_EMAIL = 'notified@example.com';
const NOTIFICATION_BODY = 'Notification body the alarm delivers.';

// Answers the rows the scheduled jobs purge or deliver, after writing them when `write` is given.
export default {
    async render(){
        if(this.params.write) await this.writeRows();
        const user = await this.database.users.where({ email: NOTIFIED_EMAIL }).first();

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            sessions: (await this.database.sessions.all()).map(({ passString }) => passString),
            usedHashes: (await this.database.usedHashes.all()).map(({ value }) => value),
            notifications: user ? await user.notifications.count() : 0
        })]];
    },

    async writeRows(){
        const admin = await this.database.users.where({ role: ADMIN_ROLE }).first();
        await this.database.sessions.insert({
            userId: admin.id,
            passString: OLD_SESSION_PASS_STRING,
            lastAccessedAt: Date.now() - OLD_SESSION_AGE_MS
        });
        await this.database.usedHashes.insert({ value: EXPIRED_USED_HASH, expiresAt: Date.now() - MINUTE_MS });
        await this.database.usedHashes.insert({ value: UNEXPIRED_USED_HASH, expiresAt: Date.now() + MINUTE_MS });
        const user = await this.database.users.insert({
            name: 'Notified',
            email: NOTIFIED_EMAIL,
            role: 'user',
            // In the past, so the user is ready for `deliver_notifications`.
            emailNotificationScheduledAt: Date.now() - MINUTE_MS
        });
        await this.database.notifications.insert({ userId: user.id, body: NOTIFICATION_BODY });
    }
};
