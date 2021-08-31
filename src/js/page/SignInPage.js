// @flow
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { secretCheck } from 'utils/pages';
import { Helmet } from 'react-helmet';
import { hot } from 'react-hot-loader/root';
import reloadable from 'utils/reloadable';
import messages from 'constants/Messages';
import SignInWrapper from 'components/SignInWrapper';
import { DialogUploadStatusContainer } from 'components/DialogUploadStatus';

type DefaultProps = {
    classes: Object
};

type Props = {
    intl: intlShape
} & DefaultProps;

/**
 *  @package Dashboard (dashboard)
 *  @container DashboardPage
 *  @desc Dashboard Page Wrapper
 *  @author: mike.priest
 */
@hot
@reloadable
@secretCheck
@injectIntl
class SignInPage extends Component<Props> {
    render() {
        const { intl } = this.props;

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>
                        {intl.formatMessage(messages.dashboardDocTitle)}
                    </title>
                </Helmet>

                <SignInWrapper {...this.props} />
                <DialogUploadStatusContainer />
            </div>
        );
    }
}

export default SignInPage;
