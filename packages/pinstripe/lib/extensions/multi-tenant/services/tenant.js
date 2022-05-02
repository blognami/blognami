
export default ({ params, tenants }) => {
    if(params._headers?.['x-tenant']){
        return tenants.nameEq(params._headers['x-tenant']).first();
    }
    return tenants.hostEq(params._url.host).first();
};
