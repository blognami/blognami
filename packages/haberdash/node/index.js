
import { FileSystem } from '../lib/file_system.js';
import * as fs from 'node:fs/promises';

FileSystem.include({
    async readFile(path){ return fs.readFile(path, 'utf8'); },
    async readDir(path){ return fs.readdir(path); },
    async writeFile(path, data){ return fs.writeFile(path, data); },
    async mkdir(path, options = { recursive: true }){ return fs.mkdir(path, options); },
    async exists(path){ try { await fs.stat(path); return true; } catch { return false; } },
});
