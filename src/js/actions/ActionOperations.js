/* eslint-disable compat/compat */
// @flow
import axios from 'axios';
import _ from 'lodash';
import {
    ALFRESCO_SERVICE_URI,
    API_URL_CONFIGURATION,
    OPERATION_API,
    AUTHORITY_API
} from 'constants/ServiceURI';
import {
    FETCH_GROUPS,
    FETCH_GROUP,
    SAVE_GROUP,
    CLEAR_ACTIVE_GROUP,
    FETCH_GROUPS_BROWSE,
    FETCH_CHILDREN,
    CLEAR_FETCH_GROUP
} from 'constants/ActionTypes';
import { GROUP_PAGE_SIZE } from 'constants/Config';
import type { Organization as OrganizationType } from 'types/groupTypes';

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

export function fetchOperations(params: Search) {
    const { skipCount, maxItems, desc, term, type, parentName } = params || {};

    const config = API_URL_CONFIGURATION();
    config.params.sortBy = 'authorityDisplayName';
    config.params.type = _.isUndefined(type) ? 'group' : type;
    config.params.maxItems = GROUP_PAGE_SIZE;
    config.params.skipCount = 0;

    if (term) config.params.filter = term;
    if (desc) config.params.dir = desc;
    if (skipCount) config.params.skipCount = skipCount;
    if (maxItems) config.params.maxItems = maxItems;
    if (!_.isUndefined(parentName)) config.params.parentName = parentName;

    // $FlowFixMe
    const request = axios.get(AUTHORITY_API, config);

    return {
        type: FETCH_GROUPS,
        payload: request
    };
}

export function fetchOperationsBrowse(params: Search) {
    const config = API_URL_CONFIGURATION();
    if (params && params.term) {
        config.params.filter = params.term;
    }
    if (params && params.type) {
        config.params.type = params.type;
    }

    if (params && params.isOperation)
        config.params.isOperation = params.isOperation;

    config.params.sortBy = 'displayName';

    config.params.skipCount = 0;
    config.params.maxItems = 100;

    // $FlowFixMe
    const request = axios.get(AUTHORITY_API, config);

    return {
        type: FETCH_GROUPS_BROWSE,
        payload: request
    };
}

export function fetchOpChildren(shortName: string) {
    return (dispatch: Function) => {
        dispatch(clearFetchGroups({ reject: { parentName: shortName } }));
        dispatch({
            type: FETCH_CHILDREN,
            payload: fetchOperations({ parentName: shortName, type: null })
                .payload
        });
    };
}

export function saveOperation(op: OrganizationType) {
    let request;

    const config = API_URL_CONFIGURATION();
    const url = OPERATION_API;
    let opItem = {
        identifier: op.isNew ? op.displayName : op.shortName,
        title: op.isNew ? op.displayName : op.shortName,
        displayName: op.displayName,
        roles: op.roles,
        address: op.address,
        city: op.city,
        country: op.country,
        phone: op.phone,
        color: op.color
    };
    if (op.isNew) {
        if (op.parentName) {
            opItem = {
                ...opItem,
                parentIdentifier: op.parentName,
                // $FlowFixMe
                organizationId: op.parentName.match(/^.*(?=(_OPERATIONS))/)[0]
            };
        }
        // $FlowFixMe
        request = axios.post(url, opItem, config);
    } else {
        // $FlowFixMe
        request = axios.put(url, opItem, config);
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
                        .get(OPERATION_API, config)
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
