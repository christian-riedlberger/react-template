// @flow
import { LOGGED_IN, LOADING_APP } from 'constants/ActionTypes'

export default function (state: Object = {
    isLoading: true,
    isLoggedIn: false,
    message: null

}, action: Object) {
    switch (action.type) {
        case LOGGED_IN:
            return {
                ...state,
                isLoading: false,
                isLoggedIn: action.payload.isLoggedIn,
                message: action.payload.message
            }

        case LOADING_APP:
            return {
                ...state,
                isLoading: action.payload.isLoading
            };

        default:
            return state;
    }
}
