// @flow
import { FETCH_INVITATIONS } from 'constants/ActionTypes';

/**
 *  reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        invitations: []
    },
    action: Object
) {
    switch (action.type) {
        /**
         *  Get users invitation information
         */
        case `${FETCH_INVITATIONS}_FULFILLED`:
            return {
                ...state,
                invitations: action.payload.data
            };

        default:
            return state;
    }
}
