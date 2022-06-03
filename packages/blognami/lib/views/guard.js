
export default async ({ site }) => {
    if(!await site) return [404, {'content-type': 'text/plain'}, ['Not found']];
};
