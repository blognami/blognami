
export default {
    backgroundVolor: 'white',
    borderRadius: '0.25rem',
    boxShadow: '0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0px 0 1px rgb(10 10 10 / 2%)',
    color: '#4a4a4a',
    maxWidth: '100%',
    position: 'relative',
    marginBottom: '2em', 

    '> *': {
        backgroundColor: 'transparent',
        padding: '1.5rem'
    },

    '> header': {
        backgroundColor: 'transparent',
        alignItems: 'stretch',
        boxShadow: '0 0.125em 0.25em rgb(10 10 10 / 10%)',
        display: 'flex',
        alignItems: 'center',
        flexGrow: '1',
        padding: '0.75rem 1rem',
        '> *': {
            color: '#363636',
            fontWeight: '700'
        }
    },

    '> footer': {
        backgroundColor: 'transparent',
        borderTop: '1px solid #ededed',
        alignItems: 'stretch'
    }
};
