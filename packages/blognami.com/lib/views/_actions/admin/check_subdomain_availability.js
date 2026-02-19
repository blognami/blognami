
const SUFFIXES = ['-blog', '-site', '-hub', '-web', '-io', '-hq', '-dev', '-app'];

export default {
    async render(){
        const { slug } = this.params;

        const errors = this.validateSubdomain(slug);
        if(errors.length > 0){
            return jsonResponse({ available: false, errors });
        }

        const taken = await this.isSubdomainTaken(slug);
        if(taken){
            const isReserved = this.reservedSubdomains.includes(slug);
            const suggestions = isReserved ? [] : await this.generateSuggestions(slug);
            return jsonResponse({ available: false, errors: [isReserved ? `"${slug}" is a reserved name and cannot be used.` : 'This subdomain is already taken.'], suggestions });
        }

        return jsonResponse({ available: true, errors: [] });
    },

    async isSubdomainTaken(slug){
        const byName = await this.database.withoutTenantScope.tenants.where({ name: slug }).first();
        if(byName) return true;
        const byHost = await this.database.withoutTenantScope.tenants.where({ host: `${slug}.blognami.com` }).first();
        return !!byHost;
    },

    async generateSuggestions(baseSlug){
        const suggestions = [];
        const candidates = [];

        for(const suffix of SUFFIXES){
            candidates.push(`${baseSlug}${suffix}`);
        }

        for(let i = 0; i < 20; i++){
            const num = String(Math.floor(Math.random() * 90) + 10);
            candidates.push(`${baseSlug}${num}`);
        }

        for(const candidate of candidates){
            if(suggestions.length >= 5) break;

            const errors = this.validateSubdomain(candidate);
            if(errors.length > 0) continue;

            const taken = await this.isSubdomainTaken(candidate);
            if(!taken) suggestions.push(candidate);
        }

        return suggestions;
    }
};

function jsonResponse(data){
    return [200, { 'content-type': 'application/json' }, [JSON.stringify(data)]];
}
