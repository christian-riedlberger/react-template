// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
    fetchUser,
    fetchUsers,
    fetchUserProfile,
    clearActiveUser,
    deleteUser,
    editUser,
    addUser,
    uploadAvatar,
    fetchGroupsForUser,
    clearGroupsForUser,
    setActiveOrganization,
    setActiveOrganizationDone
} from 'actions/ActionUsers';
import type { Group as GroupType } from 'types/groupTypes';
import type { User as UserType } from 'types/userTypes';

export type Args = {
    userName?: string | (Object => string), // props selector
    fetchAll?: boolean,
    omit?: Array<string>
};

export type ContainerProps = {
    users: Array<UserType>,
    activeUser: UserType,
    userProfile: UserType,
    isLoading: boolean,
    pagination: Object,
    availableGroups: Array<GroupType>,
    serverError: string | null,
    fetchUser: Function,
    fetchUsers: Function,
    fetchUserProfile: Function,
    clearActiveUser: Function,
    deleteUser: Function,
    editUser: Function,
    addUser: Function,
    uploadAvatar: Function,
    fetchGroupsForUser: Function,
    clearGroupsForUser: Function,
    setActiveOrganization: Function,
    setActiveOrganizationDone: Function,
    serverMessage: Array<string>,
    organizationNames: Array<string>
};

const UserContainer = (args: Args) =>
    compose(
        connect(
            store => {
                const returnProps = {
                    users: store.users.users,
                    activeUser: store.users.activeUser,
                    userProfile: store.users.userProfile,
                    // allow isLoading props to pass through container
                    isLoading: store.users.isLoading,
                    availableGroups: store.users.groupsForUser,
                    serverError: _.get(store, 'users.activeUser.error', null),
                    orgIndex: store.users.orgIndex,
                    activeOrg: store.users.activeOrg,
                    activeOrgChange: store.users.activeOrgChange,
                    organizations: store.users.organizations,
                    pagination: store.users.pagination,
                    serverMessage: store.users.serverMessage,
                    organizationNames: store.users.organizationNames
                };

                // $FlowFixMe
                if (args && args.pick) return _.pick(returnProps, args.pick);
                // $FlowFixMe
                if (args && args.omit) return _.omit(returnProps, args.omit);
                return returnProps;
            },
            {
                fetchUser,
                fetchUsers,
                fetchUserProfile,
                clearActiveUser,
                deleteUser,
                editUser,
                addUser,
                uploadAvatar,
                fetchGroupsForUser,
                clearGroupsForUser,
                setActiveOrganization,
                setActiveOrganizationDone
            }
        ),
        lifecycle({
            componentDidMount() {
                if (args && args.userName) {
                    // $FlowFixMe
                    const param = args.userName(this.props);
                    if (param) this.props.fetchUser(param);
                }
                // $FlowFixMe
                if (args && args.fetchAll && !args.params)
                    this.props.fetchUsers();

                // $FlowFixMe
                if (args && args.fetchAll && args.params)
                    this.props.fetchUsers(args.params);

                // $FlowFixMe
                if (args && args.userName && args.deleteSingleUser)
                    this.props.deleteUser(args.userName);

                // $FlowFixMe
                if (args && args.userProfile) this.props.fetchUserProfile();
            }
        })
    );

export default UserContainer;
