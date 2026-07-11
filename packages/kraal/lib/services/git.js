
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, isAbsolute } from 'node:path';

export const WORKTREES_DIR = 'node_modules/.kraal/worktrees';

export default {
    create(){
        return {
            branch: this.defer(() => this.branch()),
            identity: this.defer(() => this.identity()),
            ...this.bindProps(['ensureWorktree', 'removeWorktree'])
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

    // Resolves to nothing unless a branch other than the checked-out one is
    // requested — that's what keeps every worktree/branch path a no-op in the
    // default case.
    async target(branch){
        if(!branch || branch === await this.branch()) return null;
        const project = await this.project;
        await this.run(['check-ref-format', '--branch', branch]);
        return join(project.rootPath, WORKTREES_DIR, branch);
    },

    async ensureWorktree(branch){
        const path = await this.target(branch);
        if(!path) return null;
        const dotGit = join(path, '.git');
        if(!existsSync(dotGit)){
            // Drop stale registrations (e.g. after a host npm ci wiped
            // node_modules) so the same path can be re-added.
            await this.run(['worktree', 'prune']);
            let branchExists = true;
            try {
                await this.run(['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`]);
            } catch {
                branchExists = false;
            }
            await this.run(branchExists ? ['worktree', 'add', path, branch] : ['worktree', 'add', '-b', branch, path]);
            // Rewrite the worktree's gitdir pointer to a relative path so it
            // resolves both on the host and under the /app bind mount in the
            // sandbox container.
            const gitdir = readFileSync(dotGit, 'utf8').replace(/^gitdir:\s*/, '').trim();
            if(isAbsolute(gitdir)) writeFileSync(dotGit, `gitdir: ${relative(path, gitdir)}\n`);
        }
        return path;
    },

    async removeWorktree(branch){
        const path = await this.target(branch);
        if(!path) return;
        if(existsSync(path)) await this.run(['worktree', 'remove', '--force', path]);
        await this.run(['worktree', 'prune']);
    }
};
