/* eslint-disable import/prefer-default-export */
// @flow
import { SHOW_MESSAGE } from 'constants/ActionTypes';
import faker from 'faker';

export const dispatchWithMessage = (
    action: string,
    id: string,
    dispatch: Function,
    request: Function,
    callback?: Function
) => {
    const pending = {
        message: `${id}Pending`,
        variant: 'info',
        cache: faker.random.alphaNumeric(12)
    };

    const success = {
        message: `${id}Success`,
        variant: 'success',
        cache: faker.random.alphaNumeric(12)
    };

    const error = {
        message: `${id}Error`,
        variant: 'error',
        cache: faker.random.alphaNumeric(12)
    };

    dispatch({ type: SHOW_MESSAGE, payload: pending });
    dispatch({ type: `${action}_PENDING` });

    return request
        .then(payload => {
            dispatch({ type: `${action}_FULFILLED`, payload });
            dispatch({ type: SHOW_MESSAGE, payload: success });

            if (callback) callback(payload);
            return payload;
        })
        .catch(() => {
            dispatch({ type: SHOW_MESSAGE, payload: error });
        });
};
