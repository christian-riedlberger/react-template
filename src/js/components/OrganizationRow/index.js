// @flow
import React, { useRef, useState, useEffect } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import clsx from 'clsx';
import _ from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';

// MUI
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import {
    usePopupState,
    bindTrigger,
    bindPopover
} from 'material-ui-popup-state/hooks';

// Components
import DialogGroupConfirm from 'components/DialogGroupConfirm';
import DialogOrganization from 'components/DialogOrganization';

// Containers
import MessageContainer from 'containers/MessageContainer';
import GroupsContainer from 'containers/GroupsContainer';
import UserContainer from 'containers/UserContainer';

// Other
import type { Group as GroupType } from 'types/groupTypes';
import messages from 'constants/Messages';
import { getAvatarUrl } from 'utils/avatar';

type DefaultProps = {
    intl: intlShape,
    history: Array<Object>,
    deleteGroup: Function,
    fetchOrgChildren: Function,
    useBrowse: Boolean,
    access: Object,
    searchTerm: String,
    clearBrowseGroups: Function,
    fetchGroupsBrowse: Function,
    updateGroupAtIndex: Function,
    showMessage: Function,
    group: Object,
    avatar: Object,
    setActiveOrganization: Function
};

type Props = {
    group: GroupType,
    history: Array<GroupType>,
    getOrganizations: Function,
    onClick: Function,
    isSelected?: boolean,
    columnIndex: number
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const OrganizationRow = (props: Props) => {
    const {
        intl,
        group,
        getOrganizations,
        setActiveOrganization,
        onClick,
        isSelected,
        updateGroupAtIndex,
        columnIndex,
        history,
        deleteGroup,
        fetchOrgChildren,
        useBrowse,
        access,
        searchTerm,
        clearBrowseGroups,
        fetchGroupsBrowse,
        showMessage,
        avatar
    } = props;
    const classes = useStyles();
    const popupState = usePopupState({
        variant: 'popover'
    });
    const confirmOrganizationDialog = useRef(DialogGroupConfirm);
    const editOrganizationDialog = useRef(DialogOrganization);

    // Administrator buttons
    const userIsAdmin = localStorage.getItem('auth:userIsAdmin') === 'true';
    const isActiveOrg = localStorage.getItem('org:active') === group.shortName;
    const hasAdminRights = access.sysAdmin || (userIsAdmin && isActiveOrg);

    // on create new org, intercept image data and load it into state
    const [image, setImage] = useState(null);
    useEffect(() => {
        if (!avatar) return;
        const { file, shortName } = avatar;
        if (!file) return;
        const reader = new FileReader();

        reader.onload = () => {
            setImage({
                dataUrl: reader.result,
                shortName
            });
        };
        reader.readAsDataURL(file);
    }, [avatar]);

    const handleEdit = () => {
        editOrganizationDialog.current.open();
    };

    const handleSave = (returnGroup, message) => {
        editOrganizationDialog.current.close();
        showMessage({ message, variant: 'success' });
        if (useBrowse) {
            clearBrowseGroups();
            fetchGroupsBrowse({ term: searchTerm, type: 'group' });
        } else if (getOrganizations) {
            getOrganizations();
        } else {
            fetchOrgChildren(group.parentName);
        }
        const historyIndex = _.findIndex(history, {
            shortName: returnGroup.shortName
        });
        if (historyIndex > -1) updateGroupAtIndex(returnGroup, historyIndex);
    };

    const handleDelete = () => {
        confirmOrganizationDialog.current.open();
    };

    const handleConfirm = () => {
        showMessage({ message: 'deleteOrganization', variant: 'pending' });
        deleteGroup(group.shortName)
            .then(() => {
                confirmOrganizationDialog.current.close();
                setActiveOrganization(group.shortName);
                if (useBrowse) {
                    fetchGroupsBrowse({
                        term: searchTerm,
                        type: 'group'
                    });
                } else if (getOrganizations) {
                    getOrganizations();
                } else {
                    fetchOrgChildren(group.parentName);
                }

                const historyIndex = _.findIndex(history, {
                    shortName: group.parentName
                });
                if (historyIndex > -1)
                    updateGroupAtIndex(history[historyIndex], historyIndex);
                showMessage({
                    message: 'deleteOrganizationSuccess',
                    variant: 'success'
                });
                return null;
            })
            .catch(e => {
                throw e;
            });
    };
    const handlePrimaryClick = () => {
        onClick(group);
        updateGroupAtIndex(group, columnIndex + 1);
    };

    return (
        <React.Fragment>
            <ListItem
                button
                key={group.nodeRef}
                onClick={handlePrimaryClick}
                selected={isSelected}
                className={classes.root}
            >
                <ListItemAvatar>
                    {image && image.shortName === group.shortName ? (
                        <Avatar
                            className={classes.avatar}
                            src={image.dataUrl}
                            alt={`${image.shortName}`}
                        />
                    ) : (
                        <Avatar
                            className={classes.avatar}
                            src={getAvatarUrl(group)}
                            alt={`${group.shortName}`}
                        />
                    )}
                </ListItemAvatar>
                <ListItemText
                    primary={group.displayName}
                    secondary={group.shortName || null}
                />
                {hasAdminRights && (
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            aria-label={intl.formatMessage(messages.actions)}
                            {...bindTrigger(popupState)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center'
                            }}
                        >
                            <List className={clsx(classes.root)}>
                                <ListItem button onClick={handleEdit}>
                                    <ListItemText
                                        primary={intl.formatMessage(
                                            messages.edit
                                        )}
                                    />
                                </ListItem>
                                <ListItem button onClick={handleDelete}>
                                    <ListItemText
                                        primary={intl.formatMessage(
                                            messages.delete
                                        )}
                                    />
                                </ListItem>
                            </List>
                        </Popover>
                    </ListItemSecondaryAction>
                )}
            </ListItem>

            <DialogOrganization
                displayName={group.displayName}
                shortName={group.shortName}
                onSave={handleSave}
                passRef={editOrganizationDialog}
            />
            <DialogGroupConfirm
                group={group}
                onConfirm={handleConfirm}
                passRef={confirmOrganizationDialog}
            />
        </React.Fragment>
    );
};

export default compose(
    injectIntl,
    connect(
        store => ({
            access: store.access
        }),
        {}
    ),
    GroupsContainer(),
    MessageContainer(),
    UserContainer({})
)(OrganizationRow);
