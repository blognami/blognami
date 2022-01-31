
import { defineView } from 'pinstripe';

defineView('base.css', async ({ renderCss, themeConfig }) => renderCss({
    get '*'() {
        return {
            margin: 0,
            padding: 0,
            color: themeConfig.colors.text,
            fontSize: themeConfig.fontSizes.text,
            fontWeight: 400,
            lineHeight: 1.5,
            boxSizing: 'border-box',
            fontFamily: themeConfig.fonts.main,
            textRendering: 'optimizeLegibility',
            textSizeAdjust: '100%',
            '-moz-osx-font-smoothing': 'grayscale',
            '-webkit-font-smoothing': 'antialiased',
        };
    },

    'article, aside, figure, footer, header, hgroup, section': { display: 'block' },

    get 'code, pre'(){
        return {
            '-moz-osx-font-smoothing': 'auto',
            '-webkit-font-smoothing': 'auto',
            'font-family': themeConfig.fonts.code,
        };
    },

    get a() {
        return {
            color: themeConfig.colors.link,
            cursor: 'pointer',
            textDecoration: 'none',
            strong: { color: 'currentColor' },
            '&:hover': { color: themeConfig.colors.linkHover }
        };
    },

    get code() {
        return {
            backgroundColor: themeConfig.colors.codeBackground,
            color: themeConfig.colors.code,
            fontSize: themeConfig.fontSizes.code,
            fontWeight: themeConfig.fontWeights.code,
            padding: themeConfig.space.codePadding
        };
    },

    get hr() {
        return {
            backgroundColor: themeConfig.colors.hrBackground,
            border: 'none',
            display: 'block',
            height: themeConfig.sizes.hrHeight,
            margin: themeConfig.space.hrMargin
        };
    },

    img: {
        height: 'auto',
        maxWidth: '100%'
    },

    'input[type="checkbox"], input[type="radio"]': { verticalAlign: 'baseline' },

    get small() {
        return {
            fontSize: themeConfig.fontSizes.small
        }
    },

    span: {
        fontStyle: 'inherit',
        fontWeight: 'inherit'
    },

    get strong() {
        return {
            color: themeConfig.colors.strong,
            fontWeight: themeConfig.fontWeights.strong
        }
    },

    fieldset: { border: 'none' },


    get pre() {
        return {
            '-webkit-overflow-scrolling': 'touch',
            backgroundColor: themeConfig.colors.preBackground,
            color: themeConfig.colors.pre,
            fontSize: themeConfig.fontSizes.pre,
            overflowX: 'auto',
            padding: themeConfig.space.prePadding,
            whiteSpace: 'pre',
            wordWrap: 'normal',
            code: {
                backgroundColor: 'transparent',
                color: 'currentColor',
                fontSize: themeConfig.fontSizes.preCode,
                padding: 0
            }
        }
    },

    'li + li': { marginTop: '0.25em' },

    'p, dl, ol, ul, blockquote, pre, table': { '&:not(:last-child)': { marginBottom: '1em' } },

    get 'h1, h2, h3, h4, h5, h6'() {
        return {
            color: themeConfig.colors.heading,
            fontWeight: themeConfig.fontWeights.heading,
            lineHeight: themeConfig.lineHeights.heading
        };
    },

    h1: {
        fontSize: '2em',
        marginBottom: '0.5em',
        '&:not(:first-child)': { marginTop: '1em' }
    },

    h2: {
        fontSize: '1.75em',
        marginBottom: '0.5714em',
        '&:not(:first-child)': { marginTop: '1.1428em' }
    },

    h3: {
        fontSize: '1.5em',
        marginBottom: '0.6666em',
        '&:not(:first-child)': { marginTop: '1.3333em' }
    },

    h4: {
        fontSize: '1.25em',
        marginBottom: '0.8em'
    },

    h5: {
        fontSize: '1.125em',
        marginBottom: '0.8888em'
    },

    h6: {
        fontSize: '1em',
        marginBottom: '1em'
    },

    get blockquote() {
        return {
            backgroundColor: themeConfig.colors.blockquoteBackground,
            padding: themeConfig.space.blockquotePadding
        };
    },

    ol: {
        listStylePosition: 'outside',
        marginTop: '1em',
        '&:not([type])': { listStyleType: 'decimal' }
    },

    ul: {
        listStyle: 'disc outside',
        marginTop: '1em',
        marginLeft: '2em',
        marginBottom: '1em',
        ul: {
            listStyleType: 'circle',
            marginTop: '0.5em',
            ul: {
                listStyleType: 'square',
            }
        }
    },

    figure: {
        marginLeft: '2em',
        marginRight: '2em',
        textAlign: 'center',
        '&:not(:first-child)': { marginTop: '2em' },
        '&:not(:last-child)': { marginBottom: '2em' },
        img: { display: 'inlineBlock' },
        figcaption: { fontStyle: 'italic' }
    },

    'sup, sub': { fontSize: '75%' },

    get table() {
        return {
            width: '100%',

            'td, th': {
                border: themeConfig.borders.tableCell,
                borderWidth: themeConfig.borderWidths.tableCell,
                padding: themeConfig.space.tableCellPadding,
                verticalAlign: 'top',
                '&:not([align])': { textAlign: 'inherit' }
            },

            th: { color: themeConfig.colors.tableCellHeading },

            thead: {
                'td, th': {
                    borderWidth: themeConfig.borderWidths.tableHeadCell,
                    color: themeConfig.colors.tableHeadCell,
                }
            },

            tfoot: {
                'td, th': {
                    borderWidth: themeConfig.borderWidths.tableFootCell,
                    color: themeConfig.colors.tableFootCell,
                }
            },

            'tbody tr:last-child': { 'td, th': { borderBottomWidth: 0 } }
        }
    },

    'button, *.button': {
        '-moz-appearance': 'none',
        '-webkit-appearance': 'none',
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'top',
        justifyContent: 'center',
    
        border: '1px solid transparent',
        borderRadius: '4px',
        boxShadow: 'none',
        fontSize: '1rem',
        height: '2.5em',
        lineHeight: '1.5',
        position: 'relative',
        
        backgroundColor: 'white',
        borderColor: '#dbdbdb',
        borderWidth: '1px',
        color: '#363636',
        cursor: 'pointer',
        
        paddingBottom: 'calc(0.5em - 1px)',
        paddingLeft: '1em',
        paddingRight: '1em',
        paddingTop: 'calc(0.5em - 1px)',
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

    input: {
        '-moz-appearance': 'none',
        '-webkit-appearance': 'none',
        alignItems: 'center',
        border: '1px solid transparent',
        borderRadius: '4px',
        boxShadow: 'none',
        display: 'inline-flex',
        fontSize: '1rem',
        height: '2.5em',
        justifyContent: 'flex-start',
        lineHeight: '1.5',
        paddingBottom: 'calc(0.5em - 1px)',
        paddingLeft: 'calc(0.75em - 1px)',
        paddingRight: 'calc(0.75em - 1px)',
        paddingTop: 'calc(0.5em - 1px)',
        position: 'relative',
        verticalAlign: 'top',

        backgroundColor: 'white',
        borderColor: '#dbdbdb',
        borderRadius: '4px',
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

    textarea: {
        border: '1px solid #dbdbdb',
        width: '100%',
        minHeight: '7em',
        borderRadius: '4px',
        paddingBottom: 'calc(0.5em - 1px)',
        paddingLeft: 'calc(0.75em - 1px)',
        paddingRight: 'calc(0.75em - 1px)',
        paddingTop: 'calc(0.5em - 1px)',
    },

    label: {
        color: '#363636',
        display: 'block',
        fontSize: '1rem',
        fontWeight: '700',
        '&:not(:last-child)': { marginBottom: '0.5em' }
    },

    '*.is-error:not(input):not(textarea)': {
        color: '#f14668',
        display: 'block',
    },

    '&.has-overlay': { overflow: 'hidden !important' },

    '.card': {
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
    },

    '.container': {
        maxWidth: '1020px',
        margin: '0 auto 0 auto'
    },

    '.default-block': {
        borderWidth: '1px',
        borderStyle: 'dashed',
        padding: '1em',
        '> ul > li': { cursor: 'pointer' }
    },

    '.frame': {
        '&:not(:last-child)': { marginBottom: '1em' }
    },

    '.markdown-editor': {
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
    },

    '.modal': {
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
    },

    '.navbar': {
        textAlign: 'right'
    },

    '.overlay': {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        zIndex: '1000000'
    },

    '.pagination': {
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
                    
                        border: '1px solid transparent',
                        borderRadius: '4px',
                        boxShadow: 'none',
                        fontSize: '1rem',
                        height: '2.5em',
                        lineHeight: '1.5',
                        position: 'relative',
                        
                        backgroundColor: 'white',
                        borderColor: '#dbdbdb',
                        borderWidth: '1px',
                        color: '#363636',
                        cursor: 'pointer',
                        
                        paddingBottom: 'calc(0.5em - 1px)',
                        paddingLeft: '1em',
                        paddingRight: '1em',
                        paddingTop: 'calc(0.5em - 1px)',
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

    '.progress-bar': {
        position: 'fixed',
        display: 'block',
        top: '0',
        left: '0',
        height: '3px',
        width: '100%',
        zIndex: '100000',
    
        get '> div'() {
            const animationDuration = 300;
    
            return {
                position: 'fixed',
                display: 'block',
                top: '0',
                left: '0',
                height: '3px',
                width: '0',
                background: '#0076ff',
                transition: `width ${animationDuration}ms ease-out, opacity ${animationDuration / 2}ms ${animationDuration / 2}ms ease-in`,
                transform: 'translate3d(0, 0, 0)',
            }
        }
    }
}));

