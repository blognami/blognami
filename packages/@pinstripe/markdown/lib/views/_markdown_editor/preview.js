
export default {
    meta(){
        this.addToClient();
    },

    render(){
        return this.renderMarkdown(this.params.value, { mode: 'edit' });
    }
}
