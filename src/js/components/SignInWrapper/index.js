// @flow
import { log } from 'utils/logger';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
import { withStyles } from '@material-ui/core/styles';
import {
    checkLogin,
    login,
    requestPasswordReset,
    resetPassword
} from 'actions/ActionLogin';
import PropTypes from 'prop-types';
import messages from 'constants/Messages';

import { clearLocalStorage } from 'utils/localStorage';

// Local
import Nav from 'components/Nav';
import SigninForm from './SigninForm';
import ResetUserForm from './ResetUserForm';
import ResetPasswordForm from './ResetPasswordForm';

type DefaultProps = {
    location: any,
    router: any,
    classes: Object,
    isLoggedIn: boolean,
    isLoading: boolean,
    message: string,
    access: any,
    checkLogin: Function,
    login: Function,
    requestPasswordReset: Function,
    resetPassword: Function
};

type Props = {
    intl: intlShape,
    children: any
} & DefaultProps;

type State = {
    showMan: boolean,
    activePage: string,
    reset: boolean,
    resetKey: any,
    resetId: any
};

const styles = {
    root: {
        display: 'flex',
        height: '100%',
        background: '#f1f1f1',
        '& .form-wrapper': {
            margin: '0 auto',
            background: '#fff',
            width: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none'
        },
        '& .jumbo-wrapper': {
            // backgroundColor: '##f1f1f1',
            // backgroundImage: `url(/css/img/brand/login-background.jpeg)`,
            // transition: 'all 0.5s ease',
            // backgroundSize: 'cover',
            // backgroundPosition: 'center',
            // flexGrow: 1
        }
    },
    temp: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 99,
        width: '100%',
        height: '100%'
    },
    pageWrapper: {
        display: 'flex',
        'flex-direction': 'row',
        'justify-content': 'flex-start'
    },
    version: {
        position: 'absolute',
        bottom: '1em',
        right: '1em',
        fontSize: '.9em'
    }
};

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
class SignInWrapper extends Component<Props, State> {
    showTimer: any;

    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props: Props) {
        super(props);

        // eslint-disable-next-line compat/compat
        const urlParams = new URLSearchParams(window.location.search);

        this.state = {
            showMan: false,
            activePage: 'dashboard',
            reset: false,
            resetKey: urlParams.get('key'),
            resetId: urlParams.get('id')
        };
    }

    componentDidMount() {
        const { resetKey, resetId } = this.state;
        const sessionExpiredMessage = null;

        log('onReset HANDLER', 'blue', resetKey && resetId);

        this.props.checkLogin(
            this.props.location.pathname.replace('/', ''),
            sessionExpiredMessage,
            hasAccess => {
                if (!hasAccess) this.context.router.push('noaccess');
            },
            resetKey && resetId
        );
    }

    timer = () => {
        this.showTimer = setTimeout(() => {
            this.setState({
                showMan: true
            });
        }, 750);
    };

    reset = () => {
        this.setState({
            reset: true
        });
    };

    onSignin = ({ username, password }: Object) => {
        const { intl } = this.props;

        // Clear session
        clearLocalStorage();
        localStorage.removeItem('APS_USERNAME');

        const enterCredentialsMessage = intl.formatMessage(
            messages.signingEnterCredentialsMessage
        );
        const invalidCredentialsMessage = intl.formatMessage(
            messages.signingInvalidCredentialsMessage
        );

        this.props.login(
            username,
            password,
            enterCredentialsMessage,
            invalidCredentialsMessage
        );
    };

    onRequestReset = ({ username }: Object) => {
        const { intl } = this.props;

        const enterCredentialsMessage = intl.formatMessage(
            messages.signingEnterUsernameMessage
        );

        this.props.requestPasswordReset(username, enterCredentialsMessage);
    };

    onResetPassword = ({ username, password }: Object) => {
        const { resetKey, resetId } = this.state;
        const { intl } = this.props;

        const enterCredentialsMessage = {
            userMessage: intl.formatMessage(
                messages.signingEnterUsernameMessage
            ),
            passwordMessage: intl.formatMessage(
                messages.signingEnterPasswordMessage
            )
        };

        const credentials = {
            password,
            key: resetKey,
            id: resetId
        };

        this.props.resetPassword(
            username,
            credentials,
            enterCredentialsMessage
        );
    };

    render() {
        const { activePage, resetKey, resetId } = this.state;
        const { classes } = this.props;
        const { isLoggedIn, isLoading, message, access } = this.props;
        const serverMessage = message;

        if (isLoggedIn) {
            return (
                <div className={classes.pageWrapper}>
                    <Nav access={access} activePage={activePage} />
                    {this.props.children}
                </div>
            );
        }

        if (isLoading) return <div className="loading-sreen" />;

        const { showMan, reset } = this.state;
        if (!showMan) this.timer();

        log('onResetPassword BODY key', 'blue', resetKey);
        log('onResetPassword BODY Id', 'blue', resetId);

        if (resetKey && resetId) {
            return (
                <div className={classes.temp}>
                    <div className={classes.root}>
                        <div className="form-wrapper">
                            <ResetPasswordForm
                                onSubmit={this.onResetPassword}
                                serverMessage={serverMessage}
                            />
                        </div>
                        <div className="jumbo-wrapper">
                            <div />
                        </div>
                    </div>
                </div>
            );
        }

        if (!reset) {
            return (
                <div className={classes.temp}>
                    <div className={classes.root}>
                        <div className="form-wrapper">
                            <SigninForm
                                onSubmit={this.onSignin}
                                onReset={this.reset}
                                serverMessage={serverMessage}
                            />
                        </div>
                        <div className="jumbo-wrapper">
                            <div />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={classes.temp}>
                <div className={classes.root}>
                    <div className="form-wrapper">
                        <ResetUserForm
                            onSubmit={this.onRequestReset}
                            serverMessage={serverMessage}
                        />
                    </div>
                    <div className="jumbo-wrapper">
                        <div />
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(SignInWrapper);
