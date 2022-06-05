
export default async ({ site, renderForm }) => renderForm(site, {
    fields: [{name: 'description', type: 'textarea', nodeWrapper: 'markdown-editor/anchor'}]
});
