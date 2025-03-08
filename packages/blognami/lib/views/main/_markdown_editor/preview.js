
export const client = true;

export default {
    render(){
        return this.renderMarkdown(this.params.value, { mode: 'edit' });
    }
}
