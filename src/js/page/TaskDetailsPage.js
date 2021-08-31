// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { hot } from 'react-hot-loader/root';
import { authCheck, secretCheck, verifiedCheck } from 'utils/pages';
import { Helmet } from 'react-helmet';
import reloadable from 'utils/reloadable';
import App from 'components/App';
import messages from 'constants/Messages';
import LayoutTaskDetails from 'components/LayoutTaskDetails';
import TasksContainer from 'containers/TasksContainer';
import Header from 'components/Header';
import PageAccess from 'containers/PageAccess';

type DefaultProps = {
    intl: intlShape,
    router: Object,
    serverMessage: Array<string>
};

type Props = {} & DefaultProps;

/**
 * Definition of a pie chart
 * @param {*} param0
 */
@authCheck
@secretCheck
@verifiedCheck
@TasksContainer({})
class TaskDetailsPage extends Component<Props> {
    render() {
        const { intl, router, serverMessage } = this.props;
        const { taskId } = router.params;

        return (
            <App>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {intl.formatMessage(messages.taskDetailsPage)}
                    </title>
                </Helmet>
                <PageAccess page="requests">
                    <div className="page-wrapper">
                        {serverMessage && serverMessage.length > 0 ? (
                            <Header />
                        ) : (
                            <Header page="tasks" bordered />
                        )}

                        <LayoutTaskDetails taskId={taskId} />
                    </div>
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(TaskDetailsPage)));
