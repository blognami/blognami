
import { Frame } from './frame.js';

export class Modal extends Frame {

    static get name(){ return 'modal' }

    constructor(...args){
        super(...args)
        this.on('click', '.p-modal, .p-close', (event) => {
            event.stopPropagation()
            this.close()
        })
    }

    close(){
        this.remove()
        if(!this.document.find('body').pop().children.filter((child) => child.is('.p-modal')).length){
            this.document.find('html').pop().removeClass('p-clip')
        }
    }

}

Modal.register()