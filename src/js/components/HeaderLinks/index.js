// @flow
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import InviteIcon from '@material-ui/icons/PersonAdd';
import NotificationsIcon from '@material-ui/icons/Notifications';
import InboxIcon from '@material-ui/icons/Inbox';
import DrawerInvitations from 'components/DrawerInvitations';
import { green } from 'constants/Theme';

const useStyles = makeStyles({
    root: {
        float: 'right',
        marginLeft: '1em',

        '& ul': { margin: 0, padding: 0 },
        '& ul li': {
            margin: '.5em',
            padding: 0,
            listStyle: 'none',
            display: 'inline-block',
            cursor: 'pointer'
        },
        '& a': {
            display: 'block',
            padding: '.25em',
            color: '#bdc6d0',

            '&:hover': {
                color: green
            }
        }
    }
});

/**
 *  Simple Links for main header
 *  Next to profile
 */
const HeaderLinks = () => {
    const classes = useStyles();
    const [inviteDrawer, setInviteDrawer] = useState(false);

    const toggleInviteDrawer = (isOpen: boolean) => {
        setInviteDrawer(isOpen);
    };

    const handleInviteSuccess = () => {
        if (inviteDrawer) toggleInviteDrawer(false);
    };

    return (
        // $FlowFixMe
        <Fragment>
            <div className={classes.root}>
                <ul>
                    <li>
                        <Link>
                            <NotificationsIcon />
                        </Link>
                    </li>
                    <li>
                        <Link>
                            <InboxIcon />
                        </Link>
                    </li>
                    <li>
                        <Link onClick={() => toggleInviteDrawer(true)}>
                            <InviteIcon />
                        </Link>
                    </li>
                </ul>
            </div>

            {/* $FlowFixMe */}
            <DrawerInvitations
                open={inviteDrawer}
                onClose={() => toggleInviteDrawer(false)}
                onSuccess={() => handleInviteSuccess()}
            />
        </Fragment>
    );
};

export default HeaderLinks;
