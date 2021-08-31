// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
    fetchGroups,
    fetchGroup,
    saveGroup,
    clearActiveGroup,
    deleteGroup,
    fetchGroupsBrowse,
    clearFetchGroups,
    clearBrowseGroups,
    clearGroupHistory,
    addExistingItemToGroup,
    fetchChildren,
    pushGroupHistory,
    updateGroupAtIndex,
    deleteGroupHistory,
    updateSearchTerm,
    resetGroups
} from 'actions/ActionGroups';

import {
    fetchOrganizations,
    fetchOrgChildren,
    saveOrganization,
    uploadAvatar
} from 'actions/ActionOrganizations';

import { fetchOpChildren, saveOperation } from 'actions/ActionOperations';

import type {
    Group as GroupType,
    Organization as OrgType
} from 'types/groupTypes';

export type ContainerArgs = {
    fetchAll?: boolean,
    parentName?: Function | string,
    parent?: Function | Object,
    parentType?: Function | Object,
    shortName?: Object => string, // props selector
    initHistory?: Array<GroupType>,
    params?: Object,
    pick?: Array<string>,
    omit?: Array<string>,
    selector?: Object => Object
};

export type ContainerProps = {
    fetchGroups: Function,
    fetchGroup: Function,
    saveGroup: Function,
    fetchOrganizations: Function,
    saveOrganization: Function,
    saveOperation: Function,
    clearActiveGroup: Function,
    deleteGroup: Function,
    fetchGroupsBrowse: Function,
    clearFetchGroups: Function,
    clearBrowseGroups: Function,
    clearGroupHistory: Function,
    addExistingItemToGroup: Function,
    fetchChildren: Function,
    fetchOrgChildren: Function,
    fetchOpChildren: Function,
    pushGroupHistory: Function,
    groups: Array<GroupType>,
    browseResult: Array<GroupType>,
    activeGroup: GroupType & OrgType,
    isLoading: boolean,
    history: Array<GroupType>,
    updateGroupAtIndex: Function,
    deleteGroupHistory: Function,
    updateSearchTerm: Function,
    searchTerm: string,
    uploadAvatar: Function,
    resetGroups: Function,
    activeOrg: Object,
    activeGroupIsLoading: boolean
};

const GroupsContainer = (args?: ContainerArgs) => {
    const selector = (store, props) => ({
        activeOrg: store.access.activeOrg,
        groups: store.groups.groups,
        history: store.groups.history,
        isLoading: store.groups.isLoading || props.isLoading,
        activeGroup: store.groups.activeGroup,
        browseResult: store.groups.browseResult,
        searchTerm: store.groups.searchTerm,
        avatar: store.groups.avatar,
        userProfile: store.users.userProfile,
        activeGroupIsLoading: store.groups.activeGroupIsLoading
    });
    let actions = {
        fetchGroups,
        fetchOrganizations,
        fetchGroup,
        saveGroup,
        saveOrganization,
        saveOperation,
        clearActiveGroup,
        deleteGroup,
        fetchGroupsBrowse,
        clearFetchGroups,
        clearBrowseGroups,
        clearGroupHistory,
        addExistingItemToGroup,
        fetchChildren,
        fetchOrgChildren,
        fetchOpChildren,
        pushGroupHistory,
        updateGroupAtIndex,
        deleteGroupHistory,
        updateSearchTerm,
        uploadAvatar,
        resetGroups
    };

    if (args && !_.isEmpty(args.omit)) actions = _.omit(actions, args.omit);
    if (args && !_.isEmpty(args.pick)) actions = _.pick(actions, args.pick);

    return compose(
        // $FlowFixMe
        connect(
            args && args.selector ? args.selector : selector,
            actions
        ),
        lifecycle({
            componentDidMount() {
                if (args && !_.isUndefined(args.parent)) {
                    let { parent, parentType } = args;
                    if (_.isFunction(args.parent))
                        // $FlowFixMe
                        parent = args.parent(this.props);
                    if (_.isFunction(args.parentType))
                        // $FlowFixMe
                        parentType = args.parentType(this.props);
                    if (parent) {
                        // $FlowFixMe
                        if (parentType.isOrganization)
                            this.props.fetchOrgChildren(
                                parent.shortName,
                                args.params
                            );
                        else
                            this.props.fetchChildren(
                                parent.shortName,
                                args.params
                            );
                    }
                }
                if (args && args.fetchAll) this.props.fetchGroups();
                if (args && args.shortName) {
                    const shortName = args.shortName(this.props);
                    if (shortName) this.props.fetchGroup(shortName);
                }
                if (args && !_.isUndefined(args.initHistory))
                    this.props.pushGroupHistory(args.initHistory);
            }
        })
    );
};

export default GroupsContainer;
