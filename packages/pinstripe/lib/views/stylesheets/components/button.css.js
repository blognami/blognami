
export default {
    render(){
        return this.renderCss({
            '.ps-button': {
                '-moz-appearance': 'none',
                '-webkit-appearance': 'none',
                display: 'inline-flex',
                alignItems: 'center',
                verticalAlign: 'top',
                justifyContent: 'center',
            
                border: '0.1rem solid transparent',
                borderRadius: '0.4rem',
                boxShadow: 'none',
                fontSize: '1.6rem',
                height: '2.5em',
                lineHeight: '1.5',
                position: 'relative',
                
                backgroundColor: 'white',
                borderColor: '#dbdbdb',
                borderWidth: '0.1rem',
                color: '#363636',
                cursor: 'pointer',
                
                paddingBottom: 'calc(0.5em - 0.1rem)',
                paddingLeft: '1em',
                paddingRight: '1em',
                paddingTop: 'calc(0.5em - 0.1rem)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
            
                '&:hover': {
                    borderColor: '#b5b5b5',
                    color: '#363636',
                },
            
                '&:not(:last-child)': {
                    marginRight: '0.5em',
                },
            
                "&[type='submit'], &.is-primary": {
                    backgroundColor: '#48c78e',
                    borderColor: 'transparent',
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: '#00c4a7',
                        borderColor: 'transparent',
                        color: '#fff',
                    }
                }
            }
        });
    }
};
