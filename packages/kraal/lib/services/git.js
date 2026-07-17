
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

export default {
    create(){
        return {
            branch: this.defer(() => this.branch()),
            identity: this.defer(() => this.identity()),
            isWorktree: this.defer(() => this.isWorktree()),
            commonDir: this.defer(() => this.commonDir())
        };
    },

    async run(args, stdio = ['ignore', 'pipe', 'pipe']){
        const project = await this.project;
        return execFileSync('git', args, {
            cwd: project.rootPath,
            stdio
        }).toString().trim();
    },

    async branch(){
        return this.context.root.getOrCreate('gitBranch', async () => {
            try {
                return await this.run(['branch', '--show-current'], ['ignore', 'pipe', 'ignore']) || null;
            } catch {
                return null;
            }
        });
    },

    // The host's effective git identity for this repo (local config overrides
    // global). Passed into the sandbox so commits made there are authored as
    // the host user rather than the container's baked-in default.
    async identity(){
        return this.context.root.getOrCreate('gitIdentity', async () => {
            const read = async key => {
                try {
                    return await this.run(['config', '--get', key], ['ignore', 'pipe', 'ignore']) || null;
                } catch {
                    return null;
                }
            };
            return { name: await read('user.name'), email: await read('user.email') };
        });
    },

    // True iff the project root is a linked worktree: its git dir differs from
    // the repo's common git dir.
    async isWorktree(){
        return this.context.root.getOrCreate('gitIsWorktree', async () => {
            try {
                const project = await this.project;
                const gitDir = resolve(project.rootPath, await this.run(['rev-parse', '--git-dir'], ['ignore', 'pipe', 'ignore']));
                const commonDir = resolve(project.rootPath, await this.run(['rev-parse', '--git-common-dir'], ['ignore', 'pipe', 'ignore']));
                return gitDir !== commonDir;
            } catch {
                return false;
            }
        });
    },

    // The repo's common git dir as an absolute path (the primary checkout's
    // .git, even when invoked from a linked worktree).
    async commonDir(){
        return this.context.root.getOrCreate('gitCommonDir', async () => {
            try {
                const project = await this.project;
                return resolve(project.rootPath, await this.run(['rev-parse', '--git-common-dir'], ['ignore', 'pipe', 'ignore']));
            } catch {
                return null;
            }
        });
    }
};
