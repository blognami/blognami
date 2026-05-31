export default {
    meta(){
        this.assignProps({
            description: 'Opens an interactive agent session against the configured provider, seeded with the configured Cardoon playbooks.',
            sandboxed: true
        });
    },

    async run(){
        const { exitCode } = await this.agent.run({
            interactive: true,
            systemPrompt({ playbooks, line }){
                line('You are an agent in a Cardoon session.');
                playbooks();
            }
        });
        process.exit(exitCode);
    }
};
