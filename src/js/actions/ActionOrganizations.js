/* eslint-disable compat/compat */
// @flow
import axios from 'axios';
import _ from 'lodash';
import {
    ALFRESCO_SERVICE_URI,
    API_URL_CONFIGURATION,
    ORGANIZATION_API,
    AUTHORITY_AVATAR_API,
    AUTHORITY_API,
    MY_ORGANIZATION_API
} from 'constants/ServiceURI';
import {
    FETCH_GROUPS,
    FETCH_GROUP,
    SAVE_GROUP,
    CLEAR_ACTIVE_GROUP,
    FETCH_GROUPS_BROWSE,
    FETCH_CHILDREN,
    CLEAR_FETCH_GROUP,
    UPLOAD_AVATAR,
    FETCH_ORGANIZATIONS
} from 'constants/ActionTypes';
import { GROUP_PAGE_SIZE, GROUPS_SORT_BY } from 'constants/Config';

import { xhr } from './xhr';

const GROUPS_API = `${ALFRESCO_SERVICE_URI}/groups`;

export type Search = {
    term?: string,
    sort?: boolean,
    desc?: boolean,
    maxItems?: number,
    skipCount?: number,
    type?: string | null,
    parentName?: string,
    isOperation?: boolean
};

/**
 * Get organizations for user.
 * @param {string} userName
 */
export function fetchMyOrganizations(userName?: string) {
    const config = API_URL_CONFIGURATION();

    if (userName) {
        config.params.userName = userName;
    }

    // $FlowFixMe
    const request = axios.get(MY_ORGANIZATION_API, config);

    return {
        type: FETCH_ORGANIZATIONS,
        payload: request
    };
}

export function fetchOrganizations(params: Search) {
    const { skipCount, maxItems, desc, term, type, parentName } = params || {};

    const config = API_URL_CONFIGURATION();
    config.params.sortBy = GROUPS_SORT_BY;
    config.params.type = _.isUndefined(type) ? 'group' : type;
    config.params.maxItems = maxItems || GROUP_PAGE_SIZE;
    config.params.skipCount = skipCount || 0;

    if (term) config.params.filter = term;
    if (desc) config.params.dir = desc;

    if (!_.isUndefined(parentName)) config.params.parentName = parentName;

    // $FlowFixMe
    const request = axios.get(AUTHORITY_API, config);

    return {
        type: FETCH_GROUPS,
        payload: request
    };
}

/**
 * Get user information
 * @method GET
 * @return {Promise}
 */
export function fetchOrganizationInfo(organizationId: string): Promise<Object> {
    return xhr.get(ORGANIZATION_API, { organizationId });
}

export function fetchOrganizationsBrowse(params: Search) {
    const config = API_URL_CONFIGURATION();
    if (params && params.term) {
        config.params.filter = params.term;
    }
    if (params && params.type) {
        config.params.type = params.type;
    }

    config.params.sortBy = GROUPS_SORT_BY;

    config.params.skipCount = 0;
    config.params.maxItems = 10;

    // $FlowFixMe
    const request = axios.get(AUTHORITY_API, config);

    return {
        type: FETCH_GROUPS_BROWSE,
        payload: request
    };
}

export function fetchOrgChildren(
    shortName: string,
    type: string,
    params: Object
) {
    return (dispatch: Function) => {
        dispatch(clearFetchGroups({ reject: { parentName: shortName } }));
        return dispatch({
            type: FETCH_CHILDREN,
            payload: fetchOrganizations({
                parentName: shortName,
                type,
                ...params
            }).payload
        });
    };
}

export function saveOrganization(org: Object) {
    let request;

    const config = API_URL_CONFIGURATION();
    const url = ORGANIZATION_API;
    let orgItem = {
        identifier: org.isNew ? org.displayName : org.shortName,
        title: org.isNew ? org.displayName : org.shortName,
        displayName: org.displayName,
        roles: org.roles,
        address: org.address,
        city: org.city,
        postalcode: org.postalcode,
        country: org.country,
        phone: org.phone,
        website: org.website,
        avatarUrl: org.avatarUrl,
        sender: org.sender
    };

    if (org.isNew) {
        if (org.parentName) {
            orgItem = {
                ...orgItem,
                parentIdentifier: org.parentName
            };
        }

        // $FlowFixMe
        request = axios.post(url, orgItem, config);
    } else {
        orgItem = {
            ...orgItem,
            organizationId: org.parentName
        };

        // $FlowFixMe
        request = axios.put(url, orgItem, config);
    }

    return {
        type: SAVE_GROUP,
        payload: request
    };
}

export function clearActiveGroup() {
    return {
        type: CLEAR_ACTIVE_GROUP,
        payload: null
    };
}

export function fetchGroup(shortName: string) {
    const config = API_URL_CONFIGURATION();
    // eslint-disable-next-line compat/compat

    // $FlowFixMe
    const request = new Promise((resolve, reject) => {
        axios
            .get(`${GROUPS_API}/${encodeURIComponent(shortName)}`, config)
            .then(
                // eslint-disable-next-line promise/always-return
                result => {
                    const group = result.data.data;
                    config.params.identifier = group.shortName;
                    axios
                        .get(ORGANIZATION_API, config)
                        .then(
                            // eslint-disable-next-line promise/always-return
                            data => {
                                const authorities = data.data.data;
                                resolve(authorities);
                            },
                            getAuthorityReject => reject(getAuthorityReject)
                        )
                        .catch(e => {
                            throw e;
                        });
                },
                getGroupReject => reject(getGroupReject)
            )
            .catch(e => {
                throw e;
            });
    });

    return {
        type: FETCH_GROUP,
        payload: request
    };
}

export function clearFetchGroups(option: Object | Function) {
    return {
        type: CLEAR_FETCH_GROUP,
        payload: option
    };
}

export function uploadAvatar(file: File, shortName: string) {
    const data = new FormData();
    data.append('filedata', file);
    data.append('organization', shortName);

    const request = xhr.post(AUTHORITY_AVATAR_API, data);

    return {
        type: UPLOAD_AVATAR,
        payload: {
            request,
            file,
            shortName
        }
    };
}
