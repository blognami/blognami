
export default {
    meta(){
        this.addHook('beforeRender', 'injectGoogleAnalytics');
    },

    async injectGoogleAnalytics(){
        const measurementId = (await this.config.googleAnalytics)?.measurementId;
        if(!measurementId) return;

        this.meta.push({
            tagName: 'script',
            src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
            async: true
        });

        this.meta.push({
            tagName: 'script',
            body: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${measurementId}', { cookie_domain: 'blognami.com', linker: { domains: ['blognami.com'], accept_incoming: true } });`
        });
    }
}
