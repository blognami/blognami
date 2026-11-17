const SEEDED_POST_SLUG = 'seeded-post';
const KEY_SUFFIX = '.bin';
const HASH_ALGORITHM = 'SHA-256';
const HEX_RADIX = 16;
const HEX_BYTE_LENGTH = 2;

// Reads the bucket itself, past the `blobStore` service, so a test can tell where an uploaded image's bytes are kept.
export default {
    async render(){
        const bucket = this.initialParams._cloudflare.R2_BUCKET;
        const post = await this.database.posts.where({ slug: SEEDED_POST_SLUG }).first();
        const featuredImage = await post.featuredImage;
        const object = featuredImage ? await bucket.get(`${featuredImage.blobId}${KEY_SUFFIX}`) : null;
        const { objects } = await bucket.list();

        return [200, { 'content-type': 'application/json' }, [JSON.stringify({
            inBucket: object !== null,
            sha256: object ? await this.hashBytes(await object.arrayBuffer()) : null,
            objects: objects.length
        })]];
    },

    async hashBytes(bytes){
        return [...new Uint8Array(await crypto.subtle.digest(HASH_ALGORITHM, bytes))]
            .map(byte => byte.toString(HEX_RADIX).padStart(HEX_BYTE_LENGTH, '0'))
            .join('');
    }
};
