// @flow
import _ from 'lodash';
import {
    FETCH_PICKER_FOLDER,
    CLEAR_PICKER_ACTIVE,
    ADD_PICKER_ITEM,
    REMOVE_PICKER_ITEM
} from 'constants/ActionTypes';

/**
 * Folder reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        items: [],
        chosen: [],
        isItemsLoading: false
    },
    action: Object
) {
    switch (action.type) {
        /**
         *  Pending picker selection
         */
        case `${FETCH_PICKER_FOLDER}_PENDING`:
            return {
                ...state,
                isItemsLoading: true,
                items: []
            };

        /**
         *  Populate picker selection
         */
        case `${FETCH_PICKER_FOLDER}_FULFILLED`: {
            const children = _.get(action, 'payload.data.data.children', []);
            const files = _.get(action, 'payload.data.data.files', []);

            return {
                ...state,
                isItemsLoading: false,
                items: _.concat(
                    children,
                    _.map(files, file => ({
                        ...file,
                        disabled: _.find(state.selectedItems, {
                            nodeRef: file.nodeRef
                        })
                    }))
                )
            };
        }

        /**
         *  Populate picker selection
         */
        case ADD_PICKER_ITEM:
            return {
                ...state,
                chosen: _.concat(state.chosen, action.node)
            };

        /**
         *  Remove picker selection
         */
        case REMOVE_PICKER_ITEM:
            return {
                ...state,
                chosen: _.remove(
                    state.chosen,
                    a => a.nodeRef !== action.nodeRef
                )
            };

        /**
         *  Clear picker
         */
        case CLEAR_PICKER_ACTIVE:
            return {
                ...state,
                items: [],
                chosen: []
            };

        default:
            return state;
    }
}
