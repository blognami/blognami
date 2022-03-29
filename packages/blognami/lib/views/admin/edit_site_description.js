
export default async ({ site, renderForm }) => renderForm(site, {
    fields: [{name: 'description', type: 'markdown'}]
});
