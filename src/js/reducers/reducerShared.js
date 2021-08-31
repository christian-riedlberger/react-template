// @flow

import {
    FETCH_SHARED,
    FETCH_SHARED_USERS,
    CLEAR_SHARED
} from 'constants/ActionTypes';
import type { Node } from 'types/repoTypes';

export type Type = 'folder' | 'content';

export type State = {
    isLoadingShared: boolean,
    isLoadingSharedModifiers: boolean,
    shared: Array<Node> | null,
    modifiers: Array<any> | null,
    activeType: null | Type
};

export default function(
    state: State = {
        isLoadingShared: false,
        isLoadingSharedModifiers: false,
        shared: null,
        modifiers: [],
        activeType: null
    },
    action: Object
) {
    switch (action.type) {
        case `${FETCH_SHARED}_PENDING`:
            return {
                ...state,
                isLoadingShared: true
            };

        case `${FETCH_SHARED}_FULFILLED`:
            return {
                ...state,
                isLoadingShared: false,
                shared: action.payload.data.data,
                isRootPath: action.payload.isRootPath
            };

        case `${FETCH_SHARED_USERS}_PENDING`:
            return {
                ...state,
                isLoadingSharedModifiers: true
            };

        case `${FETCH_SHARED_USERS}_FULFILLED`:
            return {
                ...state,
                isLoadingSharedModifiers: false,
                modifiers: action.payload.data.data
            };

        case CLEAR_SHARED:
            return {
                ...state,
                shared: []
            };

        default:
            return state;
    }
}
