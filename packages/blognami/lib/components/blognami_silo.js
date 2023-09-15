

const cache = {};

export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        const template = this.find('children', 'template');

        if(template){
            this.shadow.patch(template.html);
            this.patch('');
        } else {
            this.shadow.patch('');
        }
        
    }
};
