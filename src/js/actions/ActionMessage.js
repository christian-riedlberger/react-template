// @flow
/* eslint-disable import/prefer-default-export */
import type { Action } from 'types/actionTypes';
import { SHOW_MESSAGE, HIDE_MESSAGE } from 'constants/ActionTypes';
import faker from 'faker';

import type { Variant } from 'components/Snackbar';

/**
 * Show a global message
 * @param {string} id  (label lang id)
 * @param {boolean} timed
 * @param {boolean} isError (for coloring)
 * @return {{type, payload}}
 */

export type ShowMessageArgs = {
    message: string,
    variant: Variant,
    vertical?: string,
    horizontal?: string,
    info?: string
};
export function showMessage(args: ShowMessageArgs): Action {
    // $FlowFixMe
    return (dispatch: Function) => {
        dispatch({
            type: SHOW_MESSAGE,
            payload: {
                ...args,
                cache: faker.random.alphaNumeric(12)
            }
        });
    };
}

/**
 * Show a global message
 * @param {string} id  (label lang id)
 * @param {boolean} timed
 * @param {boolean} isError (for coloring)
 * @return {{type, payload}}
 */
export function hideMessage(): Action {
    // $FlowFixMe
    return (dispatch: Function) => {
        dispatch({
            type: HIDE_MESSAGE,
            payload: true
        });
    };
}
