// @flow
import { REPO_API } from 'constants/ServiceURI';
import type { Action } from 'types/actionTypes';
import type { Node } from 'types/repoTypes';
import { xhr } from './xhr';

/**
 * Fetch a folder and it's children
 * @function fetchNode
 * @method GET
 * @param  {object} node {nodeRef, nodeName}
 * @return {object} {type, payload}
 */
export function fetchFolder(node: Node): Action {
    const request = xhr.get(REPO_API, node);

    return {
        type: 'FETCH_PICKER_FOLDER',
        payload: request
    };
}

/**
 * Add item to selected in picker
 * @function addItem
 * @param  {string} nodeRef
 */
export function addItem(node: Node): Action {
    return {
        type: 'ADD_PICKER_ITEM',
        node
    };
}

/**
 * Remove item selected in picker
 * @function addItem
 * @param  {string} nodeRef
 */
export function removeItem(nodeRef: string): Action {
    return {
        type: 'REMOVE_PICKER_ITEM',
        nodeRef
    };
}

/**
 * Clear active folder
 * @function clearActiveFolder
 * @return {type} {description}
 */
export function clearPicker(): Action {
    return {
        type: 'CLEAR_PICKER_ACTIVE',
        payload: true
    };
}
