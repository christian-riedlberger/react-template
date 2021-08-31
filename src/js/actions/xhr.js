/* eslint-disable compat/compat */
/* eslint-disable import/prefer-default-export */
// @flow
import axios from 'axios-jsonp-pro';
import AlfrescoApi from 'alfresco-js-api';
import { log } from 'utils/logger';
import _ from 'lodash';

import { ALFRESCO_AUTH_OPTS, IGNORE_AUTH_PRECHECK } from 'constants/Config';

/**
 *  XHR Wrapper for all RESTful service requests
 *  Implements AXIOS for POST, PUT, DELETE
 */
export const xhr = {
    /**
     *  Check ticket still valid
     */
    checkTicket: () => {
        if (IGNORE_AUTH_PRECHECK) return true;

        const repository = new AlfrescoApi({
            ...ALFRESCO_AUTH_OPTS,
            ticketEcm: localStorage.getItem('auth:ticket')
        });

        if (!repository.isLoggedIn()) {
            window.location = '/';
            return false;
        }

        return true;
    },

    /**
     * Add Alfresco Ticket to URLS
     * @param {string} URL
     * @return {string}
     */
    appendTicket: (url: string): string => {
        const apx = url.indexOf('?') === -1 ? '?' : '&';

        // $FlowFixMe
        return `${url}${apx}alf_ticket=${localStorage.getItem('auth:ticket')}`;
    },

    /**
     * GET
     * @param {string} URL
     * @param {object} params
     * @return {promise} axios promise
     */
    get: (URL: string, params?: Object, options?: Object): Promise<Object> => {
        if (xhr.checkTicket())
            return axios.get(xhr.appendTicket(URL), { params, ...options });
        return new Promise((resolve, reject) =>
            reject(new Error('session expired'))
        );
    },

    /**
     * PUT
     * @param {string} URL
     * @param {object} params
     * @return {promise} axios promise
     */
    put: (URL: string, params: Object) => {
        if (xhr.checkTicket()) return axios.put(xhr.appendTicket(URL), params);
    },

    /**
     * POST
     * @param {string} URL
     * @param {object} params
     * @return {promise} axios promise
     */
    post: (URL: string, params: any, config: Object) => {
        if (xhr.checkTicket())
            return axios.post(xhr.appendTicket(URL), params, config);
    },

    /**
     * POST
     * @param {string} URL
     * @param {object} params
     * @return {promise} axios promise
     */
    // postRequestReset: (URL: any) => {
    //     return axios.post(URL, {
    //         client: 'share'
    //     });
    // },

    /**
     * POST
     * @param {string} URL
     * @param {object} params
     * @return {promise} axios promise
     */
    postPassReset: (URL: any, params: Object) => {
        return axios.post(URL, params);
    },

    /**
     * POST
     * @param {string} URL
     * @param {object} params
     * @return {promise} axios promise
     */
    multipart: (URL: string, params: any, config: Object) => {
        if (xhr.checkTicket())
            return axios.post(xhr.appendTicket(URL), params, {
                headers: { 'Content-Type': 'multipart/form-data' },
                ...config
            });
    },

    /**
     * DELETE
     * @param {string} URL
     * @param {string} nodeRef
     * @return {promise} axios promise
     */
    delete: (URL: string, nodeRef: string) => {
        if (xhr.checkTicket())
            return axios.delete(xhr.appendTicket(`${URL}?nodeRef=${nodeRef}`));
    },

    /**
     * Send XHR
     * @param {string} url
     * @param {object} data
     * @param {function} callback
     */
    jsonp: (URL: string, data?: Object, callback?: Function) => {
        const call = axios.jsonp(xhr.appendTicket(URL), {
            params: data
        });
        call.then(response => {
            if (callback) callback(response);
            return response;
        }).catch(() => {
            // @todo redirect for 401 only
            localStorage.removeItem('auth:ticket');
            localStorage.removeItem('auth:expires');
            window.location.href = '/';
        });

        return call;
    }
};

// Add a request interceptor
axios.interceptors.request.use(
    config => {
        // Do not check ticket if resetting password.
        const reset = localStorage.getItem('auth:reset');
        if (!reset) {
            // Do something before request is sent
            if (!xhr.checkTicket()) return Promise.reject();
        }

        return config;
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    }
);

/**
 * parse error response object
 * @author ben.vincent
 */
function parseError(data: { message: string, success: boolean }) {
    let error = ['messageInternalError'];
    if (data.message.indexOf('already exists') > -1) {
        error = ['messageFailedExist'];
    } else if (data.message.indexOf('wrong auth details')) {
        error = ['wrongOldPassword'];
    }
    return new Error(error);
}

// Add a request interceptor
axios.interceptors.response.use(
    response => {
        return response;
    },
    (error, ...args) => {
        log('interceptor', 'yellow', { error, args });
        if (_.get(error, 'response.status') === 401) {
            if (error.response.config.url.includes('changepassword')) {
                return Promise.reject(parseError(error.response.data));
            }

            localStorage.removeItem('auth:ticket');
            localStorage.removeItem('auth:expires');
            window.location.href = '/';
        } else if (_.get(error, 'config.url', '').indexOf('permission') > -1) {
            return Promise.resolve(error.response);
        } else if (error.toString().indexOf('Request timed out') > -1) {
            return Promise.resolve(error);
        } else {
            return Promise.reject(error);
        }
    }
);
