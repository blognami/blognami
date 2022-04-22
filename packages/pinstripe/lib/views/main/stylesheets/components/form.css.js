
export default {
    render(){
        return this.renderCss({
            '*.ps-is-error:not(input):not(textarea)': {
                color: '#f14668',
                display: 'block',
            },
        });
    }
};
