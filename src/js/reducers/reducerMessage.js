// @flow
import { SHOW_MESSAGE, HIDE_MESSAGE } from 'constants/ActionTypes';

/**
 * Global messages
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        variant: null,
        message: null,
        vertical: null,
        horizontal: null,
        cache: 0
    },
    action: Object
) {
    switch (action.type) {
        case SHOW_MESSAGE:
            return {
                ...action.payload
            };

        case HIDE_MESSAGE:
            return {
                variant: null,
                message: null,
                vertical: null,
                horizontal: null,
                cache: 0
            };

        default:
            return state;
    }
}
