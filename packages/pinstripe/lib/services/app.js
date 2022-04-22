
export default async ({ params: { _headers = {} } }) => _headers['x-app'] || 'main';
