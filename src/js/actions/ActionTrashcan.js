/* eslint-disable compat/compat */
// @flow
import type { ThunkAction } from 'types/actionTypes';
import {
    ALFRESCO_SERVICE_URI,
    API_URL_CONFIGURATION
} from 'constants/ServiceURI';
import { SHOW_MESSAGE, HIDE_MESSAGE } from 'constants/ActionTypes';
import _ from 'lodash';
import axios from 'axios';
import { xhr } from './xhr';
import { dispatchWithMessage } from './dispatchWithMessage';

const ARCHIVE_API = `${ALFRESCO_SERVICE_URI}/archive/workspace/SpacesStore`;
const checkLoggenIn = (repository, dispatch) => {
    if (!repository.isLoggedIn()) {
        dispatch({
            type: 'LOGGED_IN',
            payload: { isLoggedIn: false, message: '' }
        });
        return false;
    }
    return true;
};
export function toggleNode(nodeRef: string, isSelected: boolean) {
    return {
        type: 'TOGGLE_TRASHCAN_NODE',
        payload: { nodeRef, isSelected }
    };
}
export function clearSelectedNodes() {
    return {
        type: 'CLEAR_SELECTED_NODES',
        payload: true
    };
}
export function fetchTrashcanNodes(params: Object) {
    const { term, skipCount, pageSize } = params;
    const config = {};
    let filter = '';

    if (term) filter = term;
    config.skipCount = skipCount;
    config.maxItems = pageSize;
    if (filter) {
        config.nf = `${filter}*`;
    }

    const request = xhr.get(ARCHIVE_API, config);

    return {
        type: 'FETCH_TRASHCAN_NODES',
        payload: request
    };
}
export function emptyTrashcan() {
    let request = null;
    const config = API_URL_CONFIGURATION();
    request = axios.delete(ARCHIVE_API, config);

    return (dispatch: Function) => {
        dispatchWithMessage(
            'EMPTY_TRASHCAN',
            'messageTrashEmpty',
            dispatch,
            request
        );
    };
}

export function deleteNodes(
    nodeRefs: Array<string>,
    errorMessage: string
): ThunkAction {
    return (dispatch, getState, repository) => {
        if (!checkLoggenIn(repository, dispatch)) {
            return;
        }
        if (_.isEmpty(nodeRefs)) {
            return;
        }
        dispatch({ type: 'DELETE_TRASHCAN_NODES_PENDING', payload: true });
        dispatch({ type: SHOW_MESSAGE, payload: { id: 'messageTrashEmpty' } });

        const promises = nodeRefs.map((nodeRef: string) => {
            const nodeId = nodeRef.split('/').pop();
            return repository.core.nodesApi.purgeDeletedNode(nodeId);
        });
        Promise.all(promises)
            .then(
                () => {
                    dispatch({
                        type: 'DELETE_TRASHCAN_NODES_FULFILLED',
                        payload: true
                    });
                    dispatch({ type: HIDE_MESSAGE });
                    return null;
                },
                () => {
                    dispatch({
                        type: 'DELETE_TRASHCAN_NODES_REJECTED',
                        payload: errorMessage
                    });
                    dispatch({ type: HIDE_MESSAGE });
                    return null;
                }
            )
            .catch();
    };
}

export function restoreNodes(
    nodeRefs: Array<string>,
    errorMessage: string
): ThunkAction {
    return (dispatch, getState, repository) => {
        if (!checkLoggenIn(repository, dispatch)) {
            return;
        }

        if (_.isEmpty(nodeRefs)) {
            return;
        }
        dispatch({ type: 'RECOVER_TRASHCAN_NODES_PENDING', payload: true });
        dispatch({
            type: SHOW_MESSAGE,
            payload: { id: 'messageTrashRestore' }
        });

        const promises = nodeRefs.map((nodeRef: string) => {
            const nodeId = nodeRef.split('/').pop();

            return repository.core.nodesApi.restoreNode(nodeId);
        });

        Promise.all(promises)
            .then(
                () => {
                    dispatch({
                        type: 'RECOVER_TRASHCAN_NODES_FULFILLED',
                        payload: true
                    });
                    dispatch({ type: HIDE_MESSAGE });
                    return null;
                },
                () => {
                    dispatch({
                        type: 'RECOVER_TRASHCAN_NODES_REJECTED',
                        payload: errorMessage
                    });
                    dispatch({ type: HIDE_MESSAGE });
                    return null;
                }
            )
            .catch();
    };
}
