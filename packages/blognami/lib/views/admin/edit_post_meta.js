
export default async ({ params, posts, renderForm, renderHtml }) => renderForm(posts.idEq(params.id).first(), {
    fields: ['slug', { name: 'tags', type: 'textarea'}, 'published'],
    success({ slug }){
        return renderHtml`
            <span data-node-wrapper="anchor" data-href="/${slug}" data-target="_top" data-trigger="click"></span>
        `;
    }
});
