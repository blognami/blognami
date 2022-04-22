
export default async ({ params, pages, renderForm }) => renderForm(pages.idEq(params.id).first(), {
    fields: ['title']
});
