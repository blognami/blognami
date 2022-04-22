
export default {
    render(){
        return this.renderCss({
            '.ps-card': {
                width: '100%',

                '&-header, &-body, &-footer': {
                    display: 'block',
                    padding: '2.0rem',
                },

                '&-header': {
                    backgroundColor: 'whitesmoke',
                    borderBottom: '0.1rem solid #dbdbdb',
                    borderTopLeftRadius: '0.6rem',
                    borderTopRightRadius: '0.6rem',
            
                    '&-title': {
                        color: '#363636',
                        flexGrow: '1',
                        flexShrink: '0',
                        fontSize: '2.4rem',
                        lineHeight: '1'
                    }
                },
                
                '&-body': {
                    backgroundColor: 'white'
                },
            
                '&-footer': {
                    backgroundColor: 'whitesmoke',
                    borderBottomLeftRadius: '0.6rem',
                    borderBottomRightRadius: '0.6rem',
                    borderTop: '0.1rem solid #dbdbdb'
                }
            },
        });
    }
};
