const escapeXml = value => `${value}`.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default {
    async render(){
        const baseUrl = this.params._url.origin;

        const rows = await this.database.sitemappables.all();
        // `sitemapEntries` callbacks return an array of `{ path, lastmod? }` where `path` is host-relative
        // with no leading slash; this view prefixes the request origin.
        const extras = (await this.runHook('sitemapEntries')).flat();

        const entries = [
            { path: '' },
            ...rows
                .filter(row => row.slug)
                .sort((a, b) => {
                    if(!a.publishedAt) return b.publishedAt ? 1 : 0;
                    if(!b.publishedAt) return -1;
                    return new Date(b.publishedAt) - new Date(a.publishedAt);
                })
                .map(row => ({ path: row.slug, lastmod: row.publishedAt })),
            ...extras
        ].map(({ path, lastmod }) => ({ loc: `${baseUrl}/${path}`, lastmod }));

        const xml = [
            `<?xml version="1.0" encoding="UTF-8"?>`,
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
            ...entries.map(entry => {
                const lines = [`        <loc>${escapeXml(entry.loc)}</loc>`];
                if(entry.lastmod) lines.push(`        <lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>`);
                return [`    <url>`, ...lines, `    </url>`].join('\n');
            }),
            `</urlset>`
        ].join('\n');

        return [200, { 'content-type': 'application/xml' }, [xml]];
    }
};
