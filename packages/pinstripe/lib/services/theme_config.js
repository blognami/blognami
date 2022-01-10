
// https://styled-system.com/theme-specification

export default () => {

    const gap = 32;

    return {
        borders: {
            tableCell: '1px solid hsl(0, 0%, 86%)'
        },

        borderWidths: {
            tableCell: '0 0 1px',
            tableFootCell: '2px 0 0',
            tableHeadCell: '0 0 2px',
        },

        colors: {
            background: 'hsl(0, 0%, 96%)',
            blockquoteBackground: 'hsl(0, 0%, 96%)',
            code: 'hsl(348, 86%, 46%)',
            codeBackground: 'hsl(0, 0%, 96%)',
            heading: 'hsl(0, 0%, 21%)',
            hrBackground: 'hsl(0, 0%, 96%)',
            link: '#485fc7',
            linkHover: 'hsl(0, 0%, 21%)',
            pre: 'hsl(0, 0%, 29%)',
            preBackground: 'hsl(0, 0%, 96%)',
            strong: 'hsl(0, 0%, 21%)',
            tableFootCell: 'hsl(0, 0%, 21%)',
            tableCellHeading: 'hsl(0, 0%, 21%)',
            tableHeadCell: 'hsl(0, 0%, 21%)',
            text: '#4a4a4a'
        },

        fonts: {
            main: `BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif`,
            code: 'monospace'
        },

        fontSizes: {
            code: '0.875em',
            preCode: '1em',
            small: '0.875em',
            text: '16px'
        },

        fontWeights: {
            code: 'normal',
            heading: '600',
            strong: '700'
        },

        lineHeights: {
            heading: '1.125'
        },
    
        mediaQueries: {
            tablet: `@media screen and (min-width: 769px)`,
            desktop: `@media screen and (min-width: ${960 + (2 * gap)}px`,
        },

        sizes: {
            hrHeight: '2px',
        },

        space: {
            blockquotePadding: '1.25em 1.5em',
            tableCellPadding: '0.5em 0.75em',
            codePadding: '0.25em 0.5em 0.25em',
            hrMargin: '1.5rem 0',
            prePadding: '1.25rem 1.5rem'
        }
    }
};
