// The Node store's suffix, so a blob keeps one name on disk and in the bucket.
const KEY_SUFFIX = '.bin';

const blobStore = { // blognami-if(server,service-worker): export default {
    create(){
        const bucket = this.initialParams._cloudflare.R2_BUCKET;

        return {
            put: async data => {
                const id = crypto.randomUUID();
                await bucket.put(this.buildKey(id), data);
                return id;
            },
            get: async id => {
                const object = await bucket.get(this.buildKey(id));
                return object ? new Uint8Array(await object.arrayBuffer()) : null;
            },
            delete: async id => {
                await bucket.delete(this.buildKey(id));
            }
        };
    },

    buildKey(id){
        return `${id}${KEY_SUFFIX}`;
    }
};

// A Node process imports this package for its command, and its blob store stays the one on disk.
export default {}; // blognami-if(server,service-worker): // kept out: the R2 store above is the export
