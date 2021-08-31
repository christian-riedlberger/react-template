// @flow
import _ from 'lodash';
import {
    FETCH_TRASHCAN_NODES,
    TOGGLE_TRASHCAN_NODE,
    DELETE_TRASHCAN_NODES,
    RECOVER_TRASHCAN_NODES,
    EMPTY_TRASHCAN,
    CLEAR_SELECTED_NODES
} from 'constants/ActionTypes';

export default function(
    state: Object = {
        nodes: [],
        selectedNodes: [],
        reloadNeeded: false,
        isLoading: false,
        isFirstLoad: true,
        error: null
    },
    action: Object
) {
    switch (action.type) {
        case TOGGLE_TRASHCAN_NODE: {
            const { isSelected, nodeRef } = action.payload;
            let selectedNodes = _.clone(state.selectedNodes);

            if (isSelected) {
            // Add
                if (state.selectedNodes.indexOf(nodeRef) === -1) {
                    selectedNodes.push(nodeRef);
                }
            } else {
            // Remove
                selectedNodes = _.remove(
                    state.selectedNodes,
                    n => n !== nodeRef
                );
            }

            return {
                ...state,
                selectedNodes
            };
        }
        case `${FETCH_TRASHCAN_NODES}_PENDING`: {
            return {
                ...state,
                isLoading: true,
                reloadNeeded: false,
                error: null
            };
        }
        case `${FETCH_TRASHCAN_NODES}_FULFILLED`: {
            const nodes = action.payload.data.data.deletedNodes;
            const { selectedNodes } = state;
            if (selectedNodes.length !== 0) {
                for (let i = 0; i < selectedNodes.length; i += 1) {
                    if (
                        !_.some(nodes, node => node.nodeId === selectedNodes[i])
                    ) {
                        selectedNodes.splice(i, 1);
                        i -= 1;
                    }
                }
            }
            return {
                ...state,
                isLoading: false,
                isFirstLoad: false,
                nodes,
                totalItems: action.payload.data.paging.totalItems,
                selectedNodes
            };
        }
        case `${DELETE_TRASHCAN_NODES}_PENDING`: {
            return {
                ...state,
                isLoading: true
            };
        }
        case `${DELETE_TRASHCAN_NODES}_FULFILLED`: {
            return {
                ...state,
                reloadNeeded: true
            };
        }
        case `${DELETE_TRASHCAN_NODES}_REJECTED`: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        }
        case `${RECOVER_TRASHCAN_NODES}_PENDING`: {
            return {
                ...state,
                isLoading: true
            };
        }
        case `${RECOVER_TRASHCAN_NODES}_FULFILLED`: {
            return {
                ...state,
                reloadNeeded: true
            };
        }
        case `${RECOVER_TRASHCAN_NODES}_REJECTED`: {
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        }
        case `${EMPTY_TRASHCAN}_PENDING`: {
            return {
                ...state,
                isLoading: true
            };
        }
        case `${EMPTY_TRASHCAN}_FULFILLED`: {
            return {
                ...state,
                reloadNeeded: true
            };
        }
        case CLEAR_SELECTED_NODES:
            return {
                ...state,
                selectedNodes: []
            };

        default:
            return state;
    }
}
