
export default {
    async render(){
        return this.renderHtml`
            <div class="image-block">
                <button data-component="a" data-href="/admin/add_image" data-target="_overlay">Add Image</button>
            </div>
        `;
    }
};
