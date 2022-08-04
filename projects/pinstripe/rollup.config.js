
import resolve from "rollup-plugin-node-resolve"

export default [
    {
        input: 'lib/index.js',
        output: {
            file: `build/pinstripe.js`,
            format: 'iife',
            name: 'Pinstripe',
            sourcemap: true
        },
        plugins: [ resolve() ]
    },

]
