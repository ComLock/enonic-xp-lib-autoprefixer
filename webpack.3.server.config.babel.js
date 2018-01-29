/* eslint-disable no-console */
/* Important note:
 * https://github.com/webpack/webpack/issues/1518
 * You must not use the CommonsChunkPlugin for node.js.
 * The CommonsChunkPlugin is a web optimization (better caching).
 * It makes no sense for node.js. As such it make no sense for Enonic XP either.
 */

//──────────────────────────────────────────────────────────────────────────────
// Imports
//──────────────────────────────────────────────────────────────────────────────
//import glob from 'glob';
import path from 'path';
import PolyfillsPlugin from 'webpack-polyfills-plugin';


//──────────────────────────────────────────────────────────────────────────────
// Functions
//──────────────────────────────────────────────────────────────────────────────
//const toStr = v => JSON.stringify(v, null, 4);
//const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));


//──────────────────────────────────────────────────────────────────────────────
// Constants
//──────────────────────────────────────────────────────────────────────────────
//const EXTENSIONS_GLOB = '{es,js}';
const SRC_DIR = 'src/main/resources';
const SRC_DIR_ABS = path.resolve(__dirname, SRC_DIR);

const DST_DIR = 'build/resources/main';
const DST_DIR_ABS = path.join(__dirname, DST_DIR);

//const ASSETS_GLOB = `${SRC_DIR}/{site/assets,assets}/**/*.${EXTENSIONS_GLOB}`;
//console.log(`ASSETS_GLOB:${JSON.stringify(ASSETS_GLOB, null, 4)}`);
//console.log(`ASSET_FILES:${JSON.stringify(glob.sync(ASSETS_GLOB), null, 4)}`);

//const FILES = glob.sync(`${SRC_DIR}/**/*.${EXTENSIONS_GLOB}`, {ignore: ASSETS_GLOB});
//console.log(`FILES:${toStr(FILES)}`);

/*const entry = dict(FILES.map(k => [
    k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
    `.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
]));
console.log(`WEBPACK_CONFIG:${JSON.stringify(entry, null, 4)}`); process.exit();
*/

//──────────────────────────────────────────────────────────────────────────────
// Common settings
//──────────────────────────────────────────────────────────────────────────────
const context = SRC_DIR_ABS;
const devtool = false; // Don't waste time generating sourceMaps
const module = {
    rules: [{
        test: /\.(es6?|js)$/, // Will need js for node module depenencies
        use: [{
            loader: 'babel-loader',
            options: {
                babelrc: false, // The .babelrc file should only be used to transpile config files.
                comments: false,
                compact: false,
                minified: false,
                plugins: [
                    /*'array-includes',
                    'optimize-starts-with',*/
                    'transform-object-assign', // Needed somewhere :)
                    //'transform-object-rest-spread'
                ],
                presets: [
                    ['es2015'/*, {
                        include: [
                            'transform-es2015-computed-properties' // Needed by autoprefixer or postcss or some dependency
                        ]
                    }*/]
                ]
            } // options
        }] // use
    }] // rules
};
const output = {
    path: DST_DIR_ABS,
    filename: '[name].js',
    libraryTarget: 'commonjs'
};
const stats = {
    colors: true,
    hash: false,
    maxModules: 0,
    modules: false,
    moduleTrace: false,
    timings: false,
    version: false
};

//──────────────────────────────────────────────────────────────────────────────
// Exports
//──────────────────────────────────────────────────────────────────────────────
const WEBPACK_CONFIG = [
    { // 1. First the lib with autoprefixer and postcss-js included.
        context,
        devtool,
        entry: {
            'lib/enonic/autoprefixer': './lib/enonic/autoprefixer.es'
        },
        module,
        node: {
            console: true // Needed by autoprefixer or postcss or some dependency
        },
        output,
        plugins: [
            new PolyfillsPlugin([ // Polyfills are not chunked. (Which means webpackJsonp is used before it is defined, chunking not designed for server-side)
                //'Array/prototype/includes', // Needed by autoprefixer or postcss or some dependency
                'Math/log2', // Needed by autoprefixer or postcss (or some dependency)
                'Math/sign' // Needed by autoprefixer or postcss (or some dependency)
            ])
        ],
        stats
    }, { // 2. Then the filter with lib as external
        context,
        devtool,
        entry: {
            'site/filters/autoprefixer': './site/filters/autoprefixer.es'
        },
        externals: [
            /^\/lib\/enonic\/autoprefixer.js$/
        ],
        module,
        output,
        /*resolve: {
            alias: {
                '/lib': path.resolve(__dirname, SRC_DIR, 'lib')
            },
            extensions: ['.es', '.js', '.json']
        }, // resolve*/
        stats
    }
];

//console.log(`WEBPACK_CONFIG:${JSON.stringify(WEBPACK_CONFIG, null, 4)}`);
//process.exit();

export { WEBPACK_CONFIG as default };
