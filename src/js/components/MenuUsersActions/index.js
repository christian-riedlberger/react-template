// @flow
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import messages from 'constants/Messages';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

type Props = {
    open: boolean,
    username: string,
    deleteUser: Function,
    onClose: Function,
    coords: {
        mouseX: number | null,
        mouseY: number | null
    }
};

/**
 *  Styled menu popup
 */
const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
        '& ul a': {
            color: 'rgba(0, 0, 0, 0.87)'
        }
    }
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
        }}
        {...props}
    />
));

/**
 *  Styled menu option
 */
const StyledMenuItem = withStyles(() => ({
    root: {}
}))(MenuItem);

/**
 *  User actions menu component
 *  Main def
 */
const UsersActionMenu = (props: Props) => {
    const { username, deleteUser, onClose, open, coords } = props;

    const authUsername = localStorage.getItem('auth:username') || 'null';
    const isAdmin = localStorage.getItem('auth:userIsAdmin') || 'false';

    const [actions, setActions] = useState({
        edit: { disabled: true },
        delete: { disabled: true }
    });

    /**
     * On Mount
     */
    useEffect(() => {
        if (!username) return;

        if (isAdmin === 'true') {
            setActions(
                username === authUsername
                    ? { edit: { disabled: false }, delete: { disabled: true } }
                    : { edit: { disabled: false }, delete: { disabled: false } }
            );
        } else {
            setActions(
                username === authUsername
                    ? { edit: { disabled: false }, delete: { disabled: true } }
                    : { edit: { disabled: true }, delete: { disabled: true } }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    function handleClose() {
        if (onClose) onClose();
    }

    function handleDeleteClick(userName: string) {
        const userNameArr = [userName];
        deleteUser(userNameArr);
    }

    return (
        <div>
            {username && (
                <StyledMenu
                    id="customized-menu"
                    keepMounted
                    open={open}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: coords.mouseY, left: coords.mouseX }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left'
                    }}
                    onClose={handleClose}
                >
                    <Link
                        to={`/people/edit/${username}`}
                        title={username}
                        style={
                            actions.edit.disabled
                                ? { pointerEvents: 'none' }
                                : { pointerEvents: 'auto' }
                        }
                    >
                        <StyledMenuItem
                            data-cy="edit"
                            disabled={actions.edit.disabled}
                        >
                            <ListItemIcon>
                                <EditIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <FormattedMessage
                                        {...messages.editDetails}
                                    />
                                }
                            />
                        </StyledMenuItem>
                    </Link>
                    <StyledMenuItem
                        onClick={() => handleDeleteClick(username)}
                        data-cy="delete"
                        disabled={actions.delete.disabled}
                    >
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <FormattedMessage {...messages.deleteUser} />
                            }
                        />
                    </StyledMenuItem>
                </StyledMenu>
            )}
        </div>
    );
};

export default UsersActionMenu;
