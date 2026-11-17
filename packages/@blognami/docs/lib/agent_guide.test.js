import test from 'node:test';
import assert from 'node:assert';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const docsDir = join(packageRoot, 'lib', 'views', '--docs', 'docs');

function findPages(dir){
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const path = join(dir, entry.name);
        if(entry.isDirectory()) return findPages(path);
        return entry.name.endsWith('.md') ? [relative(packageRoot, path).split(sep).join('/')] : [];
    });
}

function isFileInPackage(target){
    if(/^[a-z][a-z0-9+.-]*:/i.test(target) || isAbsolute(target)) return false;
    const path = resolve(packageRoot, target);
    if(relative(packageRoot, path).startsWith('..')) return false;
    return existsSync(path) && statSync(path).isFile();
}

function checkGuide(guide){
    const targets = [...guide.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map(match => match[1]);
    const linked = new Set(targets.map(target => relative(packageRoot, resolve(packageRoot, target)).split(sep).join('/')));
    return {
        brokenLinks: targets.filter(target => !isFileInPackage(target)),
        unlistedPages: findPages(docsDir).filter(page => !linked.has(page))
    };
}

const realGuide = readFileSync(join(packageRoot, 'AGENT_GUIDE.md'), 'utf8');

test('AGENT_GUIDE.md has no broken link and no unlisted docs page', () => {
    const { brokenLinks, unlistedPages } = checkGuide(realGuide);
    assert.deepStrictEqual(brokenLinks, [], `broken links in AGENT_GUIDE.md: ${brokenLinks.join(', ')}`);
    assert.deepStrictEqual(unlistedPages, [], `docs pages not linked from AGENT_GUIDE.md: ${unlistedPages.join(', ')}`);
});

test('checkGuide reports a link to a missing file, an http link and a path leaving the package', () => {
    const broken = [
        'lib/views/--docs/docs/commands/no-such-command.md',
        'https://blognami.com/docs',
        '../markdown/package.json'
    ];
    const guide = realGuide + broken.map(target => `\n- [broken](${target})`).join('');
    const { brokenLinks, unlistedPages } = checkGuide(guide);
    assert.deepStrictEqual(brokenLinks, broken, `broken links reported: ${brokenLinks.join(', ')}`);
    assert.deepStrictEqual(unlistedPages, [], `unexpected unlisted pages: ${unlistedPages.join(', ')}`);
});

test('checkGuide reports a docs page the guide omits', () => {
    const page = 'lib/views/--docs/docs/services/trapify.md';
    const guide = realGuide.split('\n').filter(line => !line.includes(`(${page})`)).join('\n');
    const { brokenLinks, unlistedPages } = checkGuide(guide);
    assert.deepStrictEqual(unlistedPages, [page], `unlisted pages reported: ${unlistedPages.join(', ')}`);
    assert.deepStrictEqual(brokenLinks, [], `unexpected broken links: ${brokenLinks.join(', ')}`);
});
