export default {
    meta(){
        this.assignProps({
            description: 'Runs a command inside the sandbox container (interactive). Defaults to bash.'
        });
        this.tag('sandbox');

        this.hasParam('command', { type: 'string', alias: 'arg1', optional: true, description: 'The command to run (defaults to bash).' });
    },

    async run(){
        const command = this.params.command || 'bash';
        const result = await this.sandbox.run(command, { interactive: true });
        process.exit(result.exitCode);
    }
};
