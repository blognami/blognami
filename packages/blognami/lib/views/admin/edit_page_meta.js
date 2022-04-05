
export default async ({ params, pages, renderForm, renderHtml }) => renderForm(pages.idEq(params.id).first(), {
    fields: ['slug', 'published'],
    success({ slug }){
        return renderHtml`
            <span data-node-wrapper="anchor" data-href="/${slug}" data-target="_top" data-trigger="click"></span>
        `;
    }
});
