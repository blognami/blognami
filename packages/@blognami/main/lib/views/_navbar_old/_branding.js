
export default {
    render(){
        return this.renderHtml`
            <a href="/" data-test-id="title">${this.database.site.title}</a>
        `
    }
};
