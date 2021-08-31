// @flow
import _ from 'lodash';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import {
    fetchAllTasks,
    createRequest,
    updateRequest,
    clearAllTasks,
    fetchFilteredTasks,
    fetchPackage,
    fetchTaskAuthorities,
    fetchTask,
    clearActiveTask,
    updateTask,
    fetchWorkflowDefinition,
    fetchIssuedTasks,
    fetchReceivedTasks,
    clearIssuedTasks,
    clearReceivedTasks,
    cancelWorkflowInstance,
    fetchInstanceDetails
} from 'actions/ActionTasks';

import {
    getRecentTasks,
    pushRecentTask,
    clearRecentTasks
} from 'actions/ActionRecents';

export type Args = {
    fetchAll?: boolean,
    fetchFilteredTasks: boolean,
    fetchReceivedTasks: boolean,
    fetchIssuedTasks: boolean,
    omit?: Array<string>,
    pick?: Array<string>,
    params?: Object | Function
};

type Task = {};

export type ContainerProps = {
    alltasks: Array<Task>,
    totalTasks: number,
    isLoading: boolean,
    requestTask: Object,
    organizations: Array<Object>,
    organizationsTo: string,
    organizationsBy: string,
    assignedBy: string,
    assignedTo: string,
    isAllTasksLoading: boolean,
    isLoadingTaskAuthorities: boolean,
    isLoadingWorkflowDetails: boolean,
    instanceTasks: Array<Object>,
    activeTask: Task,
    clearActiveTask: () => void,
    isLoadingFetchTask: boolean,
    isLoadingPackage: boolean,
    activeOrg: Object,
    fetchAllTasks: Object => Promise<Object>,
    fetchFilteredTasks: Object => Promise<Object>,
    createRequest: Task => Promise<Object>,
    updateRequest: Task => Promise<Object>,
    clearAllTasks: () => void,
    fetchTaskAuthorities: Object => Promise<Object>,
    fetchTask: Task => Promise<Object>,
    updateTask: Task => Promise<Object>,
    fetchFilteredTasks: Object => Promise<Object>,

    fetchIssuedTasks: Object => Promise<Object>,
    clearIssuedTasks: () => void,
    issuedTasks: Array<Task>,
    issuedTasksIsLoading: boolean,
    issuedTotalTasks: number,

    fetchReceivedTasks: Object => Promise<Object>,
    clearReceivededTasks: () => void,
    receivedTasks: Array<Object>,
    receivedTasksIsLoading: boolean,
    receivedTotalTasks: number,
    serverMessage: Array<string>,
    getRecentTasks: Function,
    pushRecentTask: Function,
    clearRecentTasks: Function,
    cancelWorkflowInstance: () => void
};

const TasksContainer = (args?: Args) =>
    compose(
        connect(
            (store, parentProps) => {
                const props = {
                    alltasks: store.alltasks.alltasks,
                    totalTasks: store.alltasks.allTotalTasks,
                    isLoading:
                        store.alltasks.isLoading || parentProps.isLoading,
                    requestTask: store.alltasks.requestTask,
                    organizations: store.alltasks.organizations,
                    organizationsTo: store.alltasks.organizationsTo,
                    organizationsBy: store.alltasks.organizationsBy,
                    assignedBy: store.alltasks.assignedBy,
                    assignedTo: store.alltasks.assignedTo,
                    isAllTasksLoading: store.alltasks.isAllTasksLoading,
                    isLoadingTaskAuthorities:
                        store.alltasks.isLoadingTaskAuthorities,
                    activeTask: store.alltasks.activeTask,
                    isLoadingFetchTask: store.alltasks.isLoadingFetchTask,
                    isLoadingPackage: store.alltasks.isLoadingPackage,
                    packages: store.alltasks.packages,
                    activeOrg: store.access.activeOrg,
                    issuedTasks: store.alltasks.issuedTasks,
                    issuedTasksIsLoading: store.alltasks.issuedTasksIsLoading,
                    issuedTotalTasks: store.alltasks.issuedTotalTasks,
                    receivedTasks: store.alltasks.receivedTasks,
                    receivedTasksIsLoading:
                        store.alltasks.receivedTasksIsLoading,
                    receivedTotalTasks: store.alltasks.receivedTotalTasks,
                    serverMessage: store.alltasks.serverMessage,
                    recentTasks: store.alltasks.recentTasks,
                    instanceTasks: store.alltasks.instanceTasks,
                    isLoadingWorkflowDetails: store.alltasks.isLoadingWorkflowDetails,
                };

                return args && args.omit ? _.omit(props, args.omit) : props;
            },
            {
                fetchAllTasks,
                fetchPackage,
                fetchFilteredTasks,
                createRequest,
                updateRequest,
                clearAllTasks,
                fetchTaskAuthorities,
                fetchTask,
                clearActiveTask,
                updateTask,
                fetchWorkflowDefinition,
                fetchReceivedTasks,
                clearReceivedTasks,
                fetchIssuedTasks,
                clearIssuedTasks,
                getRecentTasks,
                pushRecentTask,
                clearRecentTasks,
                cancelWorkflowInstance,
                fetchInstanceDetails
            }
        ),
        lifecycle({
            componentDidMount() {
                if (args) {
                    const actionArgs = _.isFunction(args.params)
                        ? // $FlowFixMe
                        args.params(this.props)
                        : args.params;

                    // @TODO remove me
                    if (args.fetchAll) this.props.fetchAllTasks(actionArgs);

                    // $FlowFixMe
                    if (args.fetchTaskAuthorities)
                        this.props.fetchTaskAuthorities(actionArgs);

                    if (args.fetchFilteredTasks) {
                        this.props.fetchFilteredTasks(actionArgs);
                    }

                    if (args.fetchReceivedTasks) {
                        this.props.fetchReceivedTasks(actionArgs);
                    }

                    if (args.fetchIssuedTasks) {
                        this.props.fetchIssuedTasks(actionArgs);
                    }

                    // $FlowFixMe
                    if (args.fetchTask) {
                        if (_.isFunction(args.fetchTask)) {
                            // $FlowFixMe
                            const a = args.fetchTask(this.props);
                            if (_.isArray(a)) {
                                this.props.fetchTask(...a);
                            } else {
                                this.props.fetchTask(a);
                            }
                        }
                    }
                }
            }
        })
    );

export default TasksContainer;
