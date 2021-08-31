// @flow
import _ from 'lodash';

/**
 * Get repo paths from url
 */
export const getHashPaths = (): Array<string> =>
    _.isEmpty(window.location.hash)
        ? []
        : _.compact(
            decodeURIComponent(window.location.hash)
                .replace('#', '')
                .split('/')
        );

/**
 * Create url from array
 */
export const createHashPath = (hashes: Array<string>) => {
    const { pathname } = window.location;
    return `${pathname}#/${_.join(hashes, '/')}`;
};

export default { getHashPaths, createHashPath };
