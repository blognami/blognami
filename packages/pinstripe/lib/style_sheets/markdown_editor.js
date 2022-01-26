
export default {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    maxWidth: '1200px',
    background: '#fff',
    zIndex: '1',

    '&-text-pane, &-preview-pane': {
        flex: '1 1 0',
        height: '100%',
    },

    '&-text-pane': {
        position: 'relative',
        borderStyle: 'solid',
        borderWidth: '0 1px 0 0',
        borderColor: 'rgb(99, 99, 99)',
        padding: 0,

        '> textarea': {
            border: 'none',
            height: '100%',
            width: '100%',
            resize: 'none',
            outline: 'none',
            fontSize: '16px',
            fontFamily: 'monospace',
            padding: '1em'
        }
    },

    '&-preview-pane': {
        overflowY: 'auto',
        padding: '1em'
    }
};
