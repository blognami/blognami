
import { defineController } from 'pinstripe';

defineController('admin/insert_image', async ({ params, database, renderView }) => {
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

    return renderView('admin/insert_image', {
        images,
        pagination
    });
});
