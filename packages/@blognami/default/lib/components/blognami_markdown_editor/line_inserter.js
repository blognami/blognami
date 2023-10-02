
export default {
    initialize(...args){
        this.constructor.parent.prototype.initialize.call(this, ...args);

        this.on('click', () => {
            const { lineContent } = this.params;
            const { lineNumber } = this.parents.find(n => n.is('[data-line-number]')).params;
            const markdownEditor =  this.parents.find(n => n.is('.markdown-editor'));
    
            markdownEditor.replaceLine(lineNumber - 1, lineContent);
        });
    }
};
