
export default ({ renderForm, images, renderHtml }) => renderForm(images, {
    fields: [{ name: 'file', type: 'file' }],

    success(image){
        return renderHtml`
            <span data-node-wrapper="markdown-editor/line-inserter" data-line-content="![${image.title}](/${image.slug})" data-trigger="click"></span>
        `;
    }
});
