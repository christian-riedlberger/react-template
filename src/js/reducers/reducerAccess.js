// @flow
import {
    FETCH_ACCESS,
    FETCH_PAGE_ACCESS,
    FETCH_ACCESS_PENDING,
    SET_ACTIVE_ORGANIZATION
} from 'constants/ActionTypes';
import _ from 'lodash';

/**
 * Activity reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        isLoading: false
    },
    action: Object
) {
    switch (action.type) {
        /**
         *  Fetch all page rights
         */
        case FETCH_ACCESS_PENDING:
            return {
                ...state,
                isLoading: true
            };

        /**
         *  Fetch all page rights
         */
        case FETCH_ACCESS: {
            if (_.isEmpty(action.payload.data)) {
                if (window.location.pathname !== '/noaccess')
                    window.location = '/noaccess';
            }

            localStorage.setItem('auth:verified', action.payload.data.verified);
            localStorage.setItem(
                'auth:userIsAdmin',
                action.payload.data.activeOrg.userIsAdmin
            );
            return {
                ...action.payload.data,
                isLoading: false
            };
        }

        /**
         *  Fetch single page rights
         */
        case FETCH_PAGE_ACCESS:
            return {
                ...state,
                ...action.payload.data,
                isLoading: false
            };

        case `${SET_ACTIVE_ORGANIZATION}_FULFILLED`:
            localStorage.setItem(
                'auth:userIsAdmin',
                action.payload.data.activeOrg.userIsAdmin
            );
            return {
                ...state,
                ...action.payload.data
            };

        default:
            return state;
    }
}
