
export default ({ renderForm, pages, renderHtml }) => renderForm(pages, {
    fields: ['userId', 'title'],
    success({ slug }){
        return renderHtml`
            <span data-node-wrapper="anchor" data-href="/${slug}" data-target="_top" data-trigger="click"></span>
        `;
    }
});
