
import { MissingResourceError } from '../missing_resource_error.js';

export const client = true;

export default {
    create(){
        return this;
    },

    start(){
        addEventListener("message", async (event) => {
            try {
                const [sessionId, params] = event.data;
                self.postMessage([sessionId, await this.callHandler.handleCall(params)]);
            } catch (error) {
                if(!(error instanceof MissingResourceError)) throw error;
                console.log(error);
                self.postMessage([sessionId, [500, { 'Content-Type': 'text/plain' }, 'Internal Server Error']]);
            }
        });
    }
};
