
import { defineDecorator } from "../node_wrapper.js";

defineDecorator('pinstripe-progress-bar', function(){
    this.shadow.patch(`
        <div class="progress-bar"></div>

        <style>
            .progress-bar {
                position: fixed;
                display: block;
                top: 0;
                left: 0;
                height: 0.3rem;
                width: 100%;
                z-index: 100000;
            }
            .progress-bar > div {
                position: fixed;
                display: block;
                top: 0;
                left: 0;
                height: 0.3rem;
                width: 0;
                background: #0076ff;
                transition: width 300ms ease-out, opacity 150ms 150ms ease-in;
                transform: translate3d(0, 0, 0);
            }
        </style>

        <slot>
    `);

    const progressBar = this.shadow.find('.progress-bar');

    this.assignProps({
        width: 0,
    
        startCount: 0,
    
        start(){
            if(this.startCount == 0){
                this._delayTimeout = this.setTimeout(() => {
                    progressBar.patch('');
                    progressBar.patch('<div></div>');
                    this._animationInterval = this.setInterval(() => {
                        const child = progressBar.children.pop();
                        if(child){
                            this.width = this.width + (Math.random() / 100);
                            child.node.style.width = `${10 + (this.width * 90)}%`;
                        }
                    }, 300);
                }, 300);
            }
            this.startCount++;
        },
    
        stop(){
            this.startCount--;
            if(this.startCount == 0){
                clearTimeout(this._delayTimeout);
                clearInterval(this._animationInterval);
                this.width = 0;
                const child = progressBar.children.pop();
                if(child){
                    child.node.style.width = '100%';
                    child.node.style.opacity = 0;
                }
            }
        }
    });
});
