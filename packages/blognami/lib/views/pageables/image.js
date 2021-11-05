
export default ({ params: { pageable: { type, data } }}) => [
    200, { 'Content-Type': `image/${type}`}, [ data ]
];
