/* global describe it */
/* eslint-disable no-console */
import {deepStrictEqual} from 'assert';


describe('pageContributions', () => {
    it('style regexp', () => {
        const headBegin = `
<before/>
<style>
    a
</style>
<between/>
<style>
    b
</style>
<after/>`;
        //console.log(JSON.stringify(headBegin, null, 4));
        const preStylePost = /^([\s\S]*?)(<style[^>]*>[\s\S]+<\/style>)([\s\S]*)$/m;
        const anyMatch = preStylePost.exec(headBegin);
        //console.log(JSON.stringify(anyMatch, null, 4));
        const preMatch = anyMatch[1];
        const styleMatch = anyMatch[2];
        const postMatch = anyMatch[3];
        const regexp = /([\s\S]*?)(<style[^>]*>)([\s\S]+?)(<\/style>)([\s\S]*?)/gm;

        let matches;
        let str = preMatch;
        while ((matches = regexp.exec(styleMatch))) {
            //console.log(JSON.stringify(matches, null, 4));
            str += `${matches[1]}${matches[2]}changed${matches[4]}${matches[5]}`;
        }
        str += postMatch;

        //console.log(JSON.stringify(str, null, 4));
        deepStrictEqual(`
<before/>
<style>changed</style>
<between/>
<style>changed</style>
<after/>`, str);
    });
});
