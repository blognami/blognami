
export default {
    render(){
        return this.renderCss({
            '.bn-header': {
                backgroundColor: 'var(--color-white)',
                '&-inner': this.renderInner(),
                '&-brand': this.renderBrand(),
                '&-logo': this.renderLogo(),
                '&-menu': this.renderMenu(),
                '&-actions': this.renderActions(),
                '&-btn': this.renderBtn(),

                '@media (max-width: 991px)': {
                    '&.bn-is-open': {
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: 3999999,
                        padding: '0 var(--gap) 2.4rem',
                        overflowY: 'scroll',
                        '-webkit-overflow-scrolling': 'touch'
                    }
                }
            },

            '.bn-burger': this.renderBurger(),

            '@media (min-width: 992px)': {
                '.bn-header-inner': {
                    rowGap: '0 !important',
                    padding: 0
                },

                '.bn-header-brand': {
                    display: 'flex',
                    alignItems: 'center',
                    height: '80px',
                },

                '.bn-header-menu': {
                    height: '56px'
                },

                '.bn-header-menu::before, .bn-header-menu::after': {
                    position: 'absolute',
                    top: '80px',
                    left: 0,
                    width: '100%',
                    height: '1px',
                    content: "",
                    backgroundColor: 'var(--color-light-gray)'
                },

                '.bn-header-menu::after': {
                    top: '136px'
                }
            }
        });
    },

    renderInner(){
        return {
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            gridAutoFlow: 'row dense',
            columnGap: 'var(--head-nav-gap)',
            alignItems: 'center',
            padding: '3.2rem 0',
            gridTemplateColumns: 'auto 1fr',
            rowGap: '1.6rem',
            '@media (max-width: 767px)': { padding: '2rem 0' },
            '@media (max-width: 991px)': {
                gridTemplateColumns: '1fr',
                '.bn-header.bn-is-open &': {
                    gridTemplateRows: 'auto 1fr auto',
                    height: '100%'
                }
            }
        }
    },

    renderBrand(){
        return {
            lineHeight: 1,
            '&-wrapper': {
                display: 'flex',
                alignItems: 'center'
            },
            '@media (max-width: 991px)': {
                display: 'flex',
                gridColumnStart: 1,
                alignItems: 'center',
                justifyContent: 'space-between'
            }
        }
    },

    renderLogo(){
        return {
            fontSize: '2.4rem',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            img: { maxHeight: '32px' }
        };
    },

    renderMenu(){
        return {
            display: 'flex',
            alignItems: 'center',
            gridRowStart: 2,
            fontSize: '1.2rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            ul: {
                display: 'inline-flex',
                alignItems: 'center',
                padding: 0,
                margin: 0,
                listStyle: 'none',
                'li + li': { marginLeft: 'var(--head-nav-gap)' }
            },
            '@media (max-width: 991px)': {
                display: 'none',
                ul: {
                    a: { fontSize: '2.4rem' },
                    'li + li': {
                        marginTop: '1.2rem',
                        marginLeft: 0
                    }
                },
                '.bn-header.bn-is-open &': { 
                    display: 'block',
                    ul: {
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }
            }
        };
    },

    renderActions(){
        return {
            display: 'flex',
            justifyContent: 'flex-end',
            fontSize: '1.2rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            '@media (max-width: 991px)': {
                display: 'none',
                textAlign: 'center',
                '.bn-header.bn-is-open &': { display: 'block' }
            }
        };
    },

    renderBtn(){
        return {
            fontWeight: '600',

            svg: {
                width: '16px',
                height: '16px',
                marginRight: '0.6rem'
            },

            '& + &': { marginLeft: '1em' },

            '&.bn-btn': {
                padding: '0.9rem 1.4rem',
                fontSize: '1.5rem'
            },

            '&:not(.bn-btn)': {
                display: 'inline-flex',
                alignItems: 'center',
                color: 'var(--ghost-accent-color)'
            },

            '@media (max-width: 991px)': {
                marginTop: '3.2rem',
                marginLeft: 0,
                '&:not(.bn-btn)': { fontSize: '2rem' }
            }
        };
    },

    renderBurger(){
        return {
            position: 'relative',
            display: 'none',
            width: '30px',
            height: '30px',
            padding: 0,
            marginRight: '-3px',
            cursor: 'pointer',
            backgroundColor: 'transparent',
            border: 0,
            appearance: 'none',
            '&::before, &::after':{
                position: 'absolute',
                left: '3px',
                width: '24px',
                height: '1px',
                content: '',
                backgroundColor: 'var(--color-darker-gray)',
                transition: 'all 0.2s cubic-bezier(0.04, 0.04, 0.12, 0.96) 0.1008s'
            },
            '&::before': {
                top: '11px',
                '.bn-header.bn-is-open &': {
                    top: '15px',
                    transform: 'rotate(45deg)'
                }
            },
            '&::after': {
                bottom: '11px',
                '.bn-header.bn-is-open &': {
                    bottom: '14px',
                    transform: 'rotate(-45deg)'
                }
            },
            
            '@media (max-width: 991px)': { display: 'block' }
        };
    }
};