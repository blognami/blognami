
export default ({ renderForm, posts, params: { id } }) => renderForm(posts.idEq(id).first(), {
    fields: ['title']
});
