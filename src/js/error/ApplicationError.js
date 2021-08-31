// @flow
import React, { useState } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import { copyToClipboard } from 'utils/string';
import messages from 'constants/Messages';

type Props = {
    uuid: string,
    intl: intlShape
};

/**
 *  Restricted Access Banner
 */
const useStyles = makeStyles({
    pageWrapper: {
        backgroundColor: '#fff',
        position: 'relative',
        padding: '1em 2.25em',
        minHeight: '100vh',
        background: '#fff',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    restricted: {
        width: '510px',
        margin: '0 auto'
    },
    fontLarge: {
        fontSize: '2.25em',
        lineHeight: '1em',
        marginBottom: '.75em',
        display: 'block',
        paddingTop: '2.5em'
    },
    image: {
        float: 'right',
        marginLeft: '2em'
    },
    text: {
        fontSize: '1.25em',
        marginBottom: '1em'
    },
    error: {
        fontSize: '1.25em'
    }
});

const ApplicationError = ({ uuid, intl }: Props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const classes = useStyles();

    const handleLinkClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertOpen(false);
    };

    const handleCopy = () => {
        copyToClipboard(uuid);
        setAnchorEl(null);
        setAlertOpen(true);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <React.Fragment>
            <div className={classes.pageWrapper}>
                <div className={classes.restricted}>
                    <img
                        style={{ float: 'right' }}
                        src="/css/img/icons/worker.svg"
                        alt="No Access"
                        className={classes.image}
                    />
                    <h1 className={classes.fontLarge}>
                        <FormattedMessage {...messages.errorTitle} />
                    </h1>
                    <div className={classes.text}>
                        <FormattedMessage {...messages.informError} />
                    </div>

                    <div className={classes.error}>
                        <span>
                            <FormattedMessage {...messages.errorId} />
                        </span>

                        <a onClick={handleLinkClick}>
                            <span className="blue"> {` ${uuid}`}</span>
                            <i className="copy outline icon black" />
                        </a>
                    </div>
                </div>
                <Menu
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleCopy}>
                        {intl.formatMessage(messages.copy)}
                    </MenuItem>
                </Menu>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={alertOpen}
                    autoHideDuration={6000}
                    onClose={handleAlertClose}
                    message={intl.formatMessage(messages.clipboardCopy)}
                    action={
                        <React.Fragment>
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={handleAlertClose}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </React.Fragment>
                    }
                />
            </div>
        </React.Fragment>
    );
};

export default injectIntl(ApplicationError);
