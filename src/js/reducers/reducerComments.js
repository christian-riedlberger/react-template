// @flow
import {
    FETCH_COMMENTS,
    CREATE_COMMENT,
    DELETE_COMMENT,
    CLEAR_COMMENTS
} from 'constants/ActionTypes';

/**
 * Comment reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        comments: [],
        isLoading: false,
        totalComments: 0,
        permission: {},
        isOpen: null
    },
    action: Object
) {
    switch (action.type) {
        /**
         *  Get comments for node
         */
        case `${FETCH_COMMENTS}_PENDING`:
            return {
                ...state,
                isLoading: true,
                isOpen: null,
                permission: {},
                comments: action.meta.inPlace ? state.comments : []
            };

        /**
         *  Get comments for node
         */
        case `${FETCH_COMMENTS}_FULFILLED`:
            return {
                ...state,
                isLoading: false,
                permission: action.payload.data.nodePermissions,
                comments: action.payload.data.items,
                totalComments: action.payload.data.total
            };

        /**
         *  Create a new comment
         */
        case `${CREATE_COMMENT}_FULFILLED`: {
            return {
                ...state,
                comments: [action.payload.data.item, ...state.comments],
                totalComments: state.totalComments + 1
            };
        }

        /**
         *  Delete a comment from a node
         */
        case DELETE_COMMENT:
            return {
                ...state,
                comments: state.comments.filter(
                    comment =>
                        comment.nodeRef !== action.payload.data.data.nodeRef
                )
            };

        /**
         *  Clear all social comments
         */
        case CLEAR_COMMENTS:
            return {
                ...state,
                comments: []
            };

        default:
            return state;
    }
}
