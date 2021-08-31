// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
    checkLogin,
    login,
    requestPasswordReset,
    resetPassword
} from 'actions/ActionLogin';

/**
 * Selector function that returns a value from the component's own props
 * @arg Object - component's own props
 */
type PropsSelector = Object => string;

export type SigInArgs = {
    type?: string | PropsSelector
};

export type SigInProps = {
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

const SignInContainer = () =>
    compose(
        connect(
            store => ({
                isLoggedIn: store.login.isLoggedIn,
                isLoading: store.login.isLoading,
                message: store.login.message,
                access: store.access
            }),
            {
                checkLogin,
                login,
                requestPasswordReset,
                resetPassword
            }
        )
    );

export default SignInContainer;
