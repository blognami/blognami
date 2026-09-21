export default {
    render(){
        return [
            'User-agent: *',
            'Allow: /',
            `Sitemap: ${this.params._url.origin}/sitemap.xml`
        ].join('\n');
    }
};
