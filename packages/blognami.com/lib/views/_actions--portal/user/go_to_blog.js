
export default {
    async render(){

        const id = this.params.id;

        const tenant = await this.database.tenants.where({ id }).first();

        if(!tenant) return this.renderView('_404');

        const canonicalHost = await tenant.hosts.where({ canonical: true }).first();

        if(!canonicalHost) return this.renderView('_404');

        const session = await this.session;

        const url = `https://${canonicalHost.name}/_actions/guest/transfer_session?id=${session.id}&passString=${session.passString}`;

        return [302, { 'Location': url }, []];
    }
};
