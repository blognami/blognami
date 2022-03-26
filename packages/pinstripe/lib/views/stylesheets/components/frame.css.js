
export default {
    render(){
        return this.renderCss({
            '.ps-frame': {
                '&:not(:last-child)': { marginBottom: '1em' }
            },
        });
    }
};
