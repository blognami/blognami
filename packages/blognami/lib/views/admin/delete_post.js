
export default async ({ params, posts, renderHtml }) => {
    const { id } = params;

    await posts.idEq(id).delete();
    
    return renderHtml`
        <span data-node-wrapper="anchor" data-target="_top" data-trigger="click"></span>
    `;
};
