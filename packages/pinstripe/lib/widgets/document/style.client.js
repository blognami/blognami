
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        const animationDuration = 300;

        this.patch(`
            *[data-widget="document/progress-bar"] {
                position: fixed;
                display: block;
                top: 0;
                left: 0;
                height: 3px;
                width: 100%;
                z-index: 100000;
            }
        
            *[data-widget="document/progress-bar"] > div {
                position: fixed;
                display: block;
                top: 0;
                left: 0;
                height: 3px;
                width: 0;
                background: #0076ff;
                transition: 
                    width ${animationDuration}ms ease-out, 
                    opacity ${animationDuration / 2}ms ${animationDuration / 2}ms ease-in;
                transform: translate3d(0, 0, 0);
            }
        
            *[data-clipped="true"] {
                overflow: hidden !important;
            }
        
            *[data-widget="overlay"] {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                z-index: 1000000;
            }
        `);
    }
};
