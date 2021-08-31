// @flow
import axios from 'axios';

import { PREFERENCE_API } from 'constants/ServiceURI';
import { NAMESPACE } from 'constants/Config';
import {
    UPDATE_PREFERENCE,
    FETCH_PREFERENCES,
    CLEAR_ACTIVE_PREFERENCE
} from 'constants/ActionTypes';
import { xhr } from './xhr';

/**
 * Fetch a preference
 * @method GET
 * @param pref: class path
 * @param namespace: namespace for preference (optional)
 * @return {{type, payload}}
 */
export function fetchPreference(namespace: string = NAMESPACE) {
    const user = localStorage.getItem('auth:username') || 'null';
    const request = xhr.get(PREFERENCE_API.replace('USER', user), {
        pf: namespace
    });

    return {
        type: FETCH_PREFERENCES,
        payload: request
    };
}

/**
 * Update preference by class path
 * @method POST
 * @return {{type, payload}}
 */
export function updatePreference(namespace: string, preference: Object) {
    const user = localStorage.getItem('auth:username') || 'null';
    const config = {
        params: {
            pf: namespace,
            alf_ticket: localStorage.getItem('auth:ticket')
        }
    };

    const data = {
        [namespace]: preference
    };

    return (dispatch: Function) => {
        return (
            axios
                .post(PREFERENCE_API.replace('USER', user), { ...data }, config)
                // $FlowFixMe
                .then(() => {
                    dispatch({
                        type: UPDATE_PREFERENCE,
                        payload: preference
                    });
                    return null;
                })
                .catch()
        );
    };
}

/**
 *  Clear the currently active preference
 */
export function clearActivePreference() {
    return {
        type: CLEAR_ACTIVE_PREFERENCE,
        payload: true
    };
}
