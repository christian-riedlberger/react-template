// @flow
import React, { useEffect } from 'react';
import _ from 'lodash';
import { Link, browserHistory } from 'react-router';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';

import UserContainer from 'containers/UserContainer';
import type { ContainerProps as UserContainerProps } from 'containers/UserContainer';

import messages from 'constants/Messages';
import { AVATAR, GROUP_AVATAR } from 'constants/ServiceURI';
import { hue4 } from 'constants/Theme';

import { clearLocalStorage } from 'utils/localStorage';

/**
 * Styled component
 */
const styles = {
    info: {
        display: 'inline-block',
        padding: '0px 7px 0px 0',
        lineHeight: '1.5em',
        '& h1': {
            cursor: 'pointer',
            lineHeight: '1em',
            fontSize: '1.25em',
            fontWeight: '400',
            color: '#4c4d50',
            margin: 0,
            '& span': {
                marginRight: '2px',
                display: 'inline-block',
                maxWidth: '15em',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }
        }
    },
    company: {
        cursor: 'pointer',
        textAlign: 'left',
        paddingLeft: '0.3em',
        paddingRight: '0.3em',
        backgroundColor: '#edf1f4',
        borderRadius: '5em',
        color: '#65676b',
        fontSize: '1.2em',
        display: 'inline-block',
        maxWidth: '15em',
        minWidth: '3em',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        '& span': {
            borderRight: '3px solid #fff',
            padding: '0 .5em',
            borderRadius: '5em',
            backgroundColor: '#36cc82',
            color: '#fff',
            fontSize: '0.8em'
        }
    },
    score: {
        textAlign: 'left',
        paddingLeft: '0.3em',
        backgroundColor: '#edf1f4',
        borderRadius: '5em',
        color: '#65676b',
        fontSize: '1.2em',
        display: 'inline-block',
        '& span': {
            borderRight: '3px solid #fff',
            padding: '0 .5em',
            borderRadius: '5em',
            backgroundColor: '#36cc82',
            color: '#fff',
            fontSize: '0.8em'
        }
    },
    icon: {
        fontSize: '.9em',
        color: '#949494'
    },
    avatar: {
        cursor: 'pointer',
        float: 'right',
        borderRadius: '50em',
        marginLeft: '.5em',
        '& img': {
            borderRadius: '50em',
            border: '1px solid #6c6c6f',
            boxShadow: '0px 0px 1px #6c6c6f',
            cursor: 'pointer'
        }
    },
    line: {
        background: hue4,
        height: '1px',
        width: '100%',
        opacity: 0.25
    },
    profile: {
        textAlign: 'center',
        '& img': {
            borderRadius: '50em',
            border: '1px solid #6c6c6f',
            boxShadow: '0px 0px 1px #6c6c6f'
        },
        '& h1': {
            fontSize: '1.25em',
            fontWeight: '400',
            color: '#4c4d50',
            margin: 0,
            paddingTop: '0.5em',
            paddingBottom: '0.5em'
        },
        '& span': {
            padding: '.5em',
            display: 'block',
            width: '10em',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        }
    },
    organizations: {
        marginLeft: '.5em'
    },
    loading: {}
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
 * Properties
 */
type DefaultProps = {
    classes: Object,
    intl: intlShape,
    activeOrg: Object,
    userProfile: Object,
    organizations: Array<string>,
    organizationNames: Array<string>
} & UserContainerProps;

type Props = {} & DefaultProps;

/**
 *  Styled menu option
 */
const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white
            }
        }
    }
}))(MenuItem);

/**
 * Header Profile
 *
 * @param {*} props
 */
const HeaderProfile = (props: Props) => {
    const {
        classes,
        userProfile,
        activeOrg,
        organizations,
        setActiveOrganization,
        isLoading,
        isLoadingActiveOrg,
        intl
    } = props;

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [orgOptions, openOrgOptions] = React.useState(false);
    const [userOptions, openUserOptions] = React.useState(false);

    const handleSwitchOrganization = org => {
        if (activeOrg && activeOrg.shortName && activeOrg.shortName !== org)
            setActiveOrganization(org);
        openOrgOptions(false);
    };

    useEffect(() => {
        if (!isLoadingActiveOrg) {
            handleSwitchOrganization(localStorage.getItem('org:active'));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoadingActiveOrg]);

    if (!userProfile) return '';

    /**
     * Open header user menu list options
     * @param {*} event
     */
    const handleUserClick = event => {
        setAnchorEl(event.currentTarget);
        openOrgOptions(false);
        openUserOptions(true);
    };

    const handleOrgClick = event => {
        setAnchorEl(event.currentTarget);
        openOrgOptions(true);
        openUserOptions(false);
    };

    /**
     * Close header user menu list options
     */
    const handleClose = () => {
        setAnchorEl(null);
        openOrgOptions(false);
        openUserOptions(false);
    };

    /**
     * Open user's personal profile
     */
    const handlePersonalProfile = () => {
        handleClose();
    };

    /**
     * TODO: Implement change password handler (HeaderProfile component)
     */
    // const handleChangePassword = () => {
    //     log('Implement Change Password', 'blue');

    //     handleClose();
    // };

    /**
     * TODO: Implement address book handler (HeaderProfile component)
     */
    // const handleAddressBook = () => {
    //     log('Implement Address Book', 'blue');
    //     handleClose();
    // };

    /**
     * Clear local storage auth properties and redirect to the login page
     */
    const handleLogout = () => {
        handleClose();
        clearLocalStorage();
        browserHistory.push('/');
    };

    /**
     * Render user profile info
     */
    const renderUserProfileInfo = () => {
        return (
            <div className={classes.info} onClick={handleOrgClick}>
                <h1>
                    <span>
                        {userProfile.firstName} {userProfile.lastName}{' '}
                    </span>
                    <ExpandMoreIcon className={classes.icon} />
                </h1>
                {isLoading ? (
                    <CircularProgress size={20} className={classes.loading} />
                ) : (
                    activeOrg && (
                        <div>
                            <div className={classes.company}>
                                <span>
                                    {intl.formatMessage(messages.aaPlus)}
                                </span>{' '}
                                {activeOrg.displayName}
                            </div>
                        </div>
                    )
                )}
            </div>
        );
    };

    /**
     * Render profile picture and profile picture menu
     * @param {width} width
     */
    const renderProfilePicture = width => {
        if (userProfile.avatar) {
            return (
                <img
                    src={AVATAR(userProfile.userName)}
                    alt="Avatar"
                    width={width}
                />
            );
        }

        return (
            <a>
                <AccountCircleIcon
                    style={{ color: '#bdc6d0', fontSize: '3.5em' }}
                />
            </a>
        );
    };

    return (
        <div className="clearfix">
            {renderUserProfileInfo()}

            <div className={classes.avatar}>
                <div onClick={handleUserClick}>
                    {renderProfilePicture('43px')}
                </div>
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={userOptions}
                    onClose={handleClose}
                >
                    <div className={classes.profile}>
                        {renderProfilePicture('70px')}
                        <Typography
                            variant="h1"
                            style={{ marginBottom: '0.25em' }}
                        >
                            <span>
                                {userProfile.firstName} {userProfile.lastName}
                            </span>
                        </Typography>
                    </div>
                    <div className={classes.line} />
                    <Link
                        to={`/people/edit/${userProfile.userName}`}
                        title={userProfile.userName}
                    >
                        <StyledMenuItem onClick={handlePersonalProfile}>
                            <ListItemText
                                primary={
                                    <FormattedMessage
                                        {...messages.personalProfile}
                                    />
                                }
                            />
                        </StyledMenuItem>
                    </Link>
                    <StyledMenuItem onClick={handleLogout}>
                        <ListItemText
                            primary={<FormattedMessage {...messages.logout} />}
                        />
                    </StyledMenuItem>
                </StyledMenu>
                <StyledMenu
                    id="customized-menu-orgs"
                    anchorEl={anchorEl}
                    open={orgOptions}
                    onClose={handleClose}
                >
                    {_.map(organizations, org => (
                        <MenuItem
                            key={org}
                            onClick={() =>
                                handleSwitchOrganization(`${org}_ORGANIZATION`)
                            }
                        >
                            <Avatar
                                src={GROUP_AVATAR(`${org}_ORGANIZATION`)}
                                alt={org}
                                className={classes.avatar}
                            />
                            <ListItemText
                                className={classes.organizations}
                                primary={org}
                                secondary={
                                    <span>
                                        <FormattedMessage
                                            {...messages.companyTrustScore}
                                        />
                                        :
                                        <span className={classes.score}>
                                            <span>
                                                {intl.formatMessage(
                                                    messages.aaPlus
                                                )}
                                            </span>
                                        </span>
                                    </span>
                                }
                            />
                        </MenuItem>
                    ))}
                </StyledMenu>
            </div>
        </div>
    );
};

export default withStyles(styles)(
    UserContainer({
        userProfile: true
    })(injectIntl(HeaderProfile))
);
