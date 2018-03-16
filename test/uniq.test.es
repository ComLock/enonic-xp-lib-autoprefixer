/* global describe it */
import {deepStrictEqual} from 'assert';
import {uniqCss} from '../src/main/resources/lib/enonic/autoprefixer/concat.es';

const D_B = '.d-b{display:block}';
const M_D_B = '@media(min-width:480px){.d-b-w-mi-480{display:block}}';

const TEST_STR = ` ${M_D_B}
 ${D_B}
  ${D_B}
   ${M_D_B} `;

const EXPECTED_STR = `${D_B}
${M_D_B}`;

describe('uniqCss', () => {
    it('trims, removes duplicate lines, media last', () => {
        deepStrictEqual(uniqCss(TEST_STR), EXPECTED_STR);
    });
});
