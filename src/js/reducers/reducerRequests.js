// @flow
import { CREATE_REQUEST_TASK, FETCH_ALL_REQUESTS } from 'constants/ActionTypes';

/**
 * Requests reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        allRequests: [],
        isLoadingRequests: false,
        needsRequestReset: false,
        totalRequests: 0,
        requestTaskStatus: ''
    },
    action: Object
) {
    switch (action.type) {
        case `${CREATE_REQUEST_TASK}_PENDING`:
            return {
                ...state,
                isLoadingRequests: true
            };

        case `${CREATE_REQUEST_TASK}_FULFILLED`:
            return {
                ...state,
                isLoadingRequests: false,
                requestTaskStatus: action.payload.data.status
            };

        case `${FETCH_ALL_REQUESTS}_PENDING`:
            return {
                ...state,
                allRequests: [],
                needsRequestReset: false,
                isLoadingRequests: true
            };

        case `${FETCH_ALL_REQUESTS}_FULFILLED`: {
            const allRequests = action.payload.data.data;
            const { totalItems } = action.payload.data.paging;

            return {
                ...state,
                isLoadingRequests: false,
                needsTaskReset: false,
                allRequests,
                totalRequests: totalItems
            };
        }

        default:
            return state;
    }
}
