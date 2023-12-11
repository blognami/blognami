
export default {
    async render(){
        const { id } = this.params;
        const user = await this.session.user;
        const comment = await this.database.comments.where({ id }).first();
        if(!comment || (comment.userId != user.id && user.role != 'admin')) return this.renderView('_403', {
            message: 'You cannot edit this comment.'
        });
        return this.renderForm(comment, {
            fields: [{ name: 'body', type: '_markdown_editor'}],
            success: this.success.bind(this)
        });
    },

    async success(){
        return this.renderHtml`
            <span data-component="pinstripe-anchor" data-target="_top">
                <script type="pinstripe">
                    this.parent.trigger('click');
                </script>
            </span>
        `;
    }
}
