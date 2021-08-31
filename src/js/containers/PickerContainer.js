// @flow
import _ from 'lodash';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import {
    fetchFolder,
    addItem,
    removeItem,
    clearPicker
} from 'actions/ActionPicker';

import type { Node } from 'types/repoTypes';

export type Args = {
    fetchAFolder: boolean,
    params?: Object,
    omit?: Array<string>
};

export type ContainerProps = {
    items: Array<Node>,
    breadcumb: Array<Node>,
    chosen: Node,
    isItemsLoading: Boolean,
    fetchFolder: (
        { nodeRef: string } | { nodeName: string }
    ) => Promise<Object>,
    addItem: Node => null,
    removeItem: string => null,
    clearPicker: () => null
};

const PickerContainer = (args: Args) =>
    compose(
        connect(
            (store, parentProps) => {
                const props = {
                    items: store.picker.items,
                    breadcumb: store.picker.breadcrumb,
                    chosen: store.picker.chosen,
                    isItemsLoading:
                        store.picker.isItemsLoading || parentProps.isLoading
                };

                return args && args.omit ? _.omit(props, args.omit) : props;
            },
            {
                fetchFolder,
                addItem,
                removeItem,
                clearPicker
            }
        ),
        lifecycle({
            componentDidMount() {
                if (args) {
                    if (args.fetchAFolder && args.params)
                        this.props.fetchFolder({
                            nodeRef: args.params.nodeRef,
                            nodeName: args.params.nodeName
                        });
                }
            }
        })
    );

export default PickerContainer;
