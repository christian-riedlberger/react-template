// @flow
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

import { log } from 'utils/logger';
import {
    TASK_AUTHORITY_API,
    TASK_INSTANCE_API,
    ALF_TASK_INSTANCE_API,
    WORKFLOW_INSTANCE_API,
    PROCESS_DIAGRAM_URL,
    TASK_REQUEST_API,
    TASK_PROCESS_API,
    REQUEST_API,
    TASK_API,
    WF_PACKAGE_API,
    WORKFLOW_DEFINITION_API,
    WORKFLOW_CANCEL_API
} from 'constants/ServiceURI';
import {
    FETCH_ALL_TASKS,
    CREATE_REQUEST_TASK,
    FETCH_TASK_AUTHORITIES,
    CLEAR_ALL_TASKS,
    FETCH_TASK,
    FETCH_PACKAGE,
    UPDATE_TASK,
    UPDATE_REQUEST,
    FETCH_WORKFLOW_DEFINITION,
    FETCH_WORKFLOW_INSTANCE_DETAIL,
    FETCH_RECEIVED_TASKS,
    CLEAR_RECEIVED_TASKS,
    FETCH_ISSUED_TASKS,
    CLEAR_ISSUED_TASKS
} from 'constants/ActionTypes';
import type { Task } from 'types/taskTypes';
import type { Flux } from 'types/reduxTypes';
import FormRegistry from 'constants/FormRegistry';

import { xhr } from './xhr';

const ALLOW_SELF_ASSIGNED_TASKS = false;

/**
 * Get workflow definiton steps.
 * @param {*} definition
 */
export function fetchWorkflowDefinition(definition: string) {
    const request = xhr.get(`${WORKFLOW_DEFINITION_API}/${definition}`);

    return {
        type: FETCH_WORKFLOW_DEFINITION,
        payload: request
    };
}

/**
 * Get a single collection from our state
 * @method GET
 * @param nodeRef:string
 * @return {{type, payload}}
 */
export function fetchInstanceDetails(instanceId: string) {
    const request = xhr.get(
        `${WORKFLOW_INSTANCE_API}/${instanceId}?includeTasks=true&noCache=${Math.random()}`,
        {}
    );

    return {
        type: FETCH_WORKFLOW_INSTANCE_DETAIL,
        payload: request
    };
}

/**
 * Get a single task instance
 * @method GET
 * @param taskId:string
 * @return {{type, payload}}
 */
export function fetchTask(taskId: string, params?: Object) {
    let URL = ALF_TASK_INSTANCE_API;
    if (params && params.isWorkflow) {
        URL = WORKFLOW_INSTANCE_API;
    }
    const args = {
        details: true,
        noCache: Math.random()
    };
    const request = xhr.get(`${URL}/${taskId}`, args);
    return {
        type: FETCH_TASK,
        payload: request
    };
}

/**
 * Get All Initial Tasks
 * @method GET
 * @param
 * @return {{type, payload}}
 */

export function fetchAllTasks(params: Object) {
    const { issuedTasks } = params;
    let taskURL = TASK_INSTANCE_API;
    const taskParams = {};
    const search: Object = {};

    // Issued tasks - only get the tasks issued by the current user
    if (issuedTasks) {
        taskParams.initiator = localStorage.getItem('auth:username');
        taskURL = WORKFLOW_INSTANCE_API;
    }

    const request = xhr.get(taskURL, {
        ...taskParams,
        ...search
    });

    return {
        type: FETCH_ALL_TASKS,
        payload: request
    };
}

/**
 * Get workflow package
 * @method GET
 * @param packageId:string
 * @return {{type, payload}}
 */
export function fetchPackage(packageId: string) {
    const request = xhr.get(WF_PACKAGE_API, { packageId });

    return {
        type: FETCH_PACKAGE,
        payload: request
    };
}

export function clearAllTasks() {
    return {
        type: CLEAR_ALL_TASKS
    };
}

/**
 * Get All Initial Tasks
 * @method GET
 * @param
 * @return {{type, payload}}
 */

export function fetchTaskAuthorities(params: Object) {
    const { issuedTasks } = params;

    // $FlowFixMe
    const request = axios.post(
        xhr.appendTicket(TASK_AUTHORITY_API),
        {
            activeOrg: localStorage.getItem('org:active'),
            issuedTasks
        },
        {
            params: {
                authority: localStorage.getItem('auth:username')
            }
        }
    );

    return {
        type: FETCH_TASK_AUTHORITIES,
        payload: request
    };
}

/**
 * Get All Initial Tasks
 * @method POST
 * @param params: filter properties
 * @return {{type, payload}}
 */

export function fetchFilteredTasks(params: Object): Flux {
    const { sort, paging, searchTerm, filter, issuedTasks, activeOrg } = params;

    const taskURL = TASK_INSTANCE_API;
    const taskParams = issuedTasks
        ? { initiator: localStorage.getItem('auth:username') }
        : {};
    const filters = {
        assignee: {
            groups: [],
            users: []
        },
        assignedBy: {
            groups: [],
            users: []
        },
        status: [],
        progress: [],
        dueDate: {
            begin: '',
            end: ''
        },
        workflowIds: []
    };
    const search: Object = {
        properties:
            'bpm_priority,bpm_dueDate,bpm_status,bpm_description,tfd_collection,gfr_entity,gfr_issuingEntity,gfr_guidCount,gfr_packageRefs,bpm_package,gfr_collaborators,gfr_additionalInfo,gfr_details,gfr_status,gfr_progress,gfr_errors',
        authority: localStorage.getItem('auth:username')
    };

    // Add sorting to the object
    if (sort) {
        // $FlowFixMe
        if (sort.direction) taskParams.desc = sort.direction !== 'ascending';
        // $FlowFixMe
        if (sort.name) taskParams.sort = sort.name ? sort.name : '';
    }

    // Add search if it exists
    if (searchTerm) {
        search.filter = searchTerm;
    }

    if (filter) {
        if (!_.isUndefined(filter.status)) filters.status = filter.status;
        if (!_.isUndefined(filter.progress)) filters.progress = filter.progress;
        if (
            !_.isUndefined(filter.dueDate.begin) &&
            !_.isUndefined(filter.dueDate.end)
        ) {
            if (filter.dueDate.begin !== '') {
                filters.dueDate = {
                    begin: moment
                        .utc(filter.dueDate.begin)
                        .format('DD/MM/YYYY HH:mm:ss:SSS'),
                    end: moment
                        .utc(filter.dueDate.end)
                        .format('DD/MM/YYYY HH:mm:ss:SSS')
                };
            }
        }

        if (!_.isUndefined(filter.assignee)) filters.assignee = filter.assignee;
        if (!_.isUndefined(filter.assignedBy))
            filters.assignedBy = filter.assignedBy;
    }

    const request = axios.post(
        xhr.appendTicket(taskURL),
        {
            ...filters,
            maxItems: paging ? paging.maxItems : 10000,
            skipCount: paging ? paging.skipCount : 0,
            issuedTasks: !!issuedTasks,
            activeOrg
        },
        {
            params: {
                ...search,
                ...taskParams,
                authority: localStorage.getItem('auth:username')
            }
        }
    );

    return {
        type: FETCH_ALL_TASKS,
        payload: request
    };
}

/**
 * @desc extend fetch filtered tasks function to force task type
 */
export function fetchIssuedTasks(params: Object): Flux {
    const action = fetchFilteredTasks({ ...params, issuedTasks: true });
    return {
        ...action,
        type: FETCH_ISSUED_TASKS
    };
}

/**
 * @desc extend fetch filtered tasks function to force task type
 */
export function fetchReceivedTasks(params: Object): Flux {
    const action = fetchFilteredTasks({ ...params, issuedTasks: false });
    return {
        ...action,
        type: FETCH_RECEIVED_TASKS
    };
}

export function clearIssuedTasks(): Flux {
    return {
        type: CLEAR_ISSUED_TASKS
    };
}

export function clearReceivedTasks(): Flux {
    return {
        type: CLEAR_RECEIVED_TASKS
    };
}

/**
 * Update a task or move it along
 * @method PUT
 * @param props:{} task properties
 * @return {{type, payload}}
 */
export function updateTask(props: Object) {
    const PROCESSURL = `${TASK_PROCESS_API}activiti$${props.taskId}/formprocessor`;
    const request = xhr.post(PROCESSURL, props);

    return {
        type: UPDATE_TASK,
        payload: request
    };
}

/**
 * Update a task or move it along
 * @method PUT
 * @param props:{} task properties
 * @return {{type, payload}}
 */
export function updateTaskInstance(props: Object) {
    const request = xhr.put(`${TASK_API}/${props.taskId}`, props);

    return {
        type: UPDATE_TASK,
        payload: request
    };
}

/**
 * Cancel a workflow instance
 * @method PUT
 * @param props:{} workflow nodeRef
 * @return {{type, payload}}
 */
export function cancelWorkflowInstance(packageRefs: Object) {
    const request = xhr.put(WORKFLOW_CANCEL_API, packageRefs);
    return {
        type: UPDATE_TASK,
        payload: request
    };
}

/**
 * Serialize a task
 * @param task: Object representing a task.
 * @return serializedTask: Object representing a serialized task.
 */
export function serializeTask(task: Object) {
    const serializedTask = {};
    const username = localStorage.getItem('auth:username') || null;

    // Don't show tasks initiated by you
    if (!ALLOW_SELF_ASSIGNED_TASKS && username === serializedTask.initiator)
        return null;

    if (task.workflowInstance) {
        serializedTask.name = task.properties.bpm_description;
        serializedTask.due =
            task.properties.bpm_dueDate || task.workflowInstance.dueDate;
        serializedTask.comment = task.properties.bpm_comment;
        serializedTask.initiator = task.workflowInstance.initiator
            ? `${task.workflowInstance.initiator.firstName} ${task.workflowInstance.initiator.lastName}`
            : '';

        serializedTask.definitionUrl = task.workflowInstance.definitionUrl;
        serializedTask.initiatorUsername = _.get(
            task,
            'workflowInstance.initiator.userName',
            ''
        );
        serializedTask.initiatorLastName = _.get(
            task,
            'workflowInstance.initiator.lastName',
            ''
        );
        serializedTask.initiatorFirstName = _.get(
            task,
            'workflowInstance.initiator.firstName',
            ''
        );
        serializedTask.taskId = task.id;
        serializedTask.title = task.title;

        serializedTask.state = task.state;
        serializedTask.start = task.workflowInstance.startDate;
        serializedTask.tskName = task.name;
        serializedTask.isPooled = task.isPooled;
        serializedTask.owner = task.properties.gfr_entity;
        // serializedTask.owner = task.owner
        //     ? `${task.owner.firstName} ${task.owner.lastName}`
        //     : '';
        serializedTask.packageId = task.workflowInstance.package;
        serializedTask.package = task.workflowInstance.package;
        serializedTask.isReassignable =
            task.isReassignable ||
            (task.owner && task.properties.bpm_reassignable && !task.isPooled);
        serializedTask.processId = task.workflowInstance.name;
        serializedTask.wfInstanceId = task.workflowInstance.id;
        serializedTask.diagramURL = PROCESS_DIAGRAM_URL(
            task.workflowInstance.id
        );
        serializedTask.priority = String(task.workflowInstance.priority);

        if (task.properties) {
            // Task progress for collapsed tasks
            if (task.properties.gfr_packageRefs) {
                serializedTask.packageRefs = task.properties.gfr_packageRefs;
                const packageRefs = task.properties.gfr_packageRefs.length;
                const completionProgress =
                    task.properties.gfr_packageRefs.length -
                    task.properties.gfr_guidCount;
                serializedTask.completionProgress = `${completionProgress}/${packageRefs}`;
            } else {
                serializedTask.completionProgress = '0/1';
            }

            try {
                serializedTask.collaborators = [];
                const collaborators = _.get(
                    task,
                    'properties.gfr_collaborators'
                );
                if (!_.isEmpty(collaborators)) {
                    serializedTask.collaborators = JSON.parse(collaborators);
                }
            } catch (e) {
                log('serializeTask Error', 'red', e);
                serializedTask.collaborators = [];
            }
            serializedTask.status = _.get(task, 'properties.gfr_status');
            serializedTask.progress = _.get(task, 'properties.gfr_progress');
            serializedTask.collection =
                task.properties.tfd_collection &&
                task.properties.tfd_collection !== '--'
                    ? task.properties.tfd_collection
                    : task.workflowInstance.description.split(' ')[0];
            serializedTask.stage = task.title;
            serializedTask.issuingEntity = _.get(
                task,
                'properties.gfr_issuingEntity'
            );
            serializedTask.entity = _.get(task, 'properties.gfr_entity');
            serializedTask.details = _.get(task, 'properties.gfr_details');
            serializedTask.additionalInfo = _.get(
                task,
                'properties.gfr_additionalInfo'
            );

            serializedTask.errors = _.filter(
                _.split(_.get(task, 'properties.gfr_errors', ''), ',')
            );
        }
        if (task.definition) {
            serializedTask.definition = task.definition;
        }
    } else {
        // Dealing with started
        serializedTask.isWFInstance = true;
        serializedTask.name = task.message;
        serializedTask.due = task.dueDate;
        serializedTask.start = task.startDate;
        serializedTask.initiator = _.get(task, 'initiator.userName');
        serializedTask.initiatorUsername = _.get(task, 'initiator.userName');
        serializedTask.initiatorFirstName = _.get(task, 'initiator.firstName');
        serializedTask.initiatorLastName = _.get(task, 'initiator.lastName');
        serializedTask.title = task.title;
        serializedTask.packageId = task.package;
        serializedTask.package = task.package;
        serializedTask.processId = task.name;
        serializeTask.details = _.get(task, 'properties.gfr_details');
        serializeTask.additionalInfo = _.get(
            task,
            'properties.gfr_additionalInfo'
        );
        serializedTask.status = _.get(task, 'properties.gfr_status');
        serializedTask.progress = _.get(task, 'properties.gfr_progress');
        serializedTask.wfInstanceId = task.id;

        serializedTask.definitionUrl = task.workflowInstance
            ? task.workflowInstance.definitionUrl
            : null;

        serializedTask.diagramURL = PROCESS_DIAGRAM_URL(task.id);
        serializedTask.collection = _.get(
            task,
            'properties.tfd_collection',
            _.head(_.split(task.description, ' ', 1))
        );
        serializedTask.stage = null;
        serializedTask.taskId = task.id;
        serializedTask.issuingEntity = _.get(
            task,
            'properties.gfr_issuingEntity'
        );
        serializedTask.entity = _.get(task, 'properties.gfr_entity');
    }

    return serializedTask;
}

/**
 * Create a document request
 * @param {*} requestTask
 */
export function createRequest(requestTask: Task) {
    const workflow: Task & { isWorkflowPerDocument?: boolean } = {
        ...requestTask
    };

    if (
        _.get(
            _.find(FormRegistry, { workflowId: requestTask.workflowId }),
            'isWorkflowPerDocument'
        )
    ) {
        workflow.isWorkflowPerDocument = true;
    }
    const request = xhr.post(TASK_REQUEST_API, workflow);
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
 * Update document in request
 * Used for applying inprogress once seen
 * @param {*} nodeRef
 * @param {*} data
 */
export function clearActiveTask() {
    return {
        type: 'CLEAR_ACTIVE_TASK',
        payload: true
    };
}

export function extendTasks(
    serializedTasks: Array<Object>,
    taskRefs?: Array<Object>
) {
    if (!_.isEmpty(taskRefs)) {
        // extend task object with api data
        return _.map(serializedTasks, task => {
            const taskJson = _.find(taskRefs, {
                workflowId: task.wfInstanceId
            });

            let taskIds: Array<{ taskId: string }> = [];
            let taskDocumentProgress: string = '';
            let taskDocumentStatus: string = '';
            if (taskJson) {
                taskIds = taskJson.taskArray;

                // set progress to "In Progress" if ANY are "inprogress"
                if (_.some(taskJson.progress, p => p === 'inprogress')) {
                    taskDocumentProgress = 'inprogress';
                }
                if (_.some(taskJson.progress, p => p === 'overdue')) {
                    taskDocumentProgress = 'overdue';
                }
                if (_.some(taskJson.status, p => p === 'notCompliant')) {
                    taskDocumentStatus = 'notCompliant';
                }
            }
            const refs = _.map(taskIds, 'taskId');
            const type =
                task.processId === 'activiti$compliantWorkflow'
                    ? 'workflow'
                    : 'task';

            if (refs.length > 0) {
                return {
                    ...task,
                    taskRefs: refs,
                    progress: _.isEmpty(taskDocumentProgress)
                        ? task.progress
                        : taskDocumentProgress,
                    status: _.isEmpty(taskDocumentStatus)
                        ? task.status
                        : taskDocumentStatus,
                    link: `/${type}/details/${_.map(
                        refs,
                        id => `task$${id.split('$')[1]}`
                    ).join(',')}`
                };
            }

            return {
                ...task,
                taskRefs: refs,
                progress: _.isEmpty(taskDocumentProgress)
                    ? task.progress
                    : taskDocumentProgress,
                link: `/${type}/details/${task.taskId}`
            };
        });
    }

    return _.map(serializedTasks, task => ({
        ...task,
        link:
            task.processId === 'activiti$compliantWorkflow'
                ? `/workflow/details/${task.taskId}`
                : `/task/details/${task.taskId}`
    }));
}
