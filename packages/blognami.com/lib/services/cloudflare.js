
export default {
    create(){
        return this.defer(async () => {
            const { cloudflare = {} } = await this.config;
            const { apiToken, zoneId } = cloudflare;

            return {
                async createCustomHostname(hostname){
                    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/custom_hostnames`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${apiToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            hostname,
                            ssl: {
                                method: 'http',
                                type: 'dv'
                            }
                        })
                    });
                    const data = await response.json();
                    if(!data.success){
                        throw new Error(`Cloudflare API error: ${JSON.stringify(data.errors)}`);
                    }
                    return data.result.id;
                },

                async deleteCustomHostname(hostnameId){
                    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/custom_hostnames/${hostnameId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${apiToken}`
                        }
                    });
                    const data = await response.json();
                    if(!data.success){
                        throw new Error(`Cloudflare API error: ${JSON.stringify(data.errors)}`);
                    }
                }
            };
        });
    }
};
