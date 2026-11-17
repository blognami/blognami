const KEY_SUFFIX = '.bin';
const BYTE_VALUES = 256;
// Every byte value, so the payload is not valid UTF-8.
const PAYLOAD = Uint8Array.from({ length: BYTE_VALUES }, (value, index) => index);
const UNKNOWN_ID = 'no-such-blob';

// Proves the `blobStore` service in the Durable Object is the R2 one.
export default {
    async render(){
        const bucket = this.initialParams._cloudflare.R2_BUCKET;
        const blobStore = await this.blobStore;

        const id = await blobStore.put(PAYLOAD);
        const bytes = await blobStore.get(id);
        const object = await bucket.get(`${id}${KEY_SUFFIX}`);
        const inBucket = object !== null && this.matchPayload(new Uint8Array(await object.arrayBuffer()));
        await blobStore.delete(id);

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            isBytes: bytes instanceof Uint8Array,
            matched: this.matchPayload(bytes),
            inBucket,
            unknownIsNull: await blobStore.get(UNKNOWN_ID) === null,
            deleted: await blobStore.get(id) === null && await bucket.get(`${id}${KEY_SUFFIX}`) === null,
            deleteOfMissingIsSilent: await blobStore.delete(UNKNOWN_ID) === undefined
        })]];
    },

    matchPayload(bytes){
        return bytes.length == PAYLOAD.length && bytes.every((byte, index) => byte == PAYLOAD[index]);
    }
};
