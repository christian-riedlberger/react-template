// @flow

import _ from 'lodash';
import { SHARED_API, SHARED_API_USERS } from 'constants/ServiceURI';
import {
    FETCH_SHARED,
    FETCH_SHARED_USERS,
    CLEAR_SHARED
} from 'constants/ActionTypes';

import { xhr } from './xhr';

export type Type = 'folder' | 'content';

/**
 * Fetch the shared data
 * @function fetchNode
 * @method GET
 * @param  {type} Type
 * @return {object} {type, payload}
 */
export function fetchShared(params: { type: Type, includeChildren: boolean }) {
    const type = _.get(params, 'type', 'folder');
    const includeChildren = _.get(params, 'includeChildren', false);

    const request = xhr.get(SHARED_API, {
        type,
        includeChildren
    });

    return {
        type: FETCH_SHARED,
        payload: request
    };
}

/**
 * Fetch the shared data
 * @function fetchNode
 * @method GET
 * @return {object} {payload}
 */
export function fetchSharedUsers() {
    const request = xhr.get(SHARED_API_USERS);

    return {
        type: FETCH_SHARED_USERS,
        payload: request
    };
}

export function clearShared() {
    return {
        type: CLEAR_SHARED
    };
}
