
export default {
    render(){
        return this.renderCss({
            '.ps-textarea': {
                border: '0.1rem solid #dbdbdb',
                width: '100%',
                minHeight: '7em',
                borderRadius: '0.4rem',
                paddingBottom: 'calc(0.5em - 0.1rem)',
                paddingLeft: 'calc(0.75em - 0.1rem)',
                paddingRight: 'calc(0.75em - 0.1rem)',
                paddingTop: 'calc(0.5em - 0.1rem)',
            }
        });
    }
};
