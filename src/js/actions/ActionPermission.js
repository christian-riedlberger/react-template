/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
// @flow
import { PERMISSION_GET_API, PERMISSION_API } from 'constants/ServiceURI';
import { FETCH_PERMISSION, UPDATE_PERMISSION } from 'constants/ActionTypes';
import type { PermissionLevels } from 'types/permissionTypes';
import { xhr } from './xhr';

/**
 * Get a single Permission from our state
 * @method GET
 * @param nodeRef:string
 * @return {{type, payload}}
 */
export function fetchPermission(nodeRef: string) {
    const request = xhr.get(
        PERMISSION_GET_API.replace('NODEREF', nodeRef.replace('://', '/'))
    );
    return {
        type: FETCH_PERMISSION,
        payload: request,
        meta: { nodeRef }
    };
}

/**
 * Update a Permission metadata
 * @method PUT
 * @param permission:{} Permission properties
 * @return {{type, payload}}
 */
export function updatePermission(permission: PermissionLevels) {
    //  Request
    const request = xhr.put(PERMISSION_API, permission);

    return {
        type: UPDATE_PERMISSION,
        payload: request
    };
}
