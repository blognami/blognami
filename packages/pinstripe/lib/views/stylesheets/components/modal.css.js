
export default {
    render(){
        return this.renderCss({
            '.ps-modal': {
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center',
                overflow: 'auto',
                zIndex: '40',
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                top: '0',
                backgroundColor: 'rgba(10, 10, 10, 0.86)',
            
                '> button': {
                    background: 'none',
                    position: 'fixed',
                    right: '2.0rem',
                    top: '2.0rem',
                
                    height: '3.2rem',
                    width: '3.2rem',
                
                    userSelect: 'none',
                    '-webkit-appearance': 'none',
                    border: 'none',
                    borderRadius: '999.9rem',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    display: 'inline-block',
                    flexGrow: '0',
                    flexShrink: '0',
                    fontSize: '0',
                    outline: 'none',
                    verticalAlign: 'top',
                
                    '&:before, &:after': {
                        backgroundColor: 'white',
                        content: '',
                        display: 'block',
                        left: '50%',
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
                        transformOrigin: 'center center',
                        boxSizing: 'inherit',
                    },
                
                    '&:before': {
                        height: '0.2rem',
                        width: '50%',   
                    },
                
                    '&:after': {
                        height: '50%',
                        width: '0.2rem',
                    }
                },
            
                '> *:not(button)': {
                    maxHeight: 'calc(100vh - 4.0rem)',
                    maxWidth: 'calc(100vw - 16.0rem)',
                    margin: '0 auto'
                },
            
                '> form': {
                    minWidth: '64.0rem',
                
                    '> *': {
                        display: 'block',
                        backgroundColor: 'white',
                        flexGrow: '1',
                        flexShrink: '1',
                        overflow: 'auto',
                        padding: '2.0rem',
                    },
                
                    '> header, > footer': {
                        alignItems: 'center',
                        backgroundColor: 'whitesmoke',
                        display: 'flex',
                        flexShrink: '0',
                        justifyContent: 'flex-start',
                        padding: '2.0rem',
                        position: 'relative'
                    },
                
                    '> header': {
                        borderBottom: '0.1rem solid #dbdbdb',
                        borderTopLeftRadius: '0.6rem',
                        borderTopRightRadius: '0.6rem',
                
                        '> *': {
                            color: '#363636',
                            flexGrow: '1',
                            flexShrink: '0',
                            fontSize: '2.4rem',
                            lineHeight: '1'
                        }
                    },
                
                    '> footer': {
                        borderBottomLeftRadius: '0.6rem',
                        borderBottomRightRadius: '0.6rem',
                        borderTop: '0.1rem solid #dbdbdb'
                    }
                }
            }
        });
    }
};
