
export default {
    render(){
        const { name, value, error, cssClasses, hasSaveChangesButton = false } = this.params;

        return this.renderTag('textarea', {
            name,
            class: `${cssClasses.textarea} ${error ? cssClasses.isError : ''}`,
            'data-component': 'pinstripe-anchor',
            'data-href': '/_markdown_editor/modal',
            'data-target': '_overlay',
            'data-preload': true,
            'data-test-id': 'markdown-input',
            'data-has-save-changes-button': hasSaveChangesButton ? 'true' : 'false',
            body: value
        });
    }
};
