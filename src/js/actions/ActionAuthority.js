// @flow
import { AUTHORITY_API, AUTHORITY_LOOKUP_API } from 'constants/ServiceURI';
import { FETCH_AUTHORITY, CLEAR_AUTHORITY } from 'constants/ActionTypes';
import { xhr } from './xhr';

/**
 * Find authority
 * @method GET
 * @param nodeRef:string
 * @return {{type, payload}}
 */
export function fetchAuthority(name: string, type?: string) {
    const config = {
        filter: name,
        type: type || null
    };

    if (type && type === 'user') {
        config.filter = `${name}*`;
    }

    const request = xhr.get(AUTHORITY_API, config);

    return {
        type: FETCH_AUTHORITY,
        payload: request
    };
}

export function lookupAuthority(nodeRef: string) {
    return xhr.get(AUTHORITY_LOOKUP_API, { nodeRef });
}

export function clearAuthority() {
    return {
        type: CLEAR_AUTHORITY,
        payload: true
    };
}
