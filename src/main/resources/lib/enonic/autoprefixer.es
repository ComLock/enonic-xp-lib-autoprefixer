//import autoprefixer from './autoprefixer/standalone'; // standalone JS file adds autoprefixer object to window

import _autoprefixer from 'autoprefixer';
import postcss/*, { parse }*/ from 'postcss';
//import postcssJs, { objectify, sync } from 'postcss-js';

export const autoPrefixCss = (cssString) => postcss(_autoprefixer).process(cssString).css;

//export const autoPrefixCssInJs = sync([_autoprefixer]);
//export const cssStringToCssInJs = (cssString) => objectify(parse(cssString));

// Promise is not defined
/*export const cssInJsToCssString = (cssInJs) => postcss().process(cssInJs, { parser: postcssJs }).then( (result) => {
    result.css
})*/
//export const cssInJsToCssString = (cssInJs) => postcss().process(cssInJs, { parser: postcssJs }).css;
