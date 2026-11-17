const SEEDED_POST_SLUG = 'seeded-post';

// Queues the job that throws ahead of the subscriber email, so a mail sent shows the alarm run went on past the error.
export default {
    async render(){
        const post = await this.database.posts.where({ slug: SEEDED_POST_SLUG }).first();
        this.jobQueue.push('throwError');
        this.jobQueue.push('emailPostToSubscribers', { postId: post.id, baseUrl: this.params._url.origin });
        return [200, { 'content-type': 'application/json' }, [JSON.stringify({})]];
    }
};
