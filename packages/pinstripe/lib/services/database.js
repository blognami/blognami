
import { Database } from "../database.js";
import { Client } from "../database/client.js";

export default {
    create(){
        return this.defer(async () => {
            if(!this.context.root.databaseClient){
                this.context.root.databaseClient = Client.new(await this.config.database);
            }
            return Database.new(this.context.root.databaseClient)
        });
    }
};
