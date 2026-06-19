
export default {
    meta(){
        this.assignProps({
            description: 'Starts an interactive REPL (Read-Eval-Print Loop) session for the project.'
        });
        this.tag('core');
    },

    async run(){
        await this.repl.start();
    }
};
