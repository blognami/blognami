
export default ({ renderView, html }) => renderView('layout', {
    title: 'Pinstripe JS - About',
    body: html`
        <section>
            <div class="container">
                <h1 class="title">About</h1>
                <p>Pinstripe makes the UI of your web application run much faster, by only updating the parts of the DOM that change when loading html content from your server. Thus removing the performance cost of a full page reload.</p>
            </div>
        </section>
    `
});
