
export default async ({ params, posts, renderHtml }) => {
    const { id } = params;

    await posts.idEq(id).delete();
    
    return renderHtml`
        <span data-action="load" data-target="_parent"></span>
    `;
};
