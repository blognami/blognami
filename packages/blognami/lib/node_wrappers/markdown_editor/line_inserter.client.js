
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);
        
        this.on('click', () => {
            const { lineContent } = this.data;
            const { lineNumber } = this.parents.find(n => n.is('[data-line-number]')).data;
            const markdownEditor =  this.parents.find(n => n.is('.markdown-editor'));

            markdownEditor.replaceLine(lineNumber, lineContent);
        });
    }
};
