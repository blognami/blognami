
export default {
    meta(){
        this.annotate({
            description: 'Starts an interactive REPL (Read-Eval-Print Loop) session for the project.'
        });
    },

    async run(){
        await this.repl.start();
    }
};
