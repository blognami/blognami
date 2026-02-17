import { spawn } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { createInterface } from 'node:readline';

if (process.env.DOCKER !== '1') {
    console.error('Error: Must be run in Docker. Use "npm run prompt [name]".');
    process.exit(1);
}

const promptsDir = 'prompts';

function listPrompts() {
    return readdirSync(promptsDir)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace(/\.md$/, ''));
}

function loadPrompt(name) {
    return readFileSync(`${promptsDir}/${name}.md`, 'utf8').trim();
}

async function pickPrompt(names) {
    console.log('Available prompts:\n');
    names.forEach((name, i) => console.log(`  ${i + 1}) ${name}`));
    console.log();

    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question('Pick a prompt: ', (answer) => {
            rl.close();
            const idx = parseInt(answer, 10) - 1;
            if (idx >= 0 && idx < names.length) {
                resolve(names[idx]);
            } else {
                console.error('Invalid selection.');
                process.exit(1);
            }
        });
    });
}

async function main() {
    const names = listPrompts();
    if (names.length === 0) {
        console.error('No prompts found in prompts/');
        process.exit(1);
    }

    let name = process.argv[2];
    if (!name) {
        name = await pickPrompt(names);
    }

    if (!names.includes(name)) {
        console.error(`Unknown prompt: ${name}`);
        console.error(`Available: ${names.join(', ')}`);
        process.exit(1);
    }

    const content = loadPrompt(name);
    console.log(`\nRunning prompt: ${name}\n`);

    const child = spawn('claude', [
        '--permission-mode', 'bypassPermissions',
        content,
    ], { stdio: 'inherit' });

    child.on('close', (code) => {
        process.exit(code ?? 1);
    });
}

main();
