
export default {
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
        right: '20px',
        top: '20px',
    
        height: '32px',
        width: '32px',
    
        userSelect: 'none',
        '-webkit-appearance': 'none',
        border: 'none',
        borderRadius: '9999px',
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
            height: '2px',
            width: '50%',   
        },
    
        '&:after': {
            height: '50%',
            width: '2px',
        }
    },

    '> *:not(button)': {
        maxHeight: 'calc(100vh - 40px)',
        maxWidth: 'calc(100vw - 160px)',
        margin: '0 auto'
    },

    '> form': {
        minWidth: '640px',
    
        '> *': {
            display: 'block',
            backgroundColor: 'white',
            flexGrow: '1',
            flexShrink: '1',
            overflow: 'auto',
            padding: '20px',
        },
    
        '> header, > footer': {
            alignItems: 'center',
            backgroundColor: 'whitesmoke',
            display: 'flex',
            flexShrink: '0',
            justifyContent: 'flex-start',
            padding: '20px',
            position: 'relative'
        },
    
        '> header': {
            borderBottom: '1px solid #dbdbdb',
            borderTopLeftRadius: '6px',
            borderTopRightRadius: '6px',
    
            '> *': {
                color: '#363636',
                flexGrow: '1',
                flexShrink: '0',
                fontSize: '1.5rem',
                lineHeight: '1'
            }
        },
    
        '> footer': {
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
            borderTop: '1px solid #dbdbdb'
        }
    }
};
