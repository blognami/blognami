
export default {
    async render(){
        return this.renderHtml`
            <div class="image-block">
                <button data-component="pinstripe-anchor" data-href="/_actions/admin/add_image" data-target="_overlay">Add Image</button>
            </div>
        `;
    }
};
