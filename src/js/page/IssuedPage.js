// @flow
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { authCheck, secretCheck, verifiedCheck } from 'utils/pages';
import { hot } from 'react-hot-loader/root';
import reloadable from 'utils/reloadable';
import messages from 'constants/Messages';
import App from 'components/App';
import Header from 'components/Header';
import PageAccess from 'containers/PageAccess';
// Local
import LayoutIssuedRequests from 'components/LayoutIssuedRequests';

type Props = {
    intl: intlShape
};

/**
 *  @package Issued Tasks Page
 *  @container IssuedPage
 *  @desc Issued By User Tasks Page Wrapper
 *  @author: james.hansen
 */
@authCheck
@secretCheck
@verifiedCheck
class IssuedPage extends Component<Props> {
    render() {
        const { intl } = this.props;

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
                        <Header page="requests" />
                        <LayoutIssuedRequests />
                    </div>
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(IssuedPage)));
