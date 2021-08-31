// @flow
import React from 'react';
import moment from 'moment-timezone';
import clsx from 'clsx';
import { injectIntl, intlShape } from 'react-intl';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { AVATAR } from 'constants/ServiceURI';
import messages from 'constants/Messages';
import { grey2, grey0 } from 'constants/Theme';
import { fetchUserInfo } from 'actions/ActionUsers';

type Props = {
    avatarName: string,
    avatarDate: string,
    intl: intlShape,
    className: Object
};

const useStyles = makeStyles(() => ({
    root: {
        padding: '1em',
        minWidth: '20em',
        backgroundColor: grey2,
        color: '#f7f7f7',
        fontSize: '1em',
        '& hr': {
            backgroundColor: grey0
        },
        '& p': {
            paddingBottom: '0.4em',
            wordBreak: 'break-all'
        },
        '& .MuiDivider-middle': {
            margin: 0
        }
    },
    userName: {
        fontSize: '1.4em',
        padding: '0'
    },
    popoverLinks: {
        marginTop: '1.6em'
    },
    currentTime: {
        textAlign: 'right',
        fontSize: '1em',
        padding: '0.2em 0 0 0'
    },
    timezone: {
        textAlign: 'right',
        color: '#929ca6'
    },
    title: {
        color: '#929ca6'
    },
    avatar: {
        boxShadow: '0px 0px 2px #ccc'
    }
}));

function AvatarUserPopover(props: Props) {
    const { intl, avatarName, avatarDate, className } = props;
    const classes = useStyles();

    /** Local state */
    const [user, setUser] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    /** Handle time and timezone conversions */
    const date = new Date();
    const getuserCurrentTime = () => {
        const currentTime = moment(date);
        if (user && user.timezone && user.timezone !== '')
            return currentTime.add(user.timezone, 'hours').format('LT');
        return moment(date).format('LT');
    };

    const getUserTimeZone = () => {
        const userZone = moment.tz.guess(true);
        return moment.tz(date, userZone).format('z');
    };

    /**
     * Handle user interaction with the avatar on hover
     * Fetches the user or org info and stores it in state
     * @param {*} event
     */
    if (open === true) {
        if (!user) {
            fetchUserInfo(avatarName)
                .then(response => {
                    return setUser(response.data.data);
                })
                .catch(e => {
                    throw e;
                });
        }
    }

    return (
        <div>
            <Avatar
                src={AVATAR(avatarName)}
                alt={avatarName}
                onClick={e => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    setAnchorEl(e.currentTarget);
                    setOpen(!open);
                }}
                className={clsx(classes.avatar, className)}
            />
            {user && (
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
                                <Grid item xs={8}>
                                    <Typography
                                        variant="body1"
                                        className={classes.userName}
                                    >
                                        {`${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography
                                        variant="body1"
                                        className={classes.currentTime}
                                    >
                                        {getuserCurrentTime()}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item container>
                                <Grid item xs={8}>
                                    <Typography
                                        variant="body1"
                                        className={classes.title}
                                    >
                                        {user.jobtitle || ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography
                                        variant="body1"
                                        className={classes.timezone}
                                    >
                                        {`${getUserTimeZone()}${user.timezone ||
                                            ''}`}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Divider variant="middle" />
                            </Grid>
                            <Grid item container>
                                <Grid item xs={12}>
                                    {avatarDate && (
                                        <Typography variant="body1">
                                            {intl.formatMessage(
                                                messages.lastEdit,
                                                {
                                                    user: avatarName,
                                                    date: avatarDate
                                                }
                                            )}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </Popover>
            )}
        </div>
    );
}

export default injectIntl(AvatarUserPopover);
