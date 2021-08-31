// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
// import HomeIcon from '@material-ui/icons/HomeOutlined';
// import PeopleIcon from '@material-ui/icons/PersonOutlined';
// import FormulaIcon from '@material-ui/icons/TuneOutlined';
// import ReportsIcon from '@material-ui/icons/PieChartOutlined';
// import TasksIcon from '@material-ui/icons/PlaylistAddOutlined';

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
