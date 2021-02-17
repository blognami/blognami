

export default async ({ params, database: { posts }, renderView }) => renderView('posts/default', {
    post: await posts.idEq(params._pathOffset).first
});
