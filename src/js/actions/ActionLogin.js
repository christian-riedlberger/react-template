/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/always-return */
// @flow
import type { ThunkAction } from 'types/actionTypes';
import { LOGGED_IN, LOADING_APP, FETCH_ACCESS } from 'constants/ActionTypes';
import {
    ACCESS_API,
    REQUEST_PASSWORD_RESET,
    RESET_PASSWORD
} from 'constants/ServiceURI';
import { xhr } from './xhr';

/**
 * Check page access
 * @param {string} page
 * @param {object} access
 */
export function checkPageAccess(
    page?: string = '',
    access: Object,
    callback?: Function
) {
    const configPages = ['configure'];
    const singlePages = ['trashcan'];
    const securePages = singlePages.concat(singlePages, configPages);
    let hasAccess = true;

    if (securePages.indexOf(page) !== -1 && page !== '') {
        // Check access
        if (page === 'trashcan') {
            hasAccess = access[page];
        } else if (page === 'configure') {
            hasAccess = access[page];
        }
        if (callback) callback(hasAccess);
    }
}

/**
 * @function checkLogin
 * @return {type} {description}
 */
export function checkLogin(
    url?: string,
    sessionExpiredMessag: string,
    callback?: Function,
    isReset: boolean
): ThunkAction {
    const expires = localStorage.getItem('auth:expires');
    const remember = localStorage.getItem('auth:remember');
    const ticket = localStorage.getItem('auth:ticket');

    return (dispatch: Function, getState: Function, repo: Object) => {
        dispatch({ type: LOADING_APP, payload: { isLoading: true } });

        if (isReset) {
            return dispatch({
                type: LOADING_APP,
                payload: { isLoading: false }
            });
        }

        if (expires && !remember) {
            // Has it expired?
            const period =
                // eslint-disable-next-line radix
                Math.abs(new Date(parseInt(expires)) - new Date().getTime()) /
                36e5;

            // Expire ticket over 4 hours
            if (period > 8) {
                // Clean auth
                localStorage.removeItem('auth:ticket');
                localStorage.removeItem('auth:expires');
                repo.logout();

                dispatch({
                    type: LOGGED_IN,
                    payload: { isLoggedIn: false, message: null }
                });
            }
        }

        if (!repo.isLoggedIn()) {
            if (ticket !== null) {
                repo.loginTicket(ticket)
                    .then(() => {
                        xhr.jsonp(ACCESS_API, {}).then(payload => {
                            checkPageAccess(url, payload.data, callback);
                            dispatch({ type: FETCH_ACCESS, payload });
                            dispatch({
                                type: LOGGED_IN,
                                payload: { isLoggedIn: true, message: null }
                            });
                        });
                    })
                    .catch(() => {
                        localStorage.removeItem('auth:ticket');
                        localStorage.removeItem('auth:expires');
                        dispatch({
                            type: LOGGED_IN,
                            payload: {
                                isLoggedIn: false,
                                message: sessionExpiredMessag
                            }
                        });
                    });
            }
        } else {
            dispatch({
                type: LOGGED_IN,
                payload: { isLoggedIn: ticket !== null, message: null }
            });
        }

        // Make sure non logged-in users see the login screen
        if (!ticket)
            dispatch({ type: LOADING_APP, payload: { isLoading: false } });
    };
}

/**
 * @function login
 * @param  {type} username: string {description}
 * @param  {type} password: string {description}
 * @return {type} {description}
 */
export function requestPasswordReset(
    userName: string,
    enterCredentialsMessage: string
): ThunkAction {
    return (dispatch: Function) => {
        if (userName === '') {
            dispatch({
                type: LOGGED_IN,
                payload: { isLoggedIn: false, message: enterCredentialsMessage }
            });
            return;
        }

        // set local storage to avoid checking the ticket on request interceptor.
        localStorage.setItem('auth:reset', 'reset');

        xhr.postPassReset(REQUEST_PASSWORD_RESET(userName), { client: 'share' })
            .then(() => {
                // set username local storage for reset password.
                localStorage.setItem('auth:reset-username', userName);
                dispatch({
                    type: LOGGED_IN,
                    payload: { isLoggedIn: false, message: 'success' }
                });
            })
            .finally(() => {
                localStorage.removeItem('auth:reset');
            });
    };
}

export function resetPassword(
    userName: string,
    credentials: Object,
    enterCredentialsMessage: Object
): ThunkAction {
    return (dispatch: Function) => {
        if (userName === '') {
            dispatch({
                type: LOGGED_IN,
                payload: {
                    isLoggedIn: false,
                    message: enterCredentialsMessage.userMessage
                }
            });
            return;
        }

        if (credentials.password === '') {
            dispatch({
                type: LOGGED_IN,
                payload: {
                    isLoggedIn: false,
                    message: enterCredentialsMessage.passwordMessage
                }
            });
            return;
        }

        // set local storage to avoid checking the ticket on request interceptor.
        localStorage.setItem('auth:reset', 'reset');

        xhr.postPassReset(RESET_PASSWORD(userName), credentials)
            .then(() => {
                dispatch({
                    type: LOGGED_IN,
                    payload: { isLoggedIn: false, message: 'success' }
                });
            })
            .finally(() => {
                localStorage.removeItem('auth:reset-username');
                localStorage.removeItem('auth:reset');
            });
    };
}

/**
 * @function login
 * @param  {type} username: string {description}
 * @param  {type} password: string {description}
 * @return {type} {description}
 */
export function login(
    username: string,
    password: string,
    enterCredentialsMessage: string,
    invalidCredentialsMessage: string
): ThunkAction {
    return (dispatch: Function, getState: Function, repo: Object) => {
        if (username === '' || password === '') {
            dispatch({
                type: LOGGED_IN,
                payload: { isLoggedIn: false, message: enterCredentialsMessage }
            });
            return;
        }

        repo.login(username, password)
            .then(data => {
                localStorage.setItem('auth:ticket', data);
                localStorage.setItem('auth:username', username);
                localStorage.setItem(
                    'auth:expires',
                    new Date().getTime().toString()
                );

                xhr.jsonp(ACCESS_API, {}).then(payload => {
                    dispatch({ type: FETCH_ACCESS, payload });
                    dispatch({
                        type: LOGGED_IN,
                        payload: { isLoggedIn: true, message: null }
                    });
                });
            })
            .catch(() => {
                localStorage.removeItem('auth:ticket');

                dispatch({
                    type: LOGGED_IN,
                    payload: {
                        isLoggedIn: false,
                        message: invalidCredentialsMessage
                    }
                });
            });
    };
}
