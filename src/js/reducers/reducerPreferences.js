// @flow
import {
    FETCH_PREFERENCES,
    UPDATE_PREFERENCE,
    CLEAR_ACTIVE_PREFERENCE
} from 'constants/ActionTypes';

/**
 * Preferences reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        preference: {},
        preferenceDashboard: {},
        activePreference: {},
        isLoading: false
    },
    action: Object
) {
    switch (action.type) {
        case `${FETCH_PREFERENCES}_PENDING`:
            return {
                ...state,
                isLoading: true,
                preference: {}
            };

        case `${FETCH_PREFERENCES}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                preference: action.payload.data
            };

        case UPDATE_PREFERENCE:
            return {
                ...state,
                isLoading: false
            };

        case CLEAR_ACTIVE_PREFERENCE:
            return {
                ...state,
                preference: {}
            };

        default:
            return state;
    }
}
