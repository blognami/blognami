
export default {
    render(){
        return this.renderCss({
            '.ps-overlay': {
                position: 'fixed',
                top: '0',
                left: '0',
                height: '100%',
                width: '100%',
                zIndex: '1000000'
            },

            '.ps-has-overlay': { overflow: 'hidden !important' }
        });
    }
};
