
import * as lodash from 'lodash';
(window as any)._ = lodash;
declare global {
    const _: typeof lodash;
}
