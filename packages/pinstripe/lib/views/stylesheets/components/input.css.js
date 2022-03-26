
export default {
    render(){
        return this.renderCss({
            ".ps-input:not([type='checkbox'])": {
                '-moz-appearance': 'none',
                '-webkit-appearance': 'none',
                alignItems: 'center',
                border: '0.1rem solid transparent',
                borderRadius: '0.4rem',
                boxShadow: 'none',
                display: 'inline-flex',
                fontSize: '1.6rem',
                height: '2.5em',
                justifyContent: 'flex-start',
                lineHeight: '1.5',
                paddingBottom: 'calc(0.5em - 0.1rem)',
                paddingLeft: 'calc(0.75em - 0.1rem)',
                paddingRight: 'calc(0.75em - 0.1rem)',
                paddingTop: 'calc(0.5em - 0.1rem)',
                position: 'relative',
                verticalAlign: 'top',
        
                backgroundColor: 'white',
                borderColor: '#dbdbdb',
                borderRadius: '0.4rem',
                color: '#363636',
        
                boxShadow: 'inset 0 0.0625em 0.125em rgb(10 10 10 / 5%)',
                maxWidth: '100%',
                width: '100%',
        
                '&:focus': {
                    outline: 'none',
                    borderColor: '#485fc7',
                    boxShadow: '0 0 0 0.125em rgb(72 95 199 / 25%)',
                },
        
                '&.is-error': {
                    borderColor: '#f14668',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: '0 0 0 0.125em rgb(241 70 104 / 25%)',
                    }
                },
        
                '+ .is-error': {
                    fontSize: '0.75rem',
                    marginTop: '0.25rem'
                },
            }
        });
    }
};
