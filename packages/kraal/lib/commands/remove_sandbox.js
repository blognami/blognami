export default {
    meta(){
        this.assignProps({
            description: 'Removes the sandbox container and its named volumes only — it never touches the worktree or the git branch. The built image is left in place (use docker rmi to remove it).'
        });
    },

    async run(){
        await this.sandbox.remove();
    }
};
