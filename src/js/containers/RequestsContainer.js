// @flow
import _ from 'lodash';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import {
    fetchFilteredRequests,
    createRequest,
    updateRequest
} from 'actions/ActionRequests';

type Request = Object;
export type ContainerProps = {
    allRequests: Array<Request>,
    totalRequests: number,
    isLoading: boolean,
    requestTask: Object,
    activeOrg: Object,
    fetchFilteredRequests: Object => Promise<Request>,
    createRequest: Request => Promise<Request>,
    updateRequest: Request => Promise<Request>
};

export type Args = {
    fetchAll?: boolean,
    fetchFilteredRequests?: boolean,
    omit?: Array<string>,
    params?: Object
};

const TasksContainer = (args: Args) =>
    compose(
        connect(
            (store, parentProps) => {
                const props = {
                    allRequests: store.allRequests.allRequests,
                    totalRequests: store.allRequests.totalRequests,
                    isLoadingRequests:
                        store.allRequests.isLoadingRequests ||
                        parentProps.isLoadingRequests,
                    requestTask: store.allRequests.requestTask,
                    activeOrg: store.access.activeOrg
                };

                return args && args.omit ? _.omit(props, args.omit) : props;
            },
            {
                fetchFilteredRequests,
                createRequest,
                updateRequest
            }
        ),
        lifecycle({
            componentDidMount() {
                if (args) {
                    if (args.fetchFilteredRequests) {
                        this.props.fetchFilteredRequests(args.params);
                    }
                }
            }
        })
    );

export default TasksContainer;
