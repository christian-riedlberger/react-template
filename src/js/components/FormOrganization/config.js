// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from 'constants/Messages';

export const roles = [
    /* {
        title: <FormattedMessage {...messages.dashboard} />,
        value: 'dashboard'
    }, */
    {
        title: <FormattedMessage {...messages.requests} />,
        value: 'requests'
    },
    {
        title: <FormattedMessage {...messages.documents} />,
        value: 'documents'
    },
    {
        title: <FormattedMessage {...messages.people} />,
        value: 'people'
    }
];

const config = {
    roles
};

export default config;
