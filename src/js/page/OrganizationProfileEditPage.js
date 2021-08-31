// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { hot } from 'react-hot-loader/root';
import { authCheck, secretCheck, verifiedCheck } from 'utils/pages';
import { Helmet } from 'react-helmet';
import Header from 'components/Header';
import reloadable from 'utils/reloadable';
import App from 'components/App';
import messages from 'constants/Messages';
import FormOrganizationProfile from 'components/FormOrganizationProfile';

type DefaultProps = {
    intl: intlShape,
    router: Object
};

type Props = {} & DefaultProps;

/**
 * Definition of a pie chart
 * @param {*} param0
 */
@authCheck
@secretCheck
@verifiedCheck
class TaskDetailsPage extends Component<Props> {
    render() {
        const { intl, router } = this.props;
        const { orgId } = router.params;

        return (
            <App>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{intl.formatMessage(messages.orgProfilePage)}</title>
                </Helmet>
                <div className="page-wrapper left-padded">
                    <Header bordered />
                    <FormOrganizationProfile orgId={orgId} />
                </div>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(TaskDetailsPage)));
