/* eslint-disable */
import React, { Component } from 'react';
import { intlShape, injectIntl } from 'react-intl';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { authCheck } from 'utils/pages';
import Grid from '@material-ui/core/Grid';
import { hot } from 'react-hot-loader/root';
import reloadable from 'utils/reloadable';
import Avatar from '@material-ui/core/Avatar';
import { AVATAR } from 'constants/ServiceURI';
import { showMessage } from 'actions/ActionMessage';
import messages from 'constants/Messages';
import App from 'components/App';
import WorkflowActions from 'components/WorkflowActions';
import { log } from 'utils/logger';
import DialogPermissionsMulti from 'components/DialogPermissionsMulti';

type DefaultProps = {
    showMessage: Function,
    change: Function,
    formValues: any
};
type Props = {
    intl: intlShape
} & DefaultProps;

const nodes = [
    {
        nodeRef: 'workspace://SpacesStore/f9168f57-e14b-47b0-b563-4b67173db66d'
    },
    {
        nodeRef: 'workspace://SpacesStore/cf157e52-cbf3-47d9-a724-08675ceec579'
    }
];

/**
 *  @package Dashboard (dashboard)
 *  @container DashboardPage
 *  @desc Dashboard Page Wrapper
 *  @author: mike.priest
 */
@authCheck
@connect(
    () => {
        return {};
    },
    {
        showMessage
    }
)
@reduxForm({
    form: 'selectedDateRange',
    enableReinitialize: true
})
class PlayPage extends Component<Props, State> {
    dialog: DialogPermissionsMulti;

    handleSavePermissions = () => {
        log('save', 'red');
    };

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
                <div className="page-wrapper">
                    <Grid container direction="column">
                        <Grid item>
                            <button onClick={() => this.dialog.open()}>
                                open
                            </button>
                        </Grid>
                    </Grid>
                    <DialogPermissionsMulti
                        passRef={ref => {
                            this.dialog = ref;
                        }}
                        nodes={nodes}
                        onSave={this.handleSavePermissions}
                    />
                </div>
            </App>
        );
    }
}
export default hot(reloadable(injectIntl(PlayPage)));
/* eslint-enable */
