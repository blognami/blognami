
export default {
    render(){
        const that = this;

        return this.renderForm(this.database.images, {
            fields: [{ name: 'file', type: 'file' }],
            success(image){
                return that.renderHtml`
                    <span class="${that.cssClassesFor('_markdown_editor/modal').lineInserter}" data-line-content="![${image.title}](/${image.slug})">
                        <script type="pinstripe">
                            this.parent.trigger('click');
                        </script>
                    </span>
                `;
            }
        });
    }
};
