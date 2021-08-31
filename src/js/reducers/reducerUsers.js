// @flow
import _ from 'lodash';
import {
    FETCH_USERS,
    DELETE_USER,
    FETCH_USER,
    FETCH_USER_PROFILE,
    ADD_USER,
    EDIT_USER,
    CLEAR_SELECTED_USERS,
    CLEAR_ACTIVE_USER,
    FETCH_GROUPS_FOR_USER,
    CLEAR_GROUPS_FOR_USER,
    SAVE_USER_PROFILE,
    SET_ACTIVE_ORGANIZATION,
    SET_ACTIVE_ORGANIZATION_DONE,
    FETCH_ACCESS
} from 'constants/ActionTypes';

export default function(
    state: Object = {
        users: [],
        selectedUsers: [],
        activeUser: null,
        isFirstLoad: true,
        isLoading: false,
        reloadNeeded: false,
        groupsForUser: [],
        pagination: {
            totalItems: 0,
            maxItems: 0,
            skipCount: 0,
            page: 0
        },
        userProfile: null,
        orgIndex: 0,
        activeOrg: null,
        activeOrgChange: false,
        organizations: [],
        organizationNames: []
    },
    action: Object
) {
    switch (action.type) {
        case `${FETCH_USERS}_PENDING`:
            return {
                ...state,
                reloadNeeded: false,
                isLoading: true,
                users: []
            };
        case CLEAR_SELECTED_USERS:
            return {
                ...state,
                selectedUsers: []
            };

        case `${FETCH_USERS}_FULFILLED`: {
            const users = action.payload.data.data;

            const { selectedUsers } = state;
            if (selectedUsers.length !== 0) {
                for (let i = 0; i < selectedUsers.length; i += 1) {
                    if (
                        !_.some(
                            users,
                            user => user.userName === selectedUsers[i]
                        )
                    ) {
                        selectedUsers.splice(i, 1);
                        i -= 1;
                    }
                }
            }
            return {
                ...state,
                isLoading: false,
                isFirstLoad: false,
                needsReset: false,
                users,
                pagination: action.payload.data.paging,
                selectedUsers
            };
        }
        case `${FETCH_USERS}_REJECTED`:
            return {
                ...state,
                isLoading: false
            };

        case `${FETCH_GROUPS_FOR_USER}_FULFILLED`:
            return {
                ...state,
                groupsForUser: action.payload.data.data
            };

        case CLEAR_GROUPS_FOR_USER:
            return {
                ...state,
                groupsForUser: []
            };

        case `${FETCH_USER}_FULFILLED`: {
            const result = action.payload.data;
            result.isEditMode = true;
            return {
                ...state,
                activeUser: result
            };
        }

        case `${FETCH_USER}_REJECTED`: {
            return {
                ...state,
                serverMessage: ['errorMissingUser']
            };
        }

        case `${FETCH_USER_PROFILE}_FULFILLED`: {
            const result = action.payload.data;
            return {
                ...state,
                userProfile: result
            };
        }

        case CLEAR_ACTIVE_USER:
            return {
                ...state,
                activeUser: null
            };

        case `${EDIT_USER}_FULFILLED`:
            return {
                ...state,
                activeUser: null,
                groupsForUser: [],
                reloadNeeded: true
            };

        case `${EDIT_USER}_REJECTED`:
            return {
                ...state,
                activeUser: {
                    ...state.activeUser,
                    error: action.payload.message
                }
            };

        case `${ADD_USER}_FULFILLED`:
            return {
                ...state,
                activeUser: null,
                groupsForUser: [],
                reloadNeeded: true
            };

        case `${ADD_USER}_REJECTED`:
            return {
                ...state,
                activeUser: {
                    ...state.activeUser,
                    error: action.payload.response.data.message
                }
            };

        case `${DELETE_USER}`:
            return {
                ...state,
                needsReset: true
            };

        // case `${DELETE_USER}`:
        //         return {
        //             ...state,
        //             users: _.filter(state.users, user => {
        //                 return _.isArray(action.payload.userName)
        //                     ? !(
        //                         _.indexOf(
        //                             action.payload.userName,
        //                             user.userName
        //                         ) > -1
        //                     )
        //                     : user.UserName !== action.payload.userName;
        //             })
        //         };

        case `${SAVE_USER_PROFILE}_FULFILLED`:
            return {
                ...state
            };

        case `${SAVE_USER_PROFILE}_REJECTED`:
            return {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    error: action.payload.response.data.message
                }
            };

        case `${SET_ACTIVE_ORGANIZATION}_PENDING`: {
            return {
                ...state,
                isLoading: true
            };
        }

        case `${SET_ACTIVE_ORGANIZATION}_FULFILLED`: {
            localStorage.setItem(
                'org:active',
                action.payload.data.activeOrg.shortName
            );
            return {
                ...state,
                activeOrg: action.payload.data.activeOrg,
                organizations: _.get(action, 'payload.data.organizations', []),
                organizationNames: _.get(
                    action,
                    'payload.data.organizationNames',
                    []
                ),
                activeOrgChange: true,
                isLoading: false
            };
        }

        case `${SET_ACTIVE_ORGANIZATION}_REJECTED`: {
            return {
                ...state,
                isLoading: false
            };
        }

        case SET_ACTIVE_ORGANIZATION_DONE:
            return {
                ...state,
                isLoading: false,
                activeOrgChange: false
            };

        case FETCH_ACCESS: {
            const activeOrg = _.get(action, 'payload.data.activeOrg');

            return {
                ...state,
                activeOrg,
                organizations: _.get(action, 'payload.data.organizations', []),
                organizationNames: _.get(
                    action,
                    'payload.data.organizationNames',
                    []
                )
            };
        }

        default:
            return state;
    }
}
