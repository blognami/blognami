
export default {
    async render(){

        const id = this.params.id;

        const tenant = await this.database.tenants.where({ id }).first();

        if(!tenant) return this.renderView('_404');

        const session = await this.session;
        
        const url = `https://${tenant.name}.blognami.com/_actions/guest/transfer_session?id=${session.id}&passString=${session.passString}`;

        return [302, { 'Location': url }, []];
    }
};
