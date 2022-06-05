
export default async ({ params, pages, renderForm }) => renderForm(pages.idEq(params.id).first(), {
    fields: [{ name: 'body', type: 'textarea', nodeWrapper: 'markdown-editor/anchor'}]
});
