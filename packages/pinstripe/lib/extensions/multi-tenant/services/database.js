
import { Database } from "../../../database.js";
import { Client } from "../../../database/client.js";

export default {
    create(){
        if(!this.context.root.databaseClient){
            this.context.root.databaseClient = Client.new();
        }
        return this.defer(async () => Database.new(this.context.root.databaseClient, {
            tenant: {
                name: this.initialParams._headers['x-tenant'],
                host: this.initialParams._url.hostname
            }
        }));
    }
};
