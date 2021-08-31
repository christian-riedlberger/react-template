// @flow

import _ from 'lodash';
import {
    FETCH_ALL_TASKS,
    CLEAR_ACTIVE_TASK,
    CREATE_REQUEST_TASK,
    FETCH_TASK_AUTHORITIES,
    CLEAR_ALL_TASKS,
    FETCH_TASK,
    FETCH_PACKAGE,
    FETCH_WORKFLOW_DEFINITION,
    FETCH_RECEIVED_TASKS,
    CLEAR_RECEIVED_TASKS,
    FETCH_ISSUED_TASKS,
    CLEAR_ISSUED_TASKS,
    CLEAR_RECENT_TASKS,
    GET_RECENT_TASKS,
    UPDATE_ISSUED_TASKS,
    FETCH_WORKFLOW_INSTANCE_DETAIL
} from 'constants/ActionTypes';
import { serializeTask, extendTasks } from 'actions/ActionTasks';
import { log } from 'utils/logger';

/**
 * Task reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */

export const initialState = {
    tasks: [],
    alltasks: [],
    activeTask: null,
    totalTasks: 0,
    needsTaskReset: false,
    definitions: [],
    counts: {},
    isLoading: false,
    isAllTasksLoading: false,
    instance: null,
    packages: [],
    organizationsBy: [],
    organizationsTo: [],
    organizations: [],
    assignee: [],
    assignedBy: [],
    initialized: false,
    isLoadingPackage: false,
    isLoadingTaskAuthorities: false,
    isLoadingWorkflowDetails: false,
    instanceTasks: [],
    receivedTasks: [],
    receivedTasksIsLoading: false,
    receivedTotalTasks: 0,
    issuedTasks: [],
    issuedTasksIsLoading: false,
    issuedTotalTasks: 0,
    recentTasks: null
};

export default function(state: Object = initialState, action: Object) {
    switch (action.type) {
        case `${FETCH_WORKFLOW_DEFINITION}_PENDING`:
            return {
                ...state
            };

        case `${FETCH_WORKFLOW_DEFINITION}_FULFILLED`:
            return {
                ...state
            };

        /**
         *  Task API call complete
         *  map action callback to state
         */
        case `${FETCH_ALL_TASKS}_PENDING`: {
            return {
                ...state,
                isAllTasksLoading: true,
                alltasks: []
            };
        }

        /**
         *  Task API call complete
         *  map action callback to state
         */
        case `${FETCH_ALL_TASKS}_FULFILLED`: {
            const result = _.get(action, 'payload.data', {
                data: [],
                taskRefs: []
            });
            const serializedTasks = _.map(result.data, serializeTask);

            const refTasks = result.taskRefs
                ? _.map(serializedTasks, task => {
                    const taskJson = _.find(result.taskRefs, {
                        workflowId: task.wfInstanceId
                    });
                    let taskIds = [];
                    if (taskJson) {
                        taskIds = JSON.parse(taskJson.taskArray);
                    }
                    return {
                        ...task,
                        taskRefs: _.map(taskIds, 'taskId')
                    };
                })
                : serializedTasks;

            return {
                ...state,
                alltasks: refTasks,
                allTotalTasks: _.get(result, 'paging.totalItems'),
                isAllTasksLoading: false,
                assignedBy: result.assignedBy,
                assignee: result.assignee,
                organizations: result.organizations
            };
        }

        case `${FETCH_ALL_TASKS}_REJECTED`:
            return {
                ...state,
                isAllTasksLoading: false,
                serverMessage: ['errorMissingTask']
            };

        case CLEAR_ALL_TASKS:
            return {
                ...state,
                alltasks: []
            };

        /**
         *  Clear active task
         *  used for editing and viewing
         */
        case CLEAR_ACTIVE_TASK:
            return {
                ...state,
                activeTask: null
            };

        case `${CREATE_REQUEST_TASK}_PENDING`:
            return {
                ...state,
                isLoadingRequests: true
            };

        case `${CREATE_REQUEST_TASK}_FULFILLED`:
            return {
                ...state,
                isLoadingRequests: false,
                requestTaskStatus: action.payload.data.status
            };

        case `${FETCH_TASK_AUTHORITIES}_PENDING`:
            return {
                ...state,
                isLoadingTaskAuthorities: true
            };

        case `${FETCH_TASK_AUTHORITIES}_FULFILLED`:
            return {
                ...state,
                isLoadingTaskAuthorities: false,
                ...action.payload.data.data
            };

        case `${FETCH_WORKFLOW_INSTANCE_DETAIL}_PENDING`:
            return {
                ...state,
                isLoadingWorkflowDetails: true
            };

        case `${FETCH_WORKFLOW_INSTANCE_DETAIL}_FULFILLED`:
            return {
                ...state,
                isLoadingWorkflowDetails: false,
                ...action.payload.data.data
            };

        case `${FETCH_TASK}_PENDING`:
            return {
                ...state,
                isLoadingFetchTask: true,
                activeTask: {}
            };

        case `${FETCH_TASK}_FULFILLED`:
            log('data', 'blue', action.payload.data.data);
            return {
                ...state,
                isLoadingFetchTask: false,
                activeTask: serializeTask(action.payload.data.data)
            };

        case `${FETCH_TASK}_REJECTED`:
            return {
                ...state,
                isLoadingFetchTask: false,
                serverMessage: ['errorMissingTask']
            };

        /**
         *  Task Package API
         */
        case `${FETCH_PACKAGE}_PENDING`: {
            return {
                ...state,
                packages: [],
                isLoadingPackage: true
            };
        }

        case `${FETCH_PACKAGE}_FULFILLED`: {
            const result = action.payload.data.data;

            return {
                ...state,
                packages: result,
                isLoadingPackage: false
            };
        }

        case 'CLEAR_ACTIVE_TASK': {
            return {
                ...state,
                activeTask: null
            };
        }

        /**
         *  Task Received Action
         */
        case `${FETCH_RECEIVED_TASKS}_PENDING`: {
            return {
                ...state,
                receivedTasksIsLoading: true,
                receivedTasks: []
            };
        }

        case `${FETCH_RECEIVED_TASKS}_FULFILLED`: {
            const result = _.get(action, 'payload.data', {
                data: [],
                taskRefs: []
            });
            const serializedTasks = _.map(result.data, serializeTask);
            const refTasks = extendTasks(serializedTasks, result.taskRefs);

            return {
                ...state,
                receivedTasksIsLoading: false,
                receivedTasks: refTasks,
                receivedTotalTasks: _.get(result, 'paging.totalItems'),
                assignedBy: result.assignedBy,
                assignee: result.assignee,
                organizations: result.organizations
            };
        }

        case CLEAR_RECEIVED_TASKS: {
            return {
                ...state,
                receivedTasksIsLoading: false,
                receivedTasks: []
            };
        }

        /**
         *  Task Received Action
         */
        case `${FETCH_ISSUED_TASKS}_PENDING`: {
            return {
                ...state,
                issuedTasksIsLoading: true,
                issuedTasks: []
            };
        }

        case `${FETCH_ISSUED_TASKS}_FULFILLED`: {
            const result = _.get(action, 'payload.data', {
                data: [],
                taskRefs: []
            });
            const serializedTasks = _.map(result.data, serializeTask);
            const refTasks = extendTasks(serializedTasks, result.taskRefs);

            return {
                ...state,
                issuedTasksIsLoading: false,
                issuedTasks: refTasks,
                issuedTotalTasks: _.get(result, 'paging.totalItems'),
                assignedBy: result.assignedBy,
                assignee: result.assignee,
                organizations: result.organizations
            };
        }

        case CLEAR_ISSUED_TASKS: {
            return {
                ...state,
                issuedTasksIsLoading: false,
                issuedTasks: []
            };
        }

        case `${GET_RECENT_TASKS}_FULFILLED`:
            return {
                ...state,
                recentTasks: action.payload.data.data
            };

        case CLEAR_RECENT_TASKS:
            return {
                ...state,
                recentTasks: null
            };

        case UPDATE_ISSUED_TASKS: {
            const { task } = action.payload;
            const clonedIssuedTasks = _.clone(state.issuedTasks);
            _.remove(clonedIssuedTasks, issuedTask => {
                return issuedTask.wfInstanceId === task.wfInstanceId;
            });
            return {
                ...state,
                issuedTasksIsLoading: false,
                issuedTasks: clonedIssuedTasks
            };
        }

        default:
            return state;
    }
}
