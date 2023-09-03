
export default {
    render(){
        const that = this;

        return this.renderForm(this.database.images, {
            fields: [{ name: 'file', type: 'file' }],
            success(image){
                return that.renderHtml`
                    <span data-component="blognami-markdown-editor/line-inserter" data-line-content="![${image.title}](/${image.slug})">
                        <script type="blognami">
                            this.parent.trigger('click');
                        </script>
                    </span>
                `;
            }
        });
    }
};
