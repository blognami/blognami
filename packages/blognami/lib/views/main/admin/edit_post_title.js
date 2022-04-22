
export default async ({ params, posts, renderForm }) => renderForm(posts.idEq(params.id).first(), {
    fields: ['title']
});
