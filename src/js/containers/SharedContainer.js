// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
    fetchShared,
    fetchSharedUsers,
    clearShared
} from 'actions/ActionShared';
import type { Type } from 'actions/ActionShared';

import type { Node as NodeType } from 'types/repoTypes';

/**
 * Selector function that returns a value from the component's own props
 * @arg Object - component's own props
 */
type PropsSelector = Object => string;

export type ContainerArgs = {
    type?: string | PropsSelector,
    fetchSharedUsers?: boolean | (Object => boolean)
};

export type ContainerProps = {
    fetchShared: (type: Type) => Promise<{ data: Array<NodeType> }>,
    fetchSharedUsers: Function,
    clearShared: Function,
    isLoadingShared: boolean,
    shared: Array<NodeType>,
    sharedModifiers: Array<any>
};

const RepoContainer = (args?: ContainerArgs) =>
    compose(
        connect(
            store => ({
                isLoadingShared: store.shared.isLoadingShared,
                isLoadingSharedUsers: store.shared.isLoadingSharedUsers,
                shared: store.shared.shared,
                sharedModifiers: store.shared.modifiers
            }),
            {
                fetchShared,
                fetchSharedUsers,
                clearShared
            }
        ),
        lifecycle({
            componentDidMount() {
                if (args && !_.isNil(args.type)) {
                    let type = 'folder';
                    // $FlowFixMe
                    if (_.isFunction(args.type)) type = args.type(this.props);
                    else {
                        // eslint-disable-next-line prefer-destructuring
                        type = args.type;
                    }

                    this.props.fetchShared({ type });
                }

                if (args && args.fetchSharedUsers) {
                    let shouldGet = false;
                    if (_.isFunction(args.fetchSharedUsers)) {
                        // $FlowFixMe
                        shouldGet = args.fetchSharedUsers(this.props);
                    } else {
                        shouldGet = args.fetchSharedUsers;
                    }
                    if (shouldGet) this.props.fetchSharedUsers();
                }
            }
        })
    );

export default RepoContainer;
