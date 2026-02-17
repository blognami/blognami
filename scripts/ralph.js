import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

// Validate prd.json
function validatePrd() {
    let prd;
    try {
        prd = JSON.parse(readFileSync('prd.json', 'utf8'));
    } catch (e) {
        console.error('Error: prd.json is not valid JSON.');
        process.exit(1);
    }

    if (!Array.isArray(prd)) {
        console.error('Error: prd.json must be a JSON array.');
        process.exit(1);
    }

    for (let i = 0; i < prd.length; i++) {
        const item = prd[i];
        if (typeof item.category !== 'string') {
            console.error(`Error: prd.json[${i}].category must be a string.`);
            process.exit(1);
        }
        if (typeof item.description !== 'string') {
            console.error(`Error: prd.json[${i}].description must be a string.`);
            process.exit(1);
        }
        if (!Array.isArray(item.steps) || !item.steps.every(s => typeof s === 'string')) {
            console.error(`Error: prd.json[${i}].steps must be an array of strings.`);
            process.exit(1);
        }
        if (typeof item.passes !== 'boolean') {
            console.error(`Error: prd.json[${i}].passes must be a boolean.`);
            process.exit(1);
        }
    }

    return prd;
}

validatePrd();

if (process.env.DOCKER !== '1') {
    console.error('Error: Ralph must be run in Docker. Use "npm run claude-sandbox -- node scripts/ralph.js".');
    process.exit(1);
}

const maxIterations = parseInt(process.env.RALPH_ITERATIONS || process.argv[2] || '10', 10);

const prompt = `Read prd.json and progress.md.
Find the next task where "passes" is false.
Implement it.
Run "npm run test:quick" and fix any failures. If a test fails, consult progress.md for prior attempts and insights before debugging.
Mark the task as passes: true in prd.json.
Append a detailed entry to progress.md documenting what you did. Use this format:

\`\`\`
---  (only if progress.md already has content)

## Task: <description>

### Changes
- \`path/to/file.js\`: <what changed and why>
- Include brief code snippets or before/after diffs for non-trivial changes

### Testing
- What tests passed/failed and any fixes applied

### Notes
- Gotchas, lessons learned, or context for future iterations

\`\`\`

Commit your changes with conventional commit format. Do NOT add Co-Authored-By or any Claude/AI reference.
ONLY DO ONE TASK AT A TIME.
If all tasks pass, run "npm run test" (the full test suite). If full tests pass, output <promise>COMPLETE</promise>. If they fail, fix the failures and re-run until they pass.`;

async function runIteration(i) {
    console.log(`\n--- Iteration ${i + 1}/${maxIterations} ---\n`);

    return new Promise((resolve) => {
        const child = spawn('claude', [
            '--permission-mode', 'bypassPermissions',
            '--print', '--verbose', '--output-format', 'stream-json', '-p', prompt,
        ], {
            stdio: ['ignore', 'pipe', 'inherit'],
        });

        const rl = createInterface({ input: child.stdout });
        let complete = false;

        // Track tool names for correlating results
        const pendingTools = new Map();

        rl.on('line', (line) => {
            try {
                const msg = JSON.parse(line);
                // Extract text and tool calls from assistant messages
                if (msg.type === 'assistant' && msg.message?.content) {
                    for (const block of msg.message.content) {
                        if (block.type === 'text') {
                            process.stdout.write(block.text + '\n');
                        } else if (block.type === 'tool_use') {
                            pendingTools.set(block.id, block.name);
                            let toolLine = `→ ${block.name}`;
                            // Add context for file operations
                            if (block.input?.file_path) {
                                toolLine += ` ${block.input.file_path}`;
                            } else if (block.input?.pattern) {
                                toolLine += ` ${block.input.pattern}`;
                            } else if (block.input?.command) {
                                const cmd = block.input.command;
                                toolLine += ` ${cmd.length > 60 ? cmd.slice(0, 60) + '...' : cmd}`;
                            }
                            process.stdout.write(toolLine + '\n');
                        }
                    }
                }
                // Handle tool results from user messages
                if (msg.type === 'user' && msg.message?.content) {
                    for (const block of msg.message.content) {
                        if (block.type === 'tool_result') {
                            const toolName = pendingTools.get(block.tool_use_id) || 'tool';
                            pendingTools.delete(block.tool_use_id);
                            process.stdout.write(`✓ ${toolName}\n`);
                        }
                    }
                }
                if (msg.type === 'result' && msg.result) {
                    if (msg.result.includes('<promise>COMPLETE</promise>')) {
                        complete = true;
                    }
                }
            } catch {
                // skip non-JSON lines
            }
        });

        child.on('close', () => {
            resolve(complete);
        });
    });
}

async function main() {
    for (let i = 0; i < maxIterations; i++) {
        const complete = await runIteration(i);
        if (complete) {
            console.log('\n\nAll tasks complete!');
            return;
        }
    }
    console.log(`\n\nReached max iterations (${maxIterations}).`);
}

main();
