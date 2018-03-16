/*
 * Style elements may appear anywhere within a string.
 * We want to place style elements after link rel="preload".
 * We should return the same data type as received (string or array).

 So lets:
 * process each entry
 * cut any style element
 * paste it into a common one
 * that we add at the end
*/

const RE_PRE_STYLE_POST = /^([\s\S]*?)(<style[^>]*>[\s\S]+<\/style>)([\s\S]*)$/m;
const RE_EACH_STYLE = /([\s\S]*?)(<style[^>]*>)([\s\S]+?)(<\/style>)([\s\S]*?)/gm;

//const info = x => console.log(x); // eslint-disable-line no-console


function processStr({str, retArr, styleArr}) {
    let preStylePostMatch;
    if ((preStylePostMatch = RE_PRE_STYLE_POST.exec(str))) {
        //info(`preStylePostMatch:${JSON.stringify(preStylePostMatch, null, 4)}`);
        let matches;
        let surround = preStylePostMatch[1];
        while ((matches = RE_EACH_STYLE.exec(preStylePostMatch[2]))) {
            //info(`matches:${JSON.stringify(matches, null, 4)}`);
            styleArr.push(matches[3]);
            surround += `${matches[1]}${matches[5]}`;
        } // while
        //info(`styleArr:${JSON.stringify(styleArr, null, 4)}`);
        surround += preStylePostMatch[3];
        if (surround) { retArr.push(surround); }
        //info(`retArr:${JSON.stringify(retArr, null, 4)}`);
    } else { // if exec
        retArr.push(str);
    }
} // function processStr


export function concat(entry) {
    if (!entry) { return null; }
    const retArr = [];
    const styleArr = [];
    if (typeof entry === 'string') {
        processStr({str: entry, retArr, styleArr});
        if (styleArr) {
            retArr.push(`<style type="text/css">${styleArr.join(' ').replace(/\n/g, ' ').replace(/ +/g, ' ').trim()}</style>`);
        }
        const retStr = retArr.join('\n');
        //info(`retStr:${JSON.stringify(retStr, null, 4)}`);
        return retStr;
    }
    if (Array.isArray(entry)) {
        entry.forEach(str => processStr({str, retArr, styleArr}));
        if (styleArr) {
            retArr.push(`<style type="text/css">${styleArr.join(' ').replace(/\n/g, ' ').replace(/ +/g, ' ').trimRight()}</style>`);
        }
        //info(`retArr:${JSON.stringify(retArr, null, 4)}`);
        return retArr;
    } // if array
    throw new Error(`Entry not of type string or array! entry:${JSON.stringify(entry, null, 4)}`);
} // export function concat