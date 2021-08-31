// @flow
import { FETCH_AUTHORITY, CLEAR_AUTHORITY } from 'constants/ActionTypes';

/**
 * Authority reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function (state: Object = {
    authorities: [],
    isLoading: false
}, action: Object) {
    switch (action.type) {

    /**
         *  Get user or group by filter
         *  used for search loading screen
         */
        case `${FETCH_AUTHORITY}_PENDING`:
            return {
                ...state,
                isLoading: true
            };

        /**
         *  Get authority by filter
         *  used for searching users or groups
         */
        case `${FETCH_AUTHORITY}_FULFILLED`:
            return {
                ...state,
                authorities: action.payload.data.data,
                isLoading: false
            };

        case CLEAR_AUTHORITY:
            return {
                ...state,
                authorities: []
            };

        default:
            return state;
    }
}
