
export default async ({ params, pages, renderHtml }) => {
    const { id } = params;

    await pages.idEq(id).delete();
    
    return renderHtml`
        <span data-node-wrapper="anchor" data-target="_parent" data-trigger="click"></span>
    `;
};
