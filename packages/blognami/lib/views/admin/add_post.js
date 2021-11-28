
export default ({ renderForm, posts, renderHtml }) => renderForm(posts, {
    fields: ['userId', 'title'],
    success({ slug }){
        return renderHtml`
            <span data-action="load" data-url="/${slug}" data-target="_top"></span>
        `;
    }
});
