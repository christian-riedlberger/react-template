// @flow
import _ from 'lodash';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import {
    fetchVersionHistory,
    uploadNewVersion
} from 'actions/ActionVersionHistory';

export type Args = {
    nodeRef?: string,
    omit?: Array<string>,
    description?: string
};

export type ContainerProps = {
    versionHistory: Array<Object>,
    fetchVersionHistory: Function
};

const VersionHistoryContainer = (args: Args) =>
    compose(
        connect(
            (store, parentProps) => {
                const props = {
                    versionHistory: store.versionHistory.versionHistory,
                    isLoading:
                        store.versionHistory.isLoading || parentProps.isLoading
                };

                // $FlowFixMe
                if (args && args.pick) return _.pick(props, args.pick);
                if (args && args.omit) return _.omit(props, args.omit);

                return props;
            },
            {
                fetchVersionHistory,
                uploadNewVersion
            }
        ),
        lifecycle({
            componentDidMount() {
                if (args) {
                    if (args.nodeRef) {
                        this.props.fetchVersionHistory(args.nodeRef);
                    }
                }
            }
        })
    );

export default VersionHistoryContainer;
