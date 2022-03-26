
export default {
    render(){
        return this.renderCss({
            '.bn-editable-area': {
                borderWidth: '0.1rem',
                borderStyle: 'dashed',
                borderColor: 'var(--color-dark-gray)',
                '&-header': { textAlign: 'right' },
                '&-body, &-header': { padding: '0.7rem' }
            }
        });
    }
};
