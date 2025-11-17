
export default {
    render(){
        const { name, value, error, cssClasses, hasSaveChangesButton = false } = this.params;

        return this.renderHtml`
            <textarea
                name="${name}"
                class="${cssClasses.textarea} ${error ? cssClasses.isError : ''}"
                data-component="pinstripe-anchor"
                data-href="/_markdown_editor/modal"
                data-target="_overlay"
                data-preload
                data-test-id="markdown-input"
                ${hasSaveChangesButton ? 'data-has-save-changes-button="true"' : ''}
            >${value}</textarea>
        `;
    }
};
