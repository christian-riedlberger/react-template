// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import { getReservedOrgName } from 'utils/string';
import {
    usePopupState,
    bindTrigger,
    bindPopover
} from 'material-ui-popup-state/hooks';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import BusinessIcon from '@material-ui/icons/Business';
import Avatar from '@material-ui/core/Avatar';
import type { Group as GroupType } from 'types/groupTypes';
import messages from 'constants/Messages';
import MenuActionsGroups from 'components/MenuActionsGroups';
import GroupsContainer from 'containers/GroupsContainer';
import { WILDCARD_GROUP } from 'constants/Config';
import GroupIcon from '@material-ui/icons/Group';
import { AVATAR } from 'constants/ServiceURI';

type DefaultProps = {
    intl: intlShape
};

type Props = {
    group: GroupType,
    getGroups: Function,
    onClick: Function,
    access: Object,
    isSelected?: boolean,
    isOrganization: boolean,
    isOperation: boolean,
    columnIndex: number,
    history: Array<GroupType>,
    updateGroupAtIndex: Function
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const GroupRow = (props: Props) => {
    const {
        intl,
        group,
        getGroups,
        onClick,
        access,
        isSelected,
        isOrganization,
        isOperation,
        updateGroupAtIndex,
        columnIndex,
        history
    } = props;
    const classes = useStyles();
    const popupState = usePopupState({
        variant: 'popover'
    });
    const handlePrimaryClick = () => {
        if (group.authorityType !== 'USER') {
            onClick(group);
            updateGroupAtIndex(group, columnIndex + 1);
        }
    };

    const strippedName = group.displayName.replace(/[^a-zA-Z0-9]/g, '');

    // Administrator buttons
    const userIsAdmin = localStorage.getItem('auth:userIsAdmin') === 'true';
    const isActiveOrg =
        history && history.length > 1
            ? localStorage.getItem('org:active') === history[1].shortName
            : false;
    const hasAdminRights = access.sysAdmin || (userIsAdmin && isActiveOrg);

    const getIcon = () => {
        if (
            group.shortName.endsWith('_SUPPLIERS') ||
            group.shortName.endsWith('_OPERATIONS')
        )
            return <BusinessIcon fontSize="small" />;

        if (group.authorityType === 'GROUP')
            return <GroupIcon fontSize="small" />;

        return (
            <Avatar
                style={{ marginRight: '17px' }}
                className={classes.avatar}
                src={AVATAR(group.shortName)}
                alt={group.shortName}
            />
        );
    };

    return (
        <ListItem
            button
            key={group.nodeRef}
            onClick={handlePrimaryClick}
            selected={isSelected}
            className={`cy-group-${strippedName}`}
        >
            {group.authorityType && (
                <ListItemIcon className={classes.icon}>
                    {getIcon()}
                </ListItemIcon>
            )}
            <ListItemText
                primary={getReservedOrgName(group.displayName, intl)}
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
                        <MenuActionsGroups
                            group={group}
                            isOrganization={isOrganization}
                            isOperation={isOperation}
                            useBrowse={
                                columnIndex === 0 &&
                                history[0].displayName ===
                                    WILDCARD_GROUP.displayName
                            }
                            getGroups={getGroups}
                        />
                    </Popover>
                </ListItemSecondaryAction>
            )}
        </ListItem>
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
    GroupsContainer()
)(GroupRow);
