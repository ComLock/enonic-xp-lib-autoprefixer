import _autoprefixer from 'autoprefixer';
import { sync } from 'postcss-js';


export const autoprefixer = sync([_autoprefixer]);
export default autoprefixer;
