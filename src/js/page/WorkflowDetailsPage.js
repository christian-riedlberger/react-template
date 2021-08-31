// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { hot } from 'react-hot-loader/root';
import { authCheck, secretCheck, verifiedCheck } from 'utils/pages';
import { Helmet } from 'react-helmet';
import reloadable from 'utils/reloadable';
import App from 'components/App';
import messages from 'constants/Messages';
import LayoutWorkflowDocumentDetails from 'components/LayoutWorkflowDocumentDetails';
import HeaderWorkflowDetails from 'components/HeaderWorkflowDetails';
import PageAccess from 'containers/PageAccess';

type DefaultProps = {
    intl: intlShape,
    router: Object
};

type Props = {} & DefaultProps;

/**
 * Workflow Details Page
 *
 */
@authCheck
@secretCheck
@verifiedCheck
class WorkflowDetailsPage extends Component<Props> {
    render() {
        const { intl, router } = this.props;

        // eslint-disable-next-line prefer-destructuring
        const workflowId = router.params.workflowId;

        return (
            <App>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {intl.formatMessage(messages.workflowDetailsPage)}
                    </title>
                </Helmet>

                <PageAccess page="requests">
                    <div className="page-wrapper left-padded">
                        <HeaderWorkflowDetails workflowId={workflowId} />

                        {/* $FlowFixMe */}
                        <LayoutWorkflowDocumentDetails
                            workflowId={workflowId}
                        />
                    </div>
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(WorkflowDetailsPage)));
