
export default ({ params }) => {
    const { image } = params;
    const { type, data } = image;
    return [ 200, { 'content-type': `image/${type}`}, [ data ]];
}