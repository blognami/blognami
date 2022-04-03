
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

                '.ps-card': {
                    width: '64.0rem',
                    maxWidth: '100%',
                }
            }
        });
    }
};
