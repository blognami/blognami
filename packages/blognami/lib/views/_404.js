
export default async ({ renderView, renderHtml }) => {
    const [ status, headers, body ] = (await renderView('_layout', {
        title: 'Not found',
        body: renderHtml`
            <section class="section">
                <h2 class="section-title">Not found</h2>
                <p>The page you are looking for can't be found or no longer exists.</p>
            </section>
        `
    })).toResponseArray();

    return [ 404, headers, body ];
}