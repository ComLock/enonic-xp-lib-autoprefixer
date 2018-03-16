/* global describe it */
import {deepStrictEqual} from 'assert';
import {concat} from '../src/main/resources/lib/enonic/autoprefixer/concat.es';

const TEST_STR = `multiline string with various
stuff<style whatever>
b
</style>all over the <style>c</style>place`;

const TEST_ARR = [
    'a string without style element',
    '<style>a</style>',
    TEST_STR,
    'another string without style element'
];

const EXPECTED_ARR = [
    'a string without style element',
    `multiline string with various
stuffall over the place`,
    'another string without style element',
    '<style type="text/css">a b c</style>'
];

const EXPECTED_STR = `multiline string with various
stuffall over the place
<style type="text/css">b c</style>`;

describe('concat', () => {
    it('array', () => {
        deepStrictEqual(concat(TEST_ARR), EXPECTED_ARR);
    });
    it('string', () => {
        deepStrictEqual(concat(TEST_STR), EXPECTED_STR);
    });
});
