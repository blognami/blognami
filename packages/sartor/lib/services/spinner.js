
const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export default {
    create() {
        return { run: this.run.bind(this) };
    },

    async run(label, fn, opts = {}) {
        const successLabel = opts.success || label;
        const started = Date.now();

        if (process.stderr.isTTY) {
            let i = 0;
            const timer = setInterval(() => {
                process.stderr.write(`\r\x1b[2K${frames[i++ % frames.length]} ${label}`);
            }, 80);
            try {
                const result = await fn();
                const elapsed = ((Date.now() - started) / 1000).toFixed(1);
                clearInterval(timer);
                process.stderr.write(`\r\x1b[2K✓ ${successLabel} (${elapsed}s)\n`);
                return result;
            } catch (err) {
                clearInterval(timer);
                process.stderr.write(`\r\x1b[2K✗ ${label} failed\n`);
                throw err;
            }
        } else {
            process.stderr.write(`${label}…\n`);
            try {
                const result = await fn();
                const elapsed = ((Date.now() - started) / 1000).toFixed(1);
                process.stderr.write(`${successLabel} (${elapsed}s)\n`);
                return result;
            } catch (err) {
                process.stderr.write(`${label} failed\n`);
                throw err;
            }
        }
    }
};
