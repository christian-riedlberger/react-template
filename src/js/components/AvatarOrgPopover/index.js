// @flow
import React, { Fragment } from 'react';
import { injectIntl, intlShape } from 'react-intl';

import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';

import messages from 'constants/Messages';
import { grey2, grey0 } from 'constants/Theme';
import { fetchOrganizationInfo } from 'actions/ActionOrganizations';
import { log } from 'utils/logger';
import { getAvatarUrl } from 'utils/avatar';

type DefaultProps = {
    intl: intlShape
};
type Props = {
    shortName: string,
    initiator?: string,
    orgLabel?: string | Node,
    disablePopover: boolean,
    showName: boolean,
    showNameAs?: string,
    className?: string
} & DefaultProps;

const useStyles = makeStyles(() => ({
    root: {
        padding: '1em',
        minWidth: '20em',
        backgroundColor: grey2,
        color: '#f7f7f7',
        fontSize: '1em',
        '& hr': {
            backgroundColor: grey0,
            margin: '.5em 0'
        },
        '& p': {
            paddingBottom: '0'
        }
    },
    displayName: {
        fontSize: '1.4em',
        padding: '0'
    },
    popoverLinks: {
        marginTop: '1.6em'
    },
    compliance: {
        textAlign: 'right',
        fontSize: '1em',
        padding: '0.2em 0 0 0'
    },
    orgType: {
        textAlign: 'right',
        color: '#929ca6'
    },
    title: {
        color: '#929ca6'
    },
    avatar: {
        boxShadow: '0px 0px 2px #ccc'
    },
    avatarContainer: {
        '& h6': {
            marginBottom: '0px !important'
        }
    }
}));

const AvatarOrgPopover = (props: Props) => {
    const {
        intl,
        shortName,
        initiator,
        disablePopover,
        orgLabel,
        showName,
        showNameAs,
        className
    } = props;
    const classes = useStyles();

    /** Local state */
    const [org, setOrg] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const displayName = shortName;

    /**
     * Handle user interaction with the avatar on hover
     * Fetches the user or org info and stores it in state
     * @param {*} event
     */
    if (open === true) {
        if (!org)
            fetchOrganizationInfo(shortName)
                .then(response => {
                    log('response', 'blue', { response });
                    return setOrg(response.data.data);
                })
                .catch(e => {
                    throw e;
                });
    }

    return (
        <Fragment>
            <Grid
                container
                direction="row"
                alignItems="center"
                spacing={2}
                className={clsx(classes.avatarContainer, className)}
            >
                <Grid item>
                    <Avatar
                        src={getAvatarUrl({ shortName })}
                        alt={displayName}
                        onClick={e => {
                            if (!disablePopover) {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                                setAnchorEl(e.currentTarget);
                                setOpen(!open);
                            }
                        }}
                        className={classes.avatar}
                    />
                </Grid>
                {showName && (
                    <Grid item>
                        <Typography
                            variant={showNameAs || 'h6'}
                            component={showNameAs || 'h5'}
                            gutterBottom={false}
                        >
                            {shortName}
                        </Typography>
                        {orgLabel && (
                            <Typography
                                variant="subtitle1"
                                component="h6"
                                gutterBottom={false}
                            >
                                {orgLabel}
                            </Typography>
                        )}
                    </Grid>
                )}
            </Grid>

            {org && (
                <Popover
                    open={open}
                    variant="popover"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    onClose={e => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        setOpen(!open);
                    }}
                >
                    <div className={classes.root}>
                        <Grid container direction="column" spacing={1}>
                            <Grid item container>
                                <Grid item xs={6}>
                                    <Typography
                                        variant="body1"
                                        className={classes.displayName}
                                    >
                                        {org.displayName}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {initiator && (
                                <Grid item>
                                    <Divider variant="middle" />
                                </Grid>
                            )}
                            {initiator && (
                                <Grid item container>
                                    <Grid item xs={12}>
                                        {intl.formatMessage(messages.sentBy, {
                                            name: initiator
                                        })}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </div>
                </Popover>
            )}
        </Fragment>
    );
};

export default injectIntl(AvatarOrgPopover);
