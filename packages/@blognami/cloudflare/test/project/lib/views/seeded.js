// Counts the posts, so a test can tell a seed that ran once from one that ran twice.
export default {
    async render(){
        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            posts: await this.database.posts.count()
        })]];
    }
};
