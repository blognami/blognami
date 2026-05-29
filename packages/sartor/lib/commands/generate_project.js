
import path from 'path';
import { spawnSync } from 'child_process';
import chalk from 'chalk';
import { FileSystem } from 'haberdash';

export default {
    meta(){
        this.assignProps({
            description: 'Generates a new .sartor/ directory for the current project.'
        });
    },

    async run(){
        const target = path.join(process.cwd(), '.sartor');

        if(await FileSystem.instance.exists(target)){
            console.log(chalk.red('.sartor/ already exists — remove it or run in a clean directory'));
            process.exit(1);
        }

        const slug = path.basename(process.cwd());

        const { generateDir, generateFile } = this.fsBuilder;

        await generateDir('.sartor', async () => {
            await generateFile('package.json', ({ echo }) => {
                echo(JSON.stringify({ name: `${slug}-sartor`, private: true, type: 'module', exports: { '.': './lib/index.js' } }, null, 2));
            });

            await generateFile('config.js', ({ line, indent }) => {
                line('export default {');
                indent(({ line, indent }) => {
                    line('sandbox: {');
                    indent(({ line, indent }) => {
                        line(`provider: 'docker',`);
                        line(`name: '${slug}-sartor-sandbox',`);
                        line('env: {');
                        indent(({ line }) => {
                            line('CLAUDE_CODE_OAUTH_TOKEN: process.env.CLAUDE_CODE_OAUTH_TOKEN');
                        });
                        line('}');
                    });
                    line('},');
                    line('agent: {');
                    indent(({ line }) => {
                        line(`provider: 'claude'`);
                    });
                    line('}');
                });
                line('};');
            });

            await generateFile('.gitignore', ({ echo }) => {
                echo('sessions/\n');
            });

            await generateFile('.dockerignore', ({ line }) => {
                line('node_modules');
                line('.git');
                line('test-results');
                line('*.db');
            });

            await generateFile('Dockerfile.sandbox', ({ line, indent }) => {
                line('FROM node:22-bookworm');
                line();
                line('# Install Claude CLI globally');
                line('RUN npm install -g @anthropic-ai/claude-code');
                line();
                line('# Managed settings (highest precedence, cannot be overridden by Claude CLI)');
                line('RUN mkdir -p /etc/claude-code && \\');
                indent(({ line }) => {
                    line('echo \'{"skipDangerousModePermissionPrompt": true}\' > /etc/claude-code/managed-settings.json');
                });
                line();
                line('# Create non-root user (Claude CLI refuses bypassPermissions as root)');
                line('RUN useradd -m -s /bin/bash sartor');
                line();
                line('WORKDIR /app');
                line();
                line('# Pre-create node_modules owned by sartor so the named volume inherits ownership');
                line('RUN mkdir -p node_modules && chown sartor:sartor node_modules');
                line();
                line('USER sartor');
                line();
                line('ARG GIT_USER_NAME="Sartor (Docker)"');
                line('ARG GIT_USER_EMAIL="sartor@localhost"');
                line('RUN git config --global user.name "$GIT_USER_NAME" && \\');
                indent(({ line }) => {
                    line('git config --global user.email "$GIT_USER_EMAIL"');
                });
                line();
                line('# Skip onboarding and bypass-permissions prompts (required for headless use)');
                line('RUN echo \'{"hasCompletedOnboarding": true, "bypassPermissionsModeAccepted": true, "effortCalloutDismissed": true, "projects": {"/app": {"hasTrustDialogAccepted": true, "hasCompletedProjectOnboarding": true}}}\' > /home/sartor/.claude.json');
                line();
                line('CMD ["sh", "-c", "if [ ! -f node_modules/.package-lock.json ]; then npm install; fi && tail -f /dev/null"]');
                line();
            });

            await generateFile('README.md', ({ line }) => {
                line('# .sartor');
                line();
                line('Sartor sandbox configuration for this project. This directory defines the');
                line('Docker environment and workflows that Claude Code agents use to work on');
                line('your codebase in isolation.');
                line();
                line('## Building the sandbox image');
                line();
                line('```bash');
                line('docker build -f .sartor/Dockerfile.sandbox -t <image-name> .sartor');
                line('```');
                line();
                line('## Workflows');
                line();
                line('List available workflows:');
                line();
                line('```bash');
                line('npx sartor');
                line('```');
                line();
                line('Run a specific workflow:');
                line();
                line('```bash');
                line('npx sartor <workflow-name>');
                line('```');
                line();
                line('## Documentation');
                line();
                line('For more information, see the [Sartor docs](https://github.com/blognami/blognami/tree/main/packages/sartor).');
            });

            await generateFile('lib/index.js', ({ echo }) => {
                echo('\nimport { importAll } from \'sartor\';\n\nimportAll(import.meta.url);\n');
            });
        });

        spawnSync('npm', ['install', 'sartor'], {
            cwd: path.join(process.cwd(), '.sartor'),
            stdio: 'inherit'
        });
    }
};
