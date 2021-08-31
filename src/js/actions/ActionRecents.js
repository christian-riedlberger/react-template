// @flow
import { RECENT_DOCUMENTS_API, RECENT_TASKS_API } from 'constants/ServiceURI';

import {
    PUSH_RECENT_DOCUMENT,
    GET_RECENT_DOCUMENTS,
    DELETE_RECENT_DOCUMENTS,
    CLEAR_RECENT_DOCUMENTS,
    PUSH_RECENT_TASK,
    GET_RECENT_TASKS,
    CLEAR_RECENT_TASKS
} from 'constants/ActionTypes';

import { xhr } from './xhr';

export function pushRecentDocument(nodeRef: string) {
    const request = xhr.post(RECENT_DOCUMENTS_API, { nodeRef });
    return {
        type: PUSH_RECENT_DOCUMENT,
        payload: request
    };
}

export function getRecentDocuments() {
    const lds = localStorage.getItem('auth:lds');

    const request = xhr.get(RECENT_DOCUMENTS_API, { lds });
    return {
        type: GET_RECENT_DOCUMENTS,
        payload: request
    };
}

export function removeRecentDocuments(nodeRefs: Array<String> | string) {
    return {
        type: DELETE_RECENT_DOCUMENTS,
        payload: nodeRefs
    };
}

export function clearRecentDocuments() {
    return {
        type: CLEAR_RECENT_DOCUMENTS
    };
}

export function getRecentTasks() {
    const request = xhr.get(RECENT_TASKS_API);
    return {
        type: GET_RECENT_TASKS,
        payload: request
    };
}

export function pushRecentTask(url: string) {
    const request = xhr.post(RECENT_TASKS_API, { url });
    return {
        type: PUSH_RECENT_TASK,
        payload: request
    };
}

export function clearRecentTasks() {
    return {
        type: CLEAR_RECENT_TASKS
    };
}
