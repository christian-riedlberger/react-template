// @flow
import {
    FETCH_VERSION_HISTORY,
    UPLOAD_NEW_VERSION
} from 'constants/ActionTypes';
import { log } from 'utils/logger';

/**
 *  reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        versionHistory: [],
        isLoading: false,
        forceVersionUpdate: false
    },
    action: Object
) {
    switch (action.type) {
        /**
         *  Get version history for a node
         */
        case `${FETCH_VERSION_HISTORY}_PENDING`:
            return {
                ...state,
                isLoading: true,
                versionHistory: action.meta.inPlace ? state.versionHistory : []
            };

        /**
         *  Get version history for a node
         */
        case `${FETCH_VERSION_HISTORY}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                forceVersionUpdate: false,
                versionHistory: action.payload.data
            };

        /**
         *  Upload a new version
         */
        case `${UPLOAD_NEW_VERSION}_FULFILLED`: {
            log('payload', 'blue', action.payload);
            return {
                ...state,
                forceVersionUpdate: true
            };
        }

        default:
            return state;
    }
}
