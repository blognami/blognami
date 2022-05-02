
export default async ({ params: { _url: url, ...otherParams }, pageables, renderView }) => {
    const slug = url.path.replace(/^\//, '');
    const pageable = await pageables.slugEq(slug).first();
    if(pageable) {
        const pageableName = pageable.constructor.name;
        return renderView(`pageables/_${pageable.constructor.name}`, {
            ...otherParams,
            [pageableName]: pageable,
        });
    }
    return renderView('_404');
};
