// @flow
import _ from 'lodash';
import moment from 'moment';

// import moment from 'moment';
import {
    TASK_REQUEST_API,
    REQUEST_API,
    REPORTS_API
} from 'constants/ServiceURI';
import {
    CREATE_REQUEST_TASK,
    UPDATE_REQUEST,
    FETCH_ALL_REQUESTS
} from 'constants/ActionTypes';

import type { Task } from 'types/taskTypes';
import { log } from 'utils/logger';

import { xhr } from './xhr';

/**
 * Create a document request
 * @param {*} requestTask
 */
export function createRequest(requestTask: Task) {
    const request = xhr.post(TASK_REQUEST_API, requestTask);

    return {
        type: CREATE_REQUEST_TASK,
        payload: request
    };
}

/**
 * Update document in request
 * Used for applying inprogress once seen
 * @param {*} nodeRef
 * @param {*} data
 */
export function updateRequest(nodeRef: string, data: Object) {
    const request = xhr.put(REQUEST_API, { nodeRef, data });

    return {
        type: UPDATE_REQUEST,
        payload: request
    };
}

/**
 * Get Task Status' With Filtering
 * @method GET
 * @param
 * @return {{type, payload}}
 */

export function fetchFilteredRequests(params: Object) {
    const { paging, sort, searchTerm, filter } = params || {};
    log('params', 'blue', { params });
    const config = {};

    const filters = {
        issuingEntity: {
            groups: [],
            users: []
        },
        receivingEntity: {
            groups: [],
            users: []
        },
        status: [],
        progress: [],
        dueDate: {
            begin: '',
            end: ''
        }
    };

    // Add search if it exists
    if (searchTerm) {
        config.term = searchTerm;
    }

    if (filter) config.filter = filter;

    // Add paging if it exists
    if (paging) {
        if (paging.maxItems)
            config.maxItems = paging.maxItems ? paging.maxItems : 10;
        if (paging.skipCount)
            config.skipCount = paging.skipCount ? paging.skipCount : 0;
    }

    // Add sorting to the object
    if (sort) {
        if (sort.direction) config.desc = sort.direction !== 'ascending';
        if (sort.name) config.sort = sort.name ? sort.name : '';
    }

    // Send filter on org
    const activeOrganization = localStorage.getItem('org:active');
    if (activeOrganization) config.orgName = activeOrganization || null;

    if (filter) {
        if (!_.isUndefined(filter.status)) filters.status = filter.status;
        if (!_.isUndefined(filter.progress)) filters.progress = filter.progress;
        if (
            !_.isUndefined(filter.dueDate.begin) &&
            !_.isUndefined(filter.dueDate.end)
        ) {
            if (filter.dueDate.begin !== '') {
                filters.dueDate = {
                    begin: moment(filter.dueDate.begin).format('YYYY-MM-DD'),
                    end: moment(filter.dueDate.end).format('YYYY-MM-DD')
                };
            }
        }

        if (!_.isUndefined(filter.assignee))
            filters.issuingEntity = filter.assignee;
        if (!_.isUndefined(filter.assignedBy))
            filters.receivingEntity = filter.assignedBy;
    }

    config.filter = encodeURIComponent(JSON.stringify(filters));

    const request = xhr.get(`${REPORTS_API}/compliance`, {
        ...config
    });

    return {
        type: FETCH_ALL_REQUESTS,
        payload: request
    };
}
