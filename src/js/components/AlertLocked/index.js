// @flow
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import messages from 'constants/Messages';
import { textgreen } from 'constants/Theme';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import Button from 'components/Button';
import { WIN_BROWSER_URL, OSX_BROWSER_URL } from 'constants/Config';

type DefaultProps = {
    intl: intlShape,
    router: Object
};

type Props = {} & DefaultProps;

const useStyles = makeStyles({
    root: {
        marginTop: '10vh',
        textAlign: 'center',
        width: 505,
        margin: '0 auto'
    },
    title: {
        marginTop: '1em',
        fontWeight: 400,
        color: `${textgreen}!important`
    },
    message: {
        fontSize: '1.4em!important',
        fontWeight: 300,
        lineHeight: '1.2em!important'
    },
    image: {
        width: 200
    },
    button: {
        marginTop: '2.5em'
    },
    goBack: {
        marginTop: '1.5em'
    }
});

const AlertLocked = ({ intl, router }: Props) => {
    const classes = useStyles();
    const ticket = localStorage.getItem('auth:ticket') || '';

    setTimeout(() => {
        window.open(
            `greenfence://=${window.location.href}?ticket=${ticket}`,
            '_self'
        );
    }, 500);

    const isMacintosh = navigator.platform.indexOf('Mac') > -1;
    const downloadText = isMacintosh
        ? 'downloadBrowserDMG'
        : 'downloadBrowserMSI';

    /**
     *  Download browser
     */
    const downloadBrowser = () => {
        if (isMacintosh) {
            window.open(OSX_BROWSER_URL, '_blank');
        } else {
            window.open(WIN_BROWSER_URL, '_blank');
        }
    };

    return (
        <div className={classes.root}>
            <img
                src="/css/img/icons/secure-document.svg"
                alt="No Access"
                className={classes.image}
            />

            <Typography variant="h2" className={classes.title}>
                {intl.formatMessage(messages.lockedTitle)}
            </Typography>

            <Typography variant="body2" paragraph className={classes.message}>
                {intl.formatMessage(messages.lockedMessage)}
            </Typography>

            <div className={classes.button}>
                <Button
                    onClick={() => {
                        downloadBrowser();
                    }}
                    text={downloadText}
                />
                <div className={classes.goBack}>
                    <Button
                        text="back"
                        color="grey"
                        size="small"
                        onClick={() => {
                            router.goBack();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default compose(
    withRouter,
    injectIntl
)(AlertLocked);
