
import { Frame } from './frame.client.js';

Frame.register('modal').props({
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.on('click', '.p-modal, .p-close', (event) => {
            event.stopPropagation();
            this.close();
        });
    },

    close(){
        this.remove();
        if(!this.document.find('body').pop().children.filter((child) => child.is('.p-modal')).length){
            this.document.find('html').pop().removeClass('p-clip');
        }
    }
});
