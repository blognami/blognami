
export default ({ params: { pageable }}) => {
    if(!pageable) return;
    const { type, data } = pageable;
    return [ 200, { 'content-type': `image/${type}`}, [ data ]];
}