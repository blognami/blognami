
export default {
    meta(){
        this.assignProps({
            priority: 0,

            cssNamespace: ':root'
        });
    },

    get '*'() {
        return {
            margin: 0,
            padding: 0,
            color: this.themeConfig.colors.text,
            fontSize: this.themeConfig.fontSizes.text,
            fontWeight: 400,
            lineHeight: 1.5,
            boxSizing: 'border-box',
            fontFamily: this.themeConfig.fonts.main,
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
            'font-family': this.themeConfig.fonts.code,
        };
    },

    get a() {
        return {
            color: this.themeConfig.colors.link,
            cursor: 'pointer',
            textDecoration: 'none',
            strong: { color: 'currentColor' },
            '&:hover': { color: this.themeConfig.colors.linkHover }
        };
    },

    get code() {
        return {
            backgroundColor: this.themeConfig.colors.codeBackground,
            color: this.themeConfig.colors.code,
            fontSize: this.themeConfig.fontSizes.code,
            fontWeight: this.themeConfig.fontWeights.code,
            padding: this.themeConfig.space.codePadding
        };
    },

    get hr() {
        return {
            backgroundColor: this.themeConfig.colors.hrBackground,
            border: 'none',
            display: 'block',
            height: this.themeConfig.sizes.hrHeight,
            margin: this.themeConfig.space.hrMargin
        };
    },

    img: {
        height: 'auto',
        maxWidth: '100%'
    },

    'input[type="checkbox"], input[type="radio"]': { verticalAlign: 'baseline' },

    get small() {
        return {
            fontSize: this.themeConfig.fontSizes.small
        }
    },

    span: {
        fontStyle: 'inherit',
        fontWeight: 'inherit'
    },

    get strong() {
        return {
            color: this.themeConfig.colors.strong,
            fontWeight: this.themeConfig.fontWeights.strong
        }
    },

    fieldset: { border: 'none' },


    get pre() {
        return {
            '-webkit-overflow-scrolling': 'touch',
            backgroundColor: this.themeConfig.colors.preBackground,
            color: this.themeConfig.colors.pre,
            fontSize: this.themeConfig.fontSizes.pre,
            overflowX: 'auto',
            padding: this.themeConfig.space.prePadding,
            whiteSpace: 'pre',
            wordWrap: 'normal',
            code: {
                backgroundColor: 'transparent',
                color: 'currentColor',
                fontSize: this.themeConfig.fontSizes.preCode,
                padding: 0
            }
        }
    },

    'li + li': { marginTop: '0.25em' },

    'p, dl, ol, ul, blockquote, pre, table': { '&:not(:last-child)': { marginBottom: '1em' } },

    get 'h1, h2, h3, h4, h5, h6'() {
        return {
            color: this.themeConfig.colors.heading,
            fontWeight: this.themeConfig.fontWeights.heading,
            lineHeight: this.themeConfig.lineHeights.heading
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
            backgroundColor: this.themeConfig.colors.blockquoteBackground,
            padding: this.themeConfig.space.blockquotePadding
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
                border: this.themeConfig.borders.tableCell,
                borderWidth: this.themeConfig.borderWidths.tableCell,
                padding: this.themeConfig.space.tableCellPadding,
                verticalAlign: 'top',
                '&:not([align])': { textAlign: 'inherit' }
            },

            th: { color: this.themeConfig.colors.tableCellHeading },

            thead: {
                'td, th': {
                    borderWidth: this.themeConfig.borderWidths.tableHeadCell,
                    color: this.themeConfig.colors.tableHeadCell,
                }
            },

            tfoot: {
                'td, th': {
                    borderWidth: this.themeConfig.borderWidths.tableFootCell,
                    color: this.themeConfig.colors.tableFootCell,
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

    '&.has-overlay': { overflow: 'hidden !important' }

};
