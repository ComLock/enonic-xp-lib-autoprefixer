import autoprefixer from '/lib/autoprefixer.es';


const RE_PRE_STYLE_POST = /^([\s\S]*?)(<style[^>]*>[\s\S]+<\/style>)([\s\S]*)$/m;
const RE_EACH_STYLE = /([\s\S]*?)(<style[^>]*>)([\s\S]+?)(<\/style>)([\s\S]*?)/gm;


export function responseFilter(req, res) {
    if (!res.pageContributions) { return res; }
    Object.keys(res.pageContributions).forEach((groupKey) => {
        if (Array.isArray(res.pageContributions[groupKey])) {
            res.pageContributions[groupKey].join('\n');
        }
        if (typeof res.pageContributions[groupKey] !== 'string') {
            log.warning(`pageContributions.${groupKey} not array or string! ${JSON.stringify(res.pageContributions[groupKey], null, 4)}`);
        } else {
            // Look for css to autoprefix
            res.pageContributions[groupKey] = res.pageContributions[groupKey].map((item) => {
                let preStylePostMatch;
                if ((preStylePostMatch = RE_PRE_STYLE_POST.exec(item))) {
                    let str = preStylePostMatch[1]; // pre
                    let matches;
                    while ((matches = RE_EACH_STYLE.exec(preStylePostMatch[2]))) { // style
                        log.info(`css:${JSON.stringify(matches[3], null, 4)}`);
                        const css = autoprefixer(matches[3]);
                        log.info(`prefixedCss:${JSON.stringify(css, null, 4)}`);
                        str += `${matches[1]}${matches[2]}${css}${matches[4]}${matches[5]}`;
                    }
                    str += preStylePostMatch[3]; // post
                    return str;
                }
                return item;
            });
        }
    });
    return res;
} // export function responseFilter
