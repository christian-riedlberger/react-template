// @flow
import React, { useEffect } from 'react';
import { browserHistory } from 'react-router';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage, injectIntl } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'components/Button';
import messages from 'constants/Messages';

import { clearLocalStorage } from 'utils/localStorage';

const useStyles = makeStyles({
    root: {
        display: 'block',
        margin: '0 auto',
        maxWidth: '80vw',

        '& h1.MuiTypography-h1': {
            fontSize: '3em!important',
            marginBottom: '1em'
        }
    },
    button: {
        display: 'block',
        width: '100%',
        marginTop: '2em!important',
        marginLeft: '0!important'
    },
    header: {
        textAlign: 'center',
        borderBottom: '1px solid #e6e6e6',
        paddingBottom: '2em',
        marginTop: '3em;',
        marginBottom: '5em;'
    }
});

/**
 *  Restricted Access Banner
 */
const UnverifiedPage = () => {
    const classes = useStyles();

    const logout = () => {
        clearLocalStorage();
        browserHistory.push('/');
    };

    useEffect(() => {
        return () => {
            logout();
        };
    });

    return (
        <div className="page-wrapper" style={{ backgroundColor: '#fff' }}>
            <div className={classes.root}>
                <div className={classes.header}>
                    <img
                        src="/css/img/brand/logo-greenfence.svg"
                        alt="Greenfence"
                        width="200"
                    />
                </div>

                <div
                    className="restricted"
                    style={{
                        backgroundColor: '#fff',
                        margin: '0 auto',
                        width: 500,
                        textAlign: 'center'
                    }}
                >
                    <div style={{ paddingTop: '7em' }}>
                        <Typography className={classes.title} variant="h1">
                            <FormattedMessage {...messages.linkExpired} />
                        </Typography>

                        <p style={{ maxWidth: 300, margin: '0 auto' }}>
                            <FormattedMessage {...messages.inviteExpired} />
                            <Button
                                text="unverifiedExit"
                                onClick={logout}
                                className={classes.button}
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default injectIntl(UnverifiedPage);
