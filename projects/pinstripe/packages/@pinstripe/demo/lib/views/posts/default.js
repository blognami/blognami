
export default ({ renderView, html, params: { post } }) => renderView('layout', {
    title: `Pinstripe JS - ${post.title}`,
    body: html`
        <section>
            <div class="container">
                <h1 class="title">${post.title}</h1>
                <p>${post.body}</p>
            </div>
        </section>
    `
});
