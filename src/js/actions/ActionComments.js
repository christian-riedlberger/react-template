/* @flow */
import { reset } from 'redux-form';
import { COMMENT_API, CUSTOM_COMMENT_API } from 'constants/ServiceURI';
import { FETCH_COMMENTS, CREATE_COMMENT } from 'constants/ActionTypes';
import { xhr } from './xhr';

/**
 * Get comments for a node
 * @method GET
 * @param nodeRef:string Node Reference
 * @return {{type, payload}}
 */
export function fetchComments(nodeRef: string, inPlace?: boolean) {
    const config = {
        reverse: true,
        startIndex: 0,
        pageSize: 100
    };

    const request = xhr.get(COMMENT_API(nodeRef), config);

    return {
        type: FETCH_COMMENTS,
        payload: request,
        meta: {
            inPlace
        }
    };
}

/**
 * Create a comment
 * @method GET
 * @param nodeRef:string Node Reference
 * @return {{type, payload}}
 */
export function createComment(
    nodeRef: string,
    comment: string,
    majorVersion?: boolean
) {
    const request = xhr.post(CUSTOM_COMMENT_API, {
        nodeRef,
        comment,
        majorVersion
    });

    return {
        type: CREATE_COMMENT,
        payload: request
    };
}

export function clearUserComment() {
    return (dispatch: Function) => {
        dispatch(reset('formComments'));
    };
}
