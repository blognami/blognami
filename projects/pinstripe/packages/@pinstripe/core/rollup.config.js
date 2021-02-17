
export default [
    {
        input: 'lib/client/index.js',
        output: {
            file: `lib/static/javascripts/pinstripe.js`,
            format: 'iife',
            name: 'Pinstripe',
            sourcemap: true
        }
    }
]
