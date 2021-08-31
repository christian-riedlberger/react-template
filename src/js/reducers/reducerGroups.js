// @flow
import {
    FETCH_GROUPS,
    SAVE_GROUP,
    DELETE_GROUP,
    FETCH_GROUP,
    CLEAR_ACTIVE_GROUP,
    FETCH_GROUPS_BROWSE,
    FETCH_CHILDREN,
    DELETE_ITEM_FROM_GROUP,
    ADD_TO_GROUP,
    FETCH_GROUPS_FULL,
    CLEAR_BROWSE_GROUP,
    CLEAR_FETCH_GROUP,
    CLEAR_GROUP_HISTORY,
    PUSH_GROUP_HISTORY,
    UPDATE_GROUP_AT_INDEX,
    DELETE_GROUP_HISTORY,
    UPDATE_SEARCH_TERM,
    FETCH_ORGANIZATIONS,
    RESET_GROUPS,
    UPLOAD_AVATAR,
    UPDATE_GROUP_LIST
} from 'constants/ActionTypes';
import _ from 'lodash';

/**
 * Groups reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        groups: [],
        history: [],
        activeGroup: null,
        reloadNeeded: false,
        browseResult: null,
        totalItems: 0,
        searchTerm: '',
        organizations: [],
        isLoading: false,
        avatar: null,
        activeGroupIsLoading: false
    },
    action: Object
) {
    switch (action.type) {
        case CLEAR_ACTIVE_GROUP:
            return {
                ...state,
                activeGroup: null
            };

        case CLEAR_BROWSE_GROUP:
            return {
                ...state,
                browseResult: _.get(action, 'payload.filter')
                    ? _.filter(state.groups, action.payload.filter)
                    : []
            };

        case CLEAR_FETCH_GROUP: {
            const { groups } = state;
            let newGroups = [];
            if (action.payload) {
                const keys = _.keys(action.payload);
                let output = _.cloneDeep(groups);
                _.forEach(keys, k => {
                    output = _[k](groups, action.payload[k]);
                });

                newGroups = output;
            }

            return {
                ...state,
                groups: newGroups
            };
        }

        case RESET_GROUPS: {
            const start = action.payload;
            return {
                ...state,
                groups: [],
                history: [start],
                browseResult: null,
                searchTerm: ''
            };
        }

        case CLEAR_GROUP_HISTORY: {
            return {
                ...state,
                history: []
            };
        }

        case `${FETCH_GROUPS}_PENDING`:
            return {
                ...state,
                isLoading: true,
                reloadNeeded: false
            };

        case `${FETCH_GROUPS}_FULFILLED`: {
            const groupsList = action.payload.data.data;
            if (groupsList) {
                _.forEach(groupsList, g => {
                    const group = { ...g };
                    if (!group.displayName) {
                        group.displayName = group.shortName;
                    }
                });
            }
            return {
                ...state,
                isLoading: false,
                groups: _.concat(state.groups, action.payload.data.data),
                browseResult: null
            };
        }

        case `${FETCH_GROUPS_BROWSE}_FULFILLED`: {
            return {
                ...state,
                isLoading: false,
                browseResult: action.payload.data.data
            };
        }

        case UPDATE_GROUP_LIST: {
            return {
                ...state,
                isLoading: false,
                groups: _.concat(state.groups, action.payload.value.data.data)
            };
        }

        case `${ADD_TO_GROUP}_FULFILLED`: {
            const groups = _.cloneDeep(state.groups);
            return {
                ...state,
                isLoading: false,
                groups:
                    action.payload.data.status !== 200
                        ? groups
                        : _.concat(groups, action.payload.data.data)
            };
        }

        case `${FETCH_CHILDREN}_FULFILLED`: {
            return {
                ...state,
                isLoading: false,
                groups: _.concat(state.groups, action.payload.data.data)
            };
        }

        case `${FETCH_CHILDREN}_PENDING`:
            return {
                ...state,
                isLoading: true
            };

        case `${SAVE_GROUP}_PENDING`:
            return {
                ...state
            };

        case `${SAVE_GROUP}_FULFILLED`:
            return {
                ...state,
                activeGroup: null
            };

        case `${DELETE_GROUP}_PENDING`:
            return {
                ...state,
                isLoading: true
            };

        case `${DELETE_GROUP}_FULFILLED`: {
            _.remove(state.groups, group => {
                return group.shortName === action.payload.data;
            });
            return {
                ...state,
                reloadNeeded: true,
                groups: state.groups
            };
        }

        case `${DELETE_ITEM_FROM_GROUP}_FULFILLED`:
            return {
                ...state,
                isLoading: true
            };
        case `${FETCH_GROUP}_PENDING`: {
            return {
                ...state,
                activeGroupIsLoading: true,
                activeGroup: null
            };
        }
        case `${FETCH_GROUP}_FULFILLED`: {
            const result = action.payload.data.data;
            if (result) {
                result.isEditMode = true;
                if (!result.displayName) {
                    result.displayName = result.shortName;
                }
            }
            return {
                ...state,
                activeGroupIsLoading: false,
                activeGroup: result
            };
        }

        case `${FETCH_GROUPS_FULL}_FULFILLED`:
            return {
                ...state,
                browseResult: action.payload.data
            };

        case PUSH_GROUP_HISTORY: {
            return {
                ...state,
                history: _.concat(state.history, action.payload)
            };
        }

        case UPDATE_GROUP_AT_INDEX: {
            return {
                ...state,
                history: _.concat(
                    _.slice(state.history, 0, action.payload.index),
                    action.payload.group
                )
            };
        }

        case DELETE_GROUP_HISTORY: {
            return {
                ...state,
                history: _.slice(state.history, 0, action.payload.index)
            };
        }

        case UPDATE_SEARCH_TERM: {
            return {
                ...state,
                searchTerm: action.payload.term
            };
        }

        case `${FETCH_ORGANIZATIONS}_PENDING`:
            return {
                ...state,
                organizations: [],
                isLoading: true
            };

        case `${FETCH_ORGANIZATIONS}_FULFILLED`:
            return {
                ...state,
                organizations: action.payload.data.data,
                isLoading: false
            };

        case UPLOAD_AVATAR: {
            return {
                ...state,
                avatar: {
                    file: action.payload.file,
                    shortName: action.payload.shortName
                }
            };
        }

        default:
            return state;
    }
}
