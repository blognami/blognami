
export default async ({ params: { _path: path, ...otherParams }, pageables, renderView }) => {
    const slug = path.replace(/^\//, '');
    const pageable = await pageables.slugEq(slug).first();
    if(pageable) {
        const pageableName = pageable.constructor.name;
        return renderView(`pageables/_${pageable.constructor.name}`, {
            ...otherParams,
            [pageableName]: pageable,
        });
    }
};
