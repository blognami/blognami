const ADMIN_ROLE = 'admin';
const SEEDED_POST_SLUG = 'seeded-post';

// Stands in for the emailed one-time password and the proof of work only: the session row is the one `verify_password` inserts.
export default {
    async render(){
        const user = await this.database.users.where({ role: ADMIN_ROLE }).first();
        const passString = crypto.randomUUID();
        const session = await this.database.sessions.insert({
            userId: user.id,
            passString,
            lastAccessedAt: Date.now()
        });
        const post = await this.database.posts.where({ slug: SEEDED_POST_SLUG }).first();

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            cookie: `${session.id}:${passString}`,
            postId: post.id
        })]];
    }
};
