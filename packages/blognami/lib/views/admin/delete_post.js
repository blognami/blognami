
export default async ({ params, posts, renderHtml }) => {
    const { id } = params;

    await posts.idEq(id).delete();
    
    return renderHtml`
        <span data-acts-as="a" data-target="_parent" data-trigger="click"></span>
    `;
};
