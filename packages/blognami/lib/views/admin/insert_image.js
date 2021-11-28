
export default async ({ params, database, renderHtml }) => {
    const page = parseInt(params.page || '1');
    const pageSize = 10;
    const imageCount = await database.images.count();
    const pageCount = Math.ceil(imageCount / pageSize);
    const pagination = new Array(pageCount).fill().map((_,i) => {
        const number = i + 1;
        const current = number == page;
        return { number, current };
    });
    
    const images = await database.images.paginate(page, pageSize).all();

    return renderHtml`
        <div class="modal is-active">
            <div class="modal-background" data-widget="trigger" data-event="click" data-action="remove"></div>
            <div class="modal-content">
                <button class="button is-small" data-widget="trigger" data-event="click" data-action="load" data-url="/admin/add_image" data-target="_overlay">Add</button>
                ${images.map(({ title, slug }) => renderHtml`
                    <div class="section">
                        <div class="card">
                            <div class="card-image">
                                <figure class="image is-4by3">
                                    <img src="${slug}" alt="Placeholder image">
                                </figure>
                            </div>
                            <div class="card-content">
                                <div class="content">${title}</div>
                            </div>
                        </div>
                    </div>
                `)}
            </div>
            <button class="modal-close is-large" aria-label="close" data-widget="trigger" data-event="click" data-action="remove">></button>
        </div>
    `;
};
