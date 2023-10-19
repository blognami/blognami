
export default {
    render(){
        const { name, value, error, cssClasses } = this.params;

        return this.renderHtml`
            <textarea
                name="${name}"
                class="${cssClasses.textarea} ${error ? cssClasses.isError : ''}"
                data-component="blognami-anchor"
                data-href="/markdown/editor"
                data-target="_overlay"
                data-preload
                data-test-id="markdown-input"
            >${value}</textarea>
        `;
    }
};
