
export default async ({ renderHtml }) => {
    return renderHtml`
        <div class="image-block">
            <button data-acts-as="a" data-href="/admin/add_image" data-target="_overlay">Add Image</button>
        </div>
    `;
};
