export default {
    async render(){
        const { id } = this.params;
        const comment = await this.database.comments.where({ id }).first();
        if(comment){
            const user = await this.session.user;
            await this.database.lock(async () => {
                if(comment.userId != user.id && user.role != 'admin') return;
                if(await comment.comments.count() > 0){
                    await comment.update({ deleted: true });
                } else {
                    await comment.delete();
                }
            });
        }
        return this.renderRedirect({ target: '_top' });
    }
}