
export default async ({ renderCss }) => renderCss({

    html: {
        fontSize: '62.5%'
    },

    body: {
        fontSize: '1.6rem'
    },

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
    },

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
    },

    '.ps-textarea': {
        border: '0.1rem solid #dbdbdb',
        width: '100%',
        minHeight: '7em',
        borderRadius: '0.4rem',
        paddingBottom: 'calc(0.5em - 0.1rem)',
        paddingLeft: 'calc(0.75em - 0.1rem)',
        paddingRight: 'calc(0.75em - 0.1rem)',
        paddingTop: 'calc(0.5em - 0.1rem)',
    },

    '.ps-label': {
        color: '#363636',
        display: 'block',
        fontSize: '1.6rem',
        fontWeight: '700',
        '&:not(:last-child)': { marginBottom: '0.5em' }
    },

    '*.ps-is-error:not(input):not(textarea)': {
        color: '#f14668',
        display: 'block',
    },

    '&.ps-has-overlay': { overflow: 'hidden !important' },

    '.ps-default-block': {
        borderWidth: '0.1rem',
        borderStyle: 'dashed',
        padding: '1em',
        '> ul > li': { cursor: 'pointer' }
    },

    '.ps-frame': {
        '&:not(:last-child)': { marginBottom: '1em' }
    },

    '.ps-markdown-editor': {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        maxWidth: '120.0rem',
        background: '#fff',
        zIndex: '1',
    
        '&-text-pane, &-preview-pane': {
            flex: '1 1 0',
            height: '100%',
        },
    
        '&-text-pane': {
            position: 'relative',
            borderStyle: 'solid',
            borderWidth: '0 0.1rem 0 0',
            borderColor: 'rgb(99, 99, 99)',
            padding: 0,
    
            '> textarea': {
                border: 'none',
                height: '100%',
                width: '100%',
                resize: 'none',
                outline: 'none',
                fontSize: '1.6rem',
                fontFamily: 'monospace',
                padding: '1em'
            }
        },
    
        '&-preview-pane': {
            overflowY: 'auto',
            padding: '1em'
        }
    },

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
    },

    '.ps-navbar': {
        textAlign: 'right'
    },

    '.ps-overlay': {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        zIndex: '1000000'
    },

    '.ps-pagination': {
        get '> ul'() {
            return {
                listStyle: 'none',
                textAlign: 'center',
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                flexGrow: '1',
                flexShrink: '1',
                justifyContent: 'flex-start',
                order: '1',
                gap: '0.5em',
                '> li': {
                    margin: '0',
                    padding: '0',
                    listStyle: 'none',
                    
                    '> a': {
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
                        marginBottom: '2em',
                    
                        '&:hover': {
                            borderColor: '#b5b5b5',
                            color: '#363636',
                        },
                    
                        '&:not(:last-child)': {
                            marginRight: '0.5em',
                        },
    
                        '&.is-current': {
                            backgroundColor: '#485fc7',
                            borderColor: '#485fc7',
                            color: '#fff',
                    
                            '&:hover': {
                                borderColor: '#b5b5b5',
                                color: '#363636',
                            }
                        }
                    },
                }
            };
        }
    },

    '.ps-progress-bar': {
        position: 'fixed',
        display: 'block',
        top: '0',
        left: '0',
        height: '0.3rem',
        width: '100%',
        zIndex: '100000',
    
        get '> div'() {
            const animationDuration = 300;
    
            return {
                position: 'fixed',
                display: 'block',
                top: '0',
                left: '0',
                height: '0.3rem',
                width: '0',
                background: '#0076ff',
                transition: `width ${animationDuration}ms ease-out, opacity ${animationDuration / 2}ms ${animationDuration / 2}ms ease-in`,
                transform: 'translate3d(0, 0, 0)',
            }
        }
    }
});
