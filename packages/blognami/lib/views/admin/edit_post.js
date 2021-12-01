
export default async ({ params, posts, renderForm }) => renderForm(posts.idEq(params.id).first(), {
    fields: ['title', { name: 'body', type: 'markdown'}, 'published']
});
