import React, { useState, useEffect } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import TabLined from 'components/TabLined';

import TasksContainer from 'containers/TasksContainer';
import Header from 'components/Header';
import DataListTasks from 'components/DataListTasks';
import QuickAccessList from 'components/ListQuickAccessTasks';
import DataListIssuedTasks from 'components/DataListIssuedTasks';
import DataListRequestsStatus from 'components/DataListRequestsStatus';
import InformationPage from 'components/InformationPage';
import messages from 'constants/Messages';

import { NAMESPACE } from 'constants/Config';

const NAMESPACE_REQUEST_RECEIVED = `${NAMESPACE}.request.received`;

type DefaultProps = {
    intl: intlShape,
    getRecentTasks: Array<Object>,
    recentTasks: Array<Object>
};

type Props = {
    startIndex: number
} & DefaultProps;

const useStyles = makeStyles(theme => ({
    root: {
        minHeight: '61vh',
        width: '100%',
        '& .MuiTypography-root.MuiTypography-body1': {
            width: '100%'
        },
        '& .MuiPaper-root': {
            width: '100%'
        }
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    },
    tabs: {
        marginTop: '1.5em',
        '& header': {
            paddingLeft: 0
        },
        '& span.MuiTab-wrapper': {
            textTransform: 'none',
            fontSize: '1.4em',
            fontWeight: 400
        },
        '& .MuiTabs-root': {
            minHeight: 'auto',
            marginTop: '1em'
        }
    }
}));

function LayoutRequests({
    intl,
    startIndex,
    getRecentTasks,
    recentTasks
}: Props) {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState(0);
    const panes = [
        <DataListTasks />,
        <DataListIssuedTasks />,
        <DataListRequestsStatus />
    ];
    const tabs = ['received', 'issued', 'reports'];

    useEffect(() => {
        if (startIndex) setActiveTab(startIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!recentTasks) getRecentTasks();

    const handleChange = (index: number) => {
        setActiveTab(index);
        window.history.replaceState({}, null, tabs[index]);
    };

    return (
        <div className={classes.root}>
            <Header page="requests" disableBreadcrumb enableSearchbar />

            <InformationPage
                allowHide
                limit={500}
                fullWidth
                customStyle="header-tip"
                message="paymentReviewInformation"
                namespace={NAMESPACE_REQUEST_RECEIVED}
            />

            {
                <div style={{ marginTop: '1em' }}>
                    <QuickAccessList recentTasks={recentTasks} />
                </div>
            }

            <div className={classes.tabs}>
                <TabLined
                    tabs={tabs}
                    panes={panes}
                    variant="standard"
                    title={intl.formatMessage(messages.people)}
                    onChange={handleChange}
                    activeTab={activeTab}
                />
            </div>
        </div>
    );
}

export default TasksContainer()(withRouter(injectIntl(LayoutRequests)));
