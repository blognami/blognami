
export default {
    render(){
        return this.renderCss({
            '.ps-label': {
                color: '#363636',
                display: 'block',
                fontSize: '1.6rem',
                fontWeight: '700',
                '&:not(:last-child)': { marginBottom: '0.5em' }
            }
        });
    }
};
