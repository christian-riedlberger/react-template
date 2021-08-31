// @flow
import _ from 'lodash';
import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withRouter } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import messages from 'constants/Messages';

import Button from 'components/Button';

type DefaultProps = {
    intl: intlShape,
    router: Object
};

type Props = {
    errors: Array<string>,
    icon?: string
} & DefaultProps;

/**
 *  Restricted Access Banner
 */
const useStyles = makeStyles({
    pageWrapper: {
        backgroundColor: '#fff',
        position: 'relative',
        marginTop: '-1em',
        minHeight: '80vh',
        background: '#fff',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    restricted: {
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        marginRight: '2em'
    },
    fontLarge: {
        fontSize: '2.25em',
        lineHeight: '1em',
        display: 'block',
        marginTop: 0
    },
    image: {
        float: 'right',
        marginLeft: '2em'
    },
    text: {
        fontSize: '1.25em',
        marginBottom: '1em',
        maxWidth: '300px',
        overflowWrap: 'break-word'
    },
    error: {
        fontSize: '1.25em'
    },
    goBack: {
        marginTop: '1em'
    }
});

/**
 * Error Message for already open pages
 * @param {*} param0
 */
const ErrorMessage = ({ intl, errors, icon, router }: Props) => {
    const classes = useStyles();

    const getOrDefaultIntl = (message: string) => {
        if (messages[message]) return intl.formatMessage(messages[message]);
        return <FormattedMessage {...messages.errorTitle} />;
    };

    const imageIcon = icon || '/css/img/icons/worker.svg';

    return (
        <React.Fragment>
            <div className={classes.pageWrapper}>
                <div className={classes.restricted}>
                    <div className={classes.content}>
                        <h1
                            className={classes.fontLarge}
                            data-cy="messageTitle"
                        >
                            {getOrDefaultIntl(
                                `${errors[0].split(':')[0]}Title`
                            )}
                        </h1>
                        <div className={classes.text}>
                            {_.map(errors, (error: string) => {
                                let message = error;
                                let messageText = null;

                                // Allow params to be used in server error
                                if (error.indexOf(':') !== 1) {
                                    const parts = error.split(':');
                                    message = parts[0];

                                    // Check if that intl message exists
                                    if (messages[message]) {
                                        messageText = intl.formatMessage(
                                            messages[message],
                                            {
                                                param: parts[1]
                                            }
                                        );
                                    } else {
                                        // Just send what server said
                                        messageText = `intl:${message}`;
                                    }
                                } else {
                                    getOrDefaultIntl(message);
                                }

                                return (
                                    <div>
                                        {messageText}
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
                                );
                            })}
                        </div>
                    </div>
                    <img
                        src={imageIcon}
                        alt="No Access"
                        className={classes.image}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default compose(
    withRouter,
    injectIntl
)(ErrorMessage);
