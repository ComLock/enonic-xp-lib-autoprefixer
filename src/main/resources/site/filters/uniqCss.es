const currentTimeMillis = Java.type('java.lang.System').currentTimeMillis; // eslint-disable-line prefer-destructuring
let initStartTime = currentTimeMillis();

import {concat} from '/lib/enonic/autoprefixer/concat'; // eslint-disable-line import/first


function modifyRes(res) {
    Object.keys(res.pageContributions).forEach((groupKey) => {
        res.pageContributions[groupKey] = concat(res.pageContributions[groupKey]);
    });
}


export function responseFilter(req, res) {
    if (initStartTime) {
        log.info(`Filter uniqCss init took ${currentTimeMillis() - initStartTime}ms`);
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
