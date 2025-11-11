
export default {
    meta(){
        this.addHook('beforeRender', 'setRoleAsLoadCacheNamespace');
    },
    
    async setRoleAsLoadCacheNamespace(){
        if(await this.isSignedOut) return;
        this.meta.push({ tagName: 'meta', name: 'pinstripe-load-cache-namespace', content: this.user.role });
    }
}
