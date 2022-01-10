
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
        padding: '1em',
    },

    '&-text-pane': {
        position: 'relative',

        '> textarea': {
            height: '100%',
            width: '100%',
            resize: 'none',
            outline: 'none',
            borderStyle: 'solid',
            borderWidth: '0 1px 0 0',
            borderColor: 'rgb(99, 99, 99)',
            fontSize: '16px',
            fontFamily: 'monospace',
        }
    },

    '&-preview-pane': {
        overflowY: 'scroll',
    }
};
