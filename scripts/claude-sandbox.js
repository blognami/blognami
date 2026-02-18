import { execSync, spawn } from 'node:child_process';
import { cwd } from 'node:process';

const args = process.argv.slice(2);
const separatorIndex = args.indexOf('--');
const dockerFlags = separatorIndex === -1 ? args : args.slice(0, separatorIndex);
const command = separatorIndex === -1 ? [] : args.slice(separatorIndex + 1);

// Default to interactive TTY when using the container's default CMD (interactive claude)
if (command.length === 0 && !dockerFlags.includes('-it')) {
    dockerFlags.push('-it');
}

execSync('npm run --silent claude-sandbox:build', { stdio: 'inherit' });

const child = spawn('docker', [
    'run', '--rm', '--shm-size=1g',
    '-v', `${cwd()}:/app`,
    '-v', 'blognami-claude-sandbox-nm:/app/node_modules',
    '-e', 'CLAUDE_CODE_OAUTH_TOKEN',
    '-e', 'ANTHROPIC_API_KEY',
    '-e', 'STRIPE_API_KEY',
    '-e', 'DOCKER=1',
    ...dockerFlags,
    'blognami-claude-sandbox',
    ...command
], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code ?? 1);
});
