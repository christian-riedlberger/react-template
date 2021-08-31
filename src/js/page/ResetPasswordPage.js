// @flow
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { hot } from 'react-hot-loader/root';
import reloadable from 'utils/reloadable';
import messages from 'constants/Messages';
import ResetPasswordForm from 'components/SignInWrapper';

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
 *  @author: luciano.galvani
 */
class ResetPasswordPage extends Component<Props> {
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
                Reset pass form
                <ResetPasswordForm {...this.props} />
            </div>
        );
    }
}

export default hot(reloadable(injectIntl(ResetPasswordPage)));
