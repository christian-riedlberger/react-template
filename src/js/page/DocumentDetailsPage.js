// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { hot } from 'react-hot-loader/root';
import { authCheck, secretCheck, verifiedCheck } from 'utils/pages';
import { Helmet } from 'react-helmet';
import reloadable from 'utils/reloadable';
import App from 'components/App';
import messages from 'constants/Messages';
import LayoutDocumentDetails from 'components/LayoutDocumentDetails';
import HeaderDocumentDetails from 'components/HeaderDocumentDetails';
import PageAccess from 'containers/PageAccess';

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
class DocumentDetailsPage extends Component<Props> {
    render() {
        const { intl, router } = this.props;

        // eslint-disable-next-line prefer-destructuring
        const documentId = router.params.documentId;

        return (
            <App>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {intl.formatMessage(messages.documentDetailsPage)}
                    </title>
                </Helmet>
                <PageAccess page="documents">
                    <div className="page-wrapper left-padded">
                        <HeaderDocumentDetails />
                        <LayoutDocumentDetails documentId={documentId} />
                    </div>
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(DocumentDetailsPage)));
