
export default {
    render(){
        return this.renderCss({
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
            }
        });
    }
};

