
import { NodeWrapper } from '../node_wrapper.js';

export class ProgressBar extends NodeWrapper {

    static get name(){ return 'progress-bar' }

    static get selector(){ return '#p-progress-bar' }

    constructor(...args){
        super(...args)
        this.width = 0
        this.startCount = 0
        this.patch('')
    }

    start(){
        if(this.startCount == 0){
            this._delayTimeout = this.setTimeout(() => {
                this.patch('')
                this.patch('<div></div>')
                this._animationInterval = this.setInterval(() => {
                    const child = this.children.pop();
                    if(child){
                        this.width = this.width + (Math.random() / 100)
                        child.node.style.width = `${10 + (this.width * 90)}%`
                    }
                }, 300);
            }, 300);
        }
        this.startCount++
    }

    stop(){
        this.startCount--
        if(this.startCount == 0){
            clearTimeout(this._delayTimeout);
            clearInterval(this._animationInterval)
            this.width = 0
            const child = this.children.pop();
            if(child){
                child.node.style.width = '100%'
                child.node.style.opacity = 0
            }
        }
    }

}

ProgressBar.register()
