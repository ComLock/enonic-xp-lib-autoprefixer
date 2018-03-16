const currentTimeMillis = Java.type('java.lang.System').currentTimeMillis; // eslint-disable-line prefer-destructuring
let initStartTime = currentTimeMillis();

import { // eslint-disable-line import/first
    autoPrefixCss/*,
    autoPrefixCssInJs,
    cssInJsToCssString,
    cssStringToCssInJs*/
} from '/lib/enonic/autoprefixer.js'; // Webpack external


const RE_PRE_STYLE_POST = /^([\s\S]*?)(<style[^>]*>[\s\S]+<\/style>)([\s\S]*)$/m;
const RE_EACH_STYLE = /([\s\S]*?)(<style[^>]*>)([\s\S]+?)(<\/style>)([\s\S]*?)/gm;


function modifyRes(res) {
    Object.keys(res.pageContributions).forEach((groupKey) => {
        if (Array.isArray(res.pageContributions[groupKey])) {
            res.pageContributions[groupKey].join('\n');
        }
        if (typeof res.pageContributions[groupKey] !== 'string') {
            log.warning(`pageContributions.${groupKey} not array or string! ${JSON.stringify(res.pageContributions[groupKey], null, 4)}`);
        } else {
            // Look for css to autoprefix
            //log.info(`${groupKey}:${JSON.stringify(res.pageContributions[groupKey], null, 4)}`);
            let preStylePostMatch;
            if ((preStylePostMatch = RE_PRE_STYLE_POST.exec(res.pageContributions[groupKey]))) {
                let str = preStylePostMatch[1]; // pre
                let matches;
                while ((matches = RE_EACH_STYLE.exec(preStylePostMatch[2]))) { // style
                    //log.info(`css:${JSON.stringify(matches[3], null, 4)}`);

                    const cssString = autoPrefixCss(matches[3]);

                    /*const cssInJs = cssStringToCssInJs(matches[3]);
                    log.info(`cssInJs:${JSON.stringify(cssInJs, null, 4)}`);

                    const autoPrefixedCssInJs = autoPrefixCssInJs(cssInJs);
                    log.info(`autoPrefixedCssInJs:${JSON.stringify(autoPrefixedCssInJs, null, 4)}`);

                    const cssString = cssInJsToCssString(autoPrefixedCssInJs);*/
                    //log.info(`cssString:${JSON.stringify(cssString, null, 4)}`);

                    //const {css} = autoprefixer.compile(matches[3]);
                    //log.info(`prefixedCss:${JSON.stringify(css, null, 4)}`);
                    str += `${matches[1]}${matches[2]}${cssString}${matches[4]}${matches[5]}`;
                }
                res.pageContributions[groupKey] = str + preStylePostMatch[3]; // post
            }
        }
    }); // forEach group
}


export function responseFilter(req, res) {
    if (initStartTime) {
        log.info(`Filter autoprefixer init took ${currentTimeMillis() - initStartTime}ms`);
        initStartTime = null; // Only show on first run.
    }
    //log.info(`res.pageContributions:${JSON.stringify(res.pageContributions, null, 4)}`);
    if (!res.pageContributions) { return res; }
    if (req.params.profiling) {
        const startTime = currentTimeMillis();
        modifyRes(res);
        const endTime = currentTimeMillis();
        log.info(`Filter autoprefixer took ${endTime - startTime}ms`);
    } else {
        modifyRes(res);
    }
    return res;
} // export function responseFilter
