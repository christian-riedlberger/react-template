/* eslint-disable compat/compat */
// @flow
import axios from 'axios';
import _ from 'lodash';
import {
    API_URL_CONFIGURATION,
    AUTHORITY_API,
    GROUPS_API,
    ORGANIZATION_API
} from 'constants/ServiceURI';
import {
    FETCH_GROUPS,
    DELETE_GROUP,
    FETCH_GROUP,
    SAVE_GROUP,
    CLEAR_ACTIVE_GROUP,
    FETCH_GROUPS_BROWSE,
    FETCH_CHILDREN,
    FETCH_GROUPS_FULL,
    CLEAR_BROWSE_GROUP,
    CLEAR_FETCH_GROUP,
    CLEAR_GROUP_HISTORY,
    ADD_TO_GROUP,
    PUSH_GROUP_HISTORY,
    UPDATE_GROUP_AT_INDEX,
    DELETE_GROUP_HISTORY,
    UPDATE_SEARCH_TERM,
    FETCH_ORGANIZATIONS,
    RESET_GROUPS
} from 'constants/ActionTypes';
import { GROUP_ROOT, GROUP_PAGE_SIZE, GROUPS_SORT_BY } from 'constants/Config';
import type { Group as GroupType } from 'types/groupTypes';

import { xhr } from './xhr';

export type Search = {
    term?: string,
    sort?: boolean,
    type?: string,
    parentName?: String,
    desc?: boolean,
    maxItems?: number,
    skipCount?: number,
    isOrganization?: boolean,
    keepParent?: boolean
};

export function fetchGroups(params: Search) {
    const { skipCount, maxItems, desc, term, type, parentName } = params || {};

    const config = API_URL_CONFIGURATION();
    config.params.sortBy = GROUPS_SORT_BY;
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

export function fetchGroupsBrowse(params: Search) {
    const config = API_URL_CONFIGURATION();
    if (params && params.term) {
        config.params.filter = params.term;
    }
    if (params && params.type) {
        config.params.type = params.type;
    }

    if (params && params.isOrganization) {
        config.params.isOrganization = params.isOrganization;
    }

    if (params && params.parentName) {
        config.params.parentName = params.parentName;
    }

    if (params && params.keepParent) {
        config.params.keepParent = true;
    }

    config.params.sortBy = GROUPS_SORT_BY;

    config.params.skipCount = 0;
    config.params.maxItems = 100;

    // $FlowFixMe
    const request = axios.get(AUTHORITY_API, config);

    return {
        type: FETCH_GROUPS_BROWSE,
        payload: request
    };
}

function findSelection(selected: string, items: Array<Object>) {
    if (items) {
        const index = _.findIndex(items, o => o.fullName === selected);
        if (index >= 0) {
            return items[index];
        }
    }

    return null;
}

function loadChildren(
    resolve: Function,
    reject: Function,
    index: number,
    parentName: string,
    selectedColumns: Array<string>,
    currentData: Array<Object>
) {
    const config = API_URL_CONFIGURATION();
    config.params.sortBy = GROUPS_SORT_BY;

    config.params.skipCount = 0;
    config.params.maxItems = 10000;
    const url = `${GROUPS_API}/${encodeURIComponent(parentName)}/children`;

    axios
        .get(url, config)
        .then(
            childrenResult => {
                currentData.push({
                    items: childrenResult.data.data
                });

                if (selectedColumns.length < index) {
                    resolve(currentData);
                } else {
                    const selectedItem = findSelection(
                        selectedColumns[index],
                        childrenResult.data.data
                    );
                    if (selectedItem) {
                        loadChildren(
                            resolve,
                            reject,
                            index + 1,
                            selectedItem.shortName,
                            selectedColumns,
                            currentData
                        );
                    } else {
                        resolve(currentData);
                    }
                }
                return null;
            },
            childrenReject => reject(childrenReject)
        )
        .catch(e => {
            throw e;
        });
}

export function fetchGroupsFull(
    params: Search,
    selectedColumns: Array<string>
) {
    const { term } = params;

    let filter = '';

    if (term) filter = term;

    const config = API_URL_CONFIGURATION();
    if (filter) {
        config.params.shortNameFilter = filter;
    }
    config.params.sortBy = GROUPS_SORT_BY;

    config.params.skipCount = 0;
    config.params.maxItems = 10000;

    // eslint-disable-next-line compat/compat
    // $FlowFixMe
    const promise = new Promise((resolve, reject) => {
        axios
            .get(`${GROUPS_API}${GROUP_ROOT}`, config)
            .then(
                browseResult => {
                    const data = [
                        {
                            items: browseResult.data.data
                        }
                    ];

                    // eslint-disable-next-line promise/always-return
                    if (selectedColumns && selectedColumns.length > 0) {
                        const selectedItem = findSelection(
                            selectedColumns[0],
                            browseResult.data.data
                        );
                        if (selectedItem) {
                            loadChildren(
                                resolve,
                                reject,
                                1,
                                selectedItem.shortName,
                                selectedColumns,
                                data
                            );
                        }
                    } else {
                        resolve(data);
                    }
                },
                browseResultReject => reject(browseResultReject)
            )
            .catch(e => {
                throw e;
            });
    });

    return {
        type: FETCH_GROUPS_FULL,
        payload: promise
    };
}

export function fetchChildren(shortName: string, type: string, params: Object) {
    return (dispatch: Function) => {
        dispatch(clearFetchGroups({ reject: { parentName: shortName } }));
        return dispatch({
            type: FETCH_CHILDREN,
            payload: fetchGroups({ parentName: shortName, type, ...params })
                .payload
        });
    };
}

export function saveGroup(group: GroupType) {
    let request;

    const config = API_URL_CONFIGURATION();
    const url = AUTHORITY_API;
    let groupItem = {
        ...group,
        identifier: group.isNew ? group.displayName : group.shortName,
        displayName: group.displayName,
        roles: group.roles
    };
    if (group.isNew) {
        if (group.parentName) {
            groupItem = {
                ...groupItem,
                parentIdentifier: group.parentName
            };
        }

        // $FlowFixMe
        request = axios.post(url, groupItem, config);
    } else {
        // $FlowFixMe
        request = axios.put(url, groupItem, config);
    }

    return {
        type: SAVE_GROUP,
        payload: request
    };
}

export function deleteGroup(
    shortName: string,
    parentName?: string,
    organizationID: string,
    isUser: boolean
) {
    const config = API_URL_CONFIGURATION();
    let url = AUTHORITY_API;
    let request = null;
    // parentName needed to remove user/group from parent group
    if (parentName) {
        config.data = {
            parentName,
            shortName,
            organizationID
        };

        if (config.data.shortName.indexOf('GROUP_') === -1 && !isUser)
            config.data.shortName = `GROUP_${shortName}`;

        url += '/child';

        // $FlowFixMe
        request = axios.delete(url, config);
        // shortName of target group only needed if we are deleting a group
    } else {
        config.data = {
            shortName
        };

        // $FlowFixMe
        request = axios.delete(`${url}/groups/delete`, config);
    }
    return {
        type: DELETE_GROUP,
        payload: request
    };
}

export function clearActiveGroup() {
    return {
        type: CLEAR_ACTIVE_GROUP,
        payload: null
    };
}

/**
 * @desc Fetch or more groups
 * @param shortName: string | Array<string>
 */
export function fetchGroup(shortName: string | Array<string>) {
    const config = API_URL_CONFIGURATION();

    // $FlowFixMe
    const groupName = _.isArray(shortName) ? shortName.join(',') : shortName;
    config.params.identifier = groupName;

    // $FlowFixMe
    const request = axios.get(AUTHORITY_API, config);

    return {
        type: FETCH_GROUP,
        payload: request,
        meta: {
            groups: _.isArray(shortName) ? shortName.length : 1
        }
    };
}

export function clearFetchGroups(option: Object | Function) {
    return {
        type: CLEAR_FETCH_GROUP,
        payload: option
    };
}

export function resetGroups(start: Object) {
    return {
        type: RESET_GROUPS,
        payload: start
    };
}

export function clearBrowseGroups(option: Object | Function) {
    return {
        type: CLEAR_BROWSE_GROUP,
        payload: option
    };
}

export function clearGroupHistory(option: Object | Function) {
    return {
        type: CLEAR_GROUP_HISTORY,
        payload: option
    };
}

export function pushGroupHistory(option: Object) {
    return {
        type: PUSH_GROUP_HISTORY,
        payload: option
    };
}

export function updateGroupAtIndex(group: Object, index: number) {
    return {
        type: UPDATE_GROUP_AT_INDEX,
        payload: { group, index }
    };
}

export function deleteGroupHistory(index: number) {
    return {
        type: DELETE_GROUP_HISTORY,
        payload: index
    };
}

export function updateSearchTerm(term: string) {
    return {
        type: UPDATE_SEARCH_TERM,
        payload: { term }
    };
}

export function addExistingItemToGroup(
    authority: GroupType,
    parentName: string,
    organizationID: string,
    isUser?: boolean = false
) {
    const config = API_URL_CONFIGURATION();
    const body = {
        parentName,
        organizationID,
        shortName: authority.shortName,
        isUser
    };

    if (body.shortName.indexOf('GROUP_') === -1 && !isUser)
        body.shortName = `GROUP_${body.shortName}`;

    const url = `${AUTHORITY_API}/child`;

    // $FlowFixMe
    const request = axios.post(url, body, config);
    return {
        type: ADD_TO_GROUP,
        payload: request
    };
}


