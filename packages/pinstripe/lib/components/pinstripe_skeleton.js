
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const { height = 'auto', width = '100%', radius = '3px' } = this.params
        
        this.shadow.patch(`
            <style>
                @keyframes animation {
                    from,to {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 1;
                    }
                }

                .root {
                    display: inline-block;
                    height: ${height};
                    width: ${width};
                    border-radius: ${radius};
                    position: relative;
                    overflow: hidden;
                }

                .root::before {
                    position: absolute;
                    top: 0;
                    right: 0;
                    left: 0;
                    bottom: 0;
                    content: "";
                    background: #fff;
                    z-index: 10;
                }
                
                .root::after {
                    position: absolute;
                    top: 0;
                    right: 0;
                    left: 0;
                    bottom: 0;
                    content: "";
                    background: #dee2e6;
                    -webkit-animation: animation-151xhna 1500ms linear infinite;
                    animation: animation 1500ms linear infinite;
                    z-index: 11;
                }
            </style>
            <div class="root"><slot></div>
        `);
    }
};
