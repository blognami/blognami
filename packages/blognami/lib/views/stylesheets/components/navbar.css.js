
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

                '&-item + &-item': {
                    marginLeft: '1em'
                }
            }
        });
    }
};