
export default {
    render(){
        return this.renderCss({
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
    }
};