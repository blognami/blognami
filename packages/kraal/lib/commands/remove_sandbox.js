export default {
    meta(){
        this.assignProps({
            description: 'Removes the sandbox container. With --branch, also removes the branch\'s worktree (the git branch is kept). The built image is left in place (use docker rmi to remove it).'
        });
    },

    async run(){
        await this.sandbox.remove();
    }
};
