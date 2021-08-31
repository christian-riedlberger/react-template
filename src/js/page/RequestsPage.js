// @flow
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { authCheck, secretCheck, verifiedCheck } from 'utils/pages';
import { hot } from 'react-hot-loader/root';
import reloadable from 'utils/reloadable';
import messages from 'constants/Messages';
import App from 'components/App';
import PageAccess from 'containers/PageAccess';
// Local
import LayoutRequests from 'components/LayoutRequests';

type Props = {
    intl: intlShape,
    startIndex: number
};

/**
 *  @package Tasks Page
 *  @container RequestsPage
 *  @desc Tasks Page Wrapper
 *  @author: james.hansen
 */
@authCheck
@secretCheck
@verifiedCheck
class RequestsPage extends Component<Props> {
    render() {
        const { intl, startIndex } = this.props;

        return (
            <App>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {intl.formatMessage(messages.dashboardDocTitle)}
                    </title>
                </Helmet>
                <PageAccess page="requests">
                    <div className="page-wrapper">
                        <LayoutRequests startIndex={startIndex} />
                    </div>
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(RequestsPage)));
