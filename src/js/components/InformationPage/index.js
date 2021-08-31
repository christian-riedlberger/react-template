// @flow
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import Button from 'components/Button';
import messages from 'constants/Messages';
import ReadMoreAndLess from 'react-read-more-less';

import type { ContainerProps as PreferenceProps } from 'containers/PreferenceContainer';
import PreferenceContainer from 'containers/PreferenceContainer';

import { ENABLE_PAGE_HELPERS } from 'constants/Config';

type DefaultProps = {
    intl: intlShape
} & PreferenceProps;

type Props = {
    namespace: String,
    limit?: number,
    message: string,
    customStyles: string,
    allowHide: boolean,
    fullWidth?: boolean
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        background: '#FDFFD4',
        padding: '1em',
        color: '#888A5C',
        fontSize: '15px',
        fontWeight: '300',
        lineHeight: '1.25em',
        marginBottom: '1em',

        '& span.readMoreText': {
            borderBottom: '1px solid #bfc16a',
            color: '#7b7e43!important',
            fontWeight: 400,
            marginLeft: '0.5em'
        }
    },
    rootFullWidth: {
        background: '#FDFFD4',
        padding: '1em',
        color: '#888A5C',
        fontSize: '15px',
        fontWeight: '300',
        lineHeight: '1.25em',
        marginLeft: '1em',
        marginBottom: '.25em',
        marginTop: '.5em',
        '& span.readMoreText': {
            borderBottom: '1px solid #bfc16a',
            color: '#7b7e43!important',
            fontWeight: 400,
            marginLeft: '0.5em'
        }
    }
});

const InformationPage = (props: Props) => {
    const {
        intl,
        updatePreference,
        fetchPreference,
        namespace,
        customStyles,
        message,
        limit,
        fullWidth,
        allowHide
    } = props;

    const classes = useStyles();
    const messageProp = messages[message];
    const containerStyle = fullWidth ? classes.rootFullWidth : classes.root;
    const [showHelper, setShowHelper] = useState(false);

    // 'on mount'
    useEffect(() => {
        if (allowHide) {
            fetchPreference(namespace)
                .then(resp => {
                    const value = resp
                        ? _.get(resp.value.data, `${namespace}.info`)
                        : null;
                    setShowHelper(_.isNil(value) ? true : value);
                    return null;
                })
                .catch(error => {
                    throw error;
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = () => {
        if (allowHide) {
            updatePreference(namespace, { info: false });
            setShowHelper(false);
        }
    };

    return (
        ENABLE_PAGE_HELPERS &&
        (showHelper && (
            <div className={customStyles || ''}>
                <div className={containerStyle}>
                    {allowHide && (
                        <div className="info-button">
                            <Button
                                text="hideInfo"
                                size="small"
                                color="grey0"
                                round
                                onClick={handleClick}
                            />
                        </div>
                    )}

                    <ReadMoreAndLess
                        charLimit={limit || 200}
                        readMoreText={intl.formatMessage(messages.readMore)}
                        readLessText={intl.formatMessage(messages.readLess)}
                    >
                        {messageProp
                            ? intl.formatMessage(messageProp)
                            : `intl: ${message}`}
                    </ReadMoreAndLess>
                </div>
            </div>
        ))
    );
};

export default PreferenceContainer({})(injectIntl(InformationPage));
