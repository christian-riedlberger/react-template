// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
    checkLogin,
    login,
    requestPasswordReset,
    resetPassword
} from 'actions/ActionLogin';
import { secretCheck } from 'utils/pages';
import { hot } from 'react-hot-loader/root';
import reloadable from 'utils/reloadable';
import LinkExpiredPage from 'page/LinkExpiredPage';
import { loadingTable } from 'constants/styles/LoadingStyles';
import LayoutSelfOnboarding from 'components/LayoutSelfOnboarding';

type DefaultProps = {
    router: any,
    login: Function,
    location: any,
    isLoggedIn: boolean,
    isLoading: boolean
};

type Props = {} & DefaultProps;

const styles = () => ({
    circularProgress: {
        ...loadingTable
    }
});

/**
 *  @package Dashboard (dashboard)
 *  @container DashboardPage
 *  @desc Dashboard Page Wrapper
 *  @author: mike.priest
 */
@secretCheck
@connect(
    store => {
        return {
            isLoggedIn: store.login.isLoggedIn,
            isLoading: store.login.isLoading,
            message: store.login.message,
            access: store.access
        };
    },
    { checkLogin, login, requestPasswordReset, resetPassword }
)
class SelfOnboardingPage extends Component<Props> {
    componentDidMount() {
        const { userName, key } = this.props.router.location.query;

        this.props.login(userName, key);
    }

    render() {
        const { isLoggedIn, isLoading } = this.props;
        const { userName, key, workflowId } = this.props.router.location.query;

        if (isLoading) return <div className="loading-screen" />;

        if (isLoggedIn) {
            return (
                <div
                    className="page-wrapper"
                    style={{ backgroundColor: '#fff' }}
                >
                    <div className="restricted">
                        <LayoutSelfOnboarding
                            username={userName}
                            tempKey={key}
                            workflowId={workflowId}
                        />
                    </div>
                </div>
            );
        }

        return <LinkExpiredPage />;
    }
}

export default hot(reloadable(withStyles(styles)(SelfOnboardingPage)));
