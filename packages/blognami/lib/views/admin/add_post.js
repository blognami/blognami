
export default ({ renderForm, posts, renderHtml }) => renderForm(posts, {
    fields: ['userId', 'title'],
    success({ slug }){
        return renderHtml`
            <span data-node-wrapper="anchor" data-href="/${slug}" data-target="_top" data-trigger="click"></span>
        `;
    }
});
