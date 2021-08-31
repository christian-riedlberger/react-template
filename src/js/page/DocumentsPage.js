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
import LayoutDocuments from 'components/LayoutDocuments';

type Props = {
    intl: intlShape
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
class DocumentsPage extends Component<Props> {
    render() {
        const { intl } = this.props;

        return (
            <App>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {intl.formatMessage(messages.documentsDocTitle)}
                    </title>
                </Helmet>
                <PageAccess page="documents">
                    <LayoutDocuments />
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(DocumentsPage)));
