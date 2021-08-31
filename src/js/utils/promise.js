// @flow

import _ from 'lodash';

export const serializePromises = (
    funcs: Array<() => Promise<any>>
): Promise<Array<any>> =>
    // eslint-disable-next-line compat/compat
    new Promise((resolve, reject) => {
        const results = [];
        let prom;

        // iterate through all given func calls and chain them onto single promise
        _.forEach(funcs, (f, index) => {
            if (prom) {
                prom = prom.then(resp => {
                    results.push(resp);

                    // if last promise
                    if (index === funcs.lenth - 1) {
                        return f().then(final => {
                            results.push(final);
                            return f();
                        });
                    }
                    return f();
                });
            } else {
                prom = f().then(resp => {
                    results.push(resp);
                    return f();
                });
            }
        });

        // resolve final result when all promises have returned
        // eslint-disable-next-line promise/always-return
        prom.then(() => {
            resolve(results);
        }).catch(reject);
    });

export default { serializePromises };
