const SEEDED_POST_SLUG = 'seeded-post';
// No other case sends to either.
const SUBSCRIBER_EMAIL = 'subscriber@example.com';
const UNSUBSCRIBED_EMAIL = 'unsubscribed@example.com';

// Writes the rows the publish form's case needs: a subscriber of the newsletter, a user who is not one, and the seeded post unpublished.
export default {
    async render(){
        const subscriber = await this.database.users.insert({ name: 'Subscriber', email: SUBSCRIBER_EMAIL, role: 'user' });
        await this.database.users.insert({ name: 'Unsubscribed', email: UNSUBSCRIBED_EMAIL, role: 'user' });
        await this.database.newsletter.subscribe(subscriber);
        // Unpublished and not added, as the restart case counts one post.
        const post = await this.database.posts.where({ slug: SEEDED_POST_SLUG }).first();
        await post.update({ published: false });

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({ published: post.published })]];
    }
};
