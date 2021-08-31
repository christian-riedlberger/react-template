// @flow
import { SEARCH_API } from 'constants/ServiceURI';
import { FETCH_SEARCH, CLEAR_SEARCH } from 'constants/ActionTypes';

import type { Action } from 'types/actionTypes';
import { xhr } from './xhr';

/**
 * Global Search
 * @function fetchNode
 * @method GET
 * @param  {object} params {term}
 * @return {object} {type, payload}
 */
export function fetchSearch(params: Object) {

    const lds = localStorage.getItem('auth:lds');

    const term =
        params.term && params.term.length === 3
            ? `${params.term} `
            : params.term;


    const request = xhr.post(SEARCH_API, {
        ...params,
        lds,
        term,
        activeOrg: localStorage.getItem('org:active'),
        userName: localStorage.getItem('auth:username')
    });

    return {
        type: FETCH_SEARCH,
        payload: request
    };
}

export function clearActiveSearch(): Action {
    // $FlowFixMe
    return {
        type: CLEAR_SEARCH,
        payload: {}
    };
}
