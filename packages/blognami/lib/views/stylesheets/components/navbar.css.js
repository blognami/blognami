
export default {
    render(){
        return this.renderCss({
            '.navbar': {
                borderWidth: '0 0 0.1rem 0',
                borderStyle: 'solid',
                borderColor: 'var(--color-light-gray)',
                paddingLeft: '1em',
                paddingRight: '1em',

                '&-inner': {
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    minHeight: '3em',
                },

                '&-brand': {
                    flex: '0 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 600
                },

                '&-menu': {
                    flex: '1 1 100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                },

                '&-item': {
                    position: 'relative',
                    padding: '0.375rem 1rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    '&.has-dropdown': {
                        paddingRight: '2.5em',
                        '&::after': {
                            border: '3px solid transparent',
                            borderRadius: '2px',
                            borderRight: 0,
                            borderTop: 0,
                            content: " ",
                            display: 'block',
                            height: '0.625em',
                            marginTop: '-0.4375em',
                            pointerEvents: 'none',
                            position: 'absolute',
                            top: '50%',
                            transform: 'rotate(-45deg)',
                            transformOrigin: 'center',
                            width: '0.625em',
                            borderColor: '#485fc7',
                            marginTop: '-0.375em',
                            right: '1.125em'
                        }
                    }
                },

                '> &-item + &-item': {
                    marginLeft: '1em'
                },

                '&-dropdown': {
                    display: 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: '6px',
                    borderBottomRightRadius: '6px',
                    borderTop: '2px solid #dbdbdb',
                    boxShadow: '0 8px 8px rgb(10 10 10 / 10%)',
                    padding: '8px 0 8px 0',
                    '.navbar-item': {
                        display: 'block',
                        padding: '6px 48px 6px 16px'
                    }
                },

                '&-item:hover &-dropdown, &-item:focus &-dropdown, &-item:focus-within &-dropdown': {
                    display: 'block'
                },
            }
        });
    }
};