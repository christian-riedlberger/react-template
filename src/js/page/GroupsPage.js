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
import LayoutGroup from 'components/LayoutGroup';

type Props = {
    intl: intlShape
};

/**
 *  @package Dashboard (dashboard)
 *  @container DashboardPage
 *  @desc Dashboard Page Wrapper
 *  @author: mike.priest
 */
@authCheck
@secretCheck
@verifiedCheck
class GroupsPage extends Component<Props> {
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
                <PageAccess page="people">
                    <div className="page-wrapper">
                        <Header page="people" />
                        <LayoutGroup />
                    </div>
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(GroupsPage)));
