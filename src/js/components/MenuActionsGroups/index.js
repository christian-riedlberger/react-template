/* eslint-disable react/jsx-indent */
// @flow
import React, { useRef, useState } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import clsx from 'clsx';
import { compose } from 'recompose';

import messages from 'constants/Messages';
import type { Group as GroupType } from 'types/groupTypes';
import MessageContainer from 'containers/MessageContainer';
import GroupsContainer from 'containers/GroupsContainer';
import UserContainer from 'containers/UserContainer';
import type { ContainerProps as GroupContainerProps } from 'containers/GroupsContainer';
import DialogGroupConfirm from 'components/DialogGroupConfirm';
import DialogGroup from 'components/DialogGroup';

type DefaultProps = {
    intl: intlShape
} & GroupContainerProps;

type Props = {
    group: GroupType,
    getGroups: Function,
    showMessage: Function,
    setActiveOrganization: Function,
    className?: string,
    useBrowse?: boolean,
    isOrganization: boolean,
    isOperation: boolean
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const MenuActionsGroups = (props: Props) => {
    const {
        intl,
        className,
        group,
        getGroups,
        isOrganization,
        isOperation,
        deleteGroup,
        fetchChildren,
        updateGroupAtIndex,
        history,
        useBrowse,
        searchTerm,
        clearBrowseGroups,
        fetchGroupsBrowse,
        resetGroups,
        showMessage,
        setActiveOrganization
    } = props;
    const classes = useStyles();
    const confirmGroupDialog = useRef(DialogGroupConfirm);
    const editGroupDialog = useRef(DialogGroup);
    const [action, setAction] = useState('');
    const isUser = group.authorityType === 'USER';

    const handleEdit = () => {
        editGroupDialog.current.open();
    };

    const handleSave = (returnGroup, message) => {
        editGroupDialog.current.close();
        showMessage({ message, variant: 'success' });
        if (useBrowse) {
            clearBrowseGroups();
            fetchGroupsBrowse({ term: searchTerm, type: 'group' });
        } else if (getGroups) {
            getGroups();
        } else {
            fetchChildren(group.parentName);
        }
        const historyIndex = _.findIndex(history, {
            shortName: returnGroup.shortName
        });
        if (historyIndex > -1) updateGroupAtIndex(returnGroup, historyIndex);
    };

    const handleDelete = () => {
        setAction('delete');
        confirmGroupDialog.current.open();
    };

    const handleRemove = () => {
        setAction('remove');
        confirmGroupDialog.current.open();
    };

    const handlePendingSnackMessage = () => {
        if (group.isOrganization && action === 'remove') {
            showMessage({ message: 'removeOrganization', variant: 'pending' });
        } else if (isUser) {
            showMessage({ message: 'removeUser', variant: 'pending' });
        } else if (!group.isOrganization) {
            if (action === 'remove') {
                showMessage({ message: 'removeGroup', variant: 'pending' });
            } else if (action === 'delete') {
                showMessage({ message: 'deleteGroup', variant: 'pending' });
            } else {
                showMessage({ message: 'snackError', variant: 'error' });
            }
        } else {
            showMessage({ message: 'snackError', variant: 'error' });
        }
    };

    const handleCompleteSnackMessage = () => {
        if (group.isOrganization && action === 'remove') {
            showMessage({
                message: 'removeOrganizationSuccess',
                variant: 'success'
            });
        } else if (isUser) {
            showMessage({ message: 'removeUserSuccess', variant: 'success' });
        } else if (!group.isOrganization) {
            if (action === 'remove') {
                showMessage({
                    message: 'removeGroupSuccess',
                    variant: 'success'
                });
            } else if (action === 'delete') {
                showMessage({
                    message: 'deleteGroupSuccess',
                    variant: 'success'
                });
            } else {
                showMessage({ message: 'snackError', variant: 'error' });
            }
        } else {
            showMessage({ message: 'snackError', variant: 'error' });
        }
    };

    const handleConfirm = () => {
        const organizationID =
            history && history.length > 1 ? history[1].shortName : null;

        handlePendingSnackMessage();

        (action === 'remove'
            ? deleteGroup(
                group.shortName,
                group.parentName,
                organizationID,
                isUser
            )
            : deleteGroup(group.shortName)
        )
            .then(() => {
                handleCompleteSnackMessage();
                confirmGroupDialog.current.close();
                if (
                    isUser &&
                    group.shortName === localStorage.getItem('auth:username')
                ) {
                    setActiveOrganization(organizationID)
                        .then(resp => {
                            if (
                                resp.action.payload.data.activeOrg.shortName !==
                                organizationID
                            ) {
                                resetGroups(history[0]);
                                fetchChildren(history[0], 'combined');
                            }
                            return null;
                        })
                        .catch(e => {
                            throw e;
                        });
                } else {
                    if (useBrowse) {
                        fetchGroupsBrowse({
                            term: searchTerm,
                            type: 'group'
                        });
                    } else if (getGroups) {
                        getGroups();
                    } else {
                        fetchChildren(group.parentName, 'combined');
                    }

                    const historyIndex = _.findIndex(history, {
                        shortName: group.parentName
                    });
                    if (historyIndex > -1)
                        updateGroupAtIndex(history[historyIndex], historyIndex);
                }
                return null;
            })
            .catch(e => {
                setAction('error');
                throw e;
            });
    };

    return (
        <React.Fragment>
            <List className={clsx(classes.root, className)}>
                {!isUser && !group.isOrganization && (
                    <ListItem button onClick={handleEdit} className="cy-edit">
                        <ListItemText
                            primary={intl.formatMessage(messages.edit)}
                        />
                    </ListItem>
                )}
                {!isUser && !group.isRestricted && !group.isOrganization ? (
                    <ListItem
                        button
                        onClick={handleDelete}
                        className="cy-delete"
                    >
                        <ListItemText
                            primary={intl.formatMessage(messages.delete)}
                        />
                    </ListItem>
                ) : null}
                {_.includes(group.parentName, 'ORGANIZATION') &&
                !group.isOrganization ? null : (
                        <ListItem
                            button
                            onClick={handleRemove}
                            className="cy-remove"
                        >
                            <ListItemText
                                primary={intl.formatMessage(messages.remove)}
                            />
                        </ListItem>
                    )}
            </List>
            <DialogGroupConfirm
                group={group}
                onConfirm={handleConfirm}
                passRef={confirmGroupDialog}
                action={action}
            />
            <DialogGroup
                shortName={group.shortName}
                onSave={handleSave}
                passRef={editGroupDialog}
                isOrganization={isOrganization}
                isOperation={isOperation}
            />
        </React.Fragment>
    );
};

export default compose(
    injectIntl,
    GroupsContainer(),
    MessageContainer(),
    UserContainer({})
)(MenuActionsGroups);
