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
import Header from 'components/Header';
import LayoutDashboard from 'components/LayoutDashboard';
import SidebarRight from '../components/SidebarRight';

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
class DashboardPage extends Component<Props> {
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
                <PageAccess page="always">
                    <div className="page-wrapper left-padded">
                        <Header />

                        <div className="page-with-sidebar">
                            <div className="main">
                                <LayoutDashboard />
                            </div>
                            <SidebarRight />
                        </div>
                    </div>
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(DashboardPage)));
