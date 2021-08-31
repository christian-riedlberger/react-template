// @flow
import React, { Component } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { hot } from 'react-hot-loader/root';
import { authCheck, secretCheck, verifiedCheck } from 'utils/pages';
import { Helmet } from 'react-helmet';
import reloadable from 'utils/reloadable';
import App from 'components/App';
import messages from 'constants/Messages';
import FormUserEdit from 'components/FormUserEdit';
import ErrorMessage from 'components/ErrorMessage';
import Header from 'components/Header';
import PageAccess from 'containers/PageAccess';
import UserContainer from 'containers/UserContainer';

type DefaultProps = {
    intl: intlShape,
    router: Object,
    serverMessage: Array<string>
};

type Props = {} & DefaultProps;

@authCheck
@secretCheck
@verifiedCheck
@UserContainer({})
class UserFormPage extends Component<Props> {
    render() {
        const { intl, serverMessage } = this.props;
        const userName = this.props.router.params.user;

        const isAdmin = localStorage.getItem('auth:userIsAdmin');
        const editAllowed =
            isAdmin === 'true' ||
            userName === localStorage.getItem('auth:username');

        return (
            <App>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>{intl.formatMessage(messages.labelNewReport)}</title>
                </Helmet>
                <PageAccess page="always">
                    <div className="page-wrapper left-padded">
                        {serverMessage && serverMessage.length > 0 ? (
                            <Header bordered />
                        ) : (
                            <Header page="people" bordered />
                        )}

                        {editAllowed && <FormUserEdit userName={userName} />}
                        {!editAllowed && (
                            <ErrorMessage errors={['noPageAccess']} />
                        )}
                    </div>
                </PageAccess>
            </App>
        );
    }
}

export default hot(reloadable(injectIntl(UserFormPage)));
