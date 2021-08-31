// @flow
import { FETCH_SEARCH, CLEAR_SEARCH } from 'constants/ActionTypes';

/**
 * Search
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        results: {},
        isLoading: false
    },
    action: Object
) {
    switch (action.type) {
        /**
         *  Fetch all page rights
         */
        case `${FETCH_SEARCH}_PENDING`:
            return {
                ...state,
                isLoading: true
            };

        /**
         *  Fetch all page rights
         */
        case `${FETCH_SEARCH}_FULFILLED`:
            return {
                ...state,
                results: action.payload.data.data,
                isLoading: false
            };

        case CLEAR_SEARCH:
            return {
                ...state,
                isLoading: false,
                results: {}
            };

        default:
            return state;
    }
}
