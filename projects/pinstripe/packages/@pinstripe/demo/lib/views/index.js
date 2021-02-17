
export default ({ renderView, html }) => renderView('layout', { 
    title: 'Pinstripe JS - Home',
    body: html`
        <section class="hero is-medium is-light">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title">
                        <img src="/images/logo.png" alt="Pinstripe JS" style="max-height: 150px;">
                    </h1>
                </div>
            </div>
        </section>
    `
});
