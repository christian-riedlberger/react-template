// @flow
import React, { PureComponent } from 'react';

type Props = {
    password: string,
    verificationPassword: string
};

export default class PasswordVerify extends PureComponent<Props, void> {
    render() {
        const { verificationPassword, password } = this.props;

        const isEqual =
            verificationPassword && password
                ? password.localeCompare(verificationPassword) === 0
                : false;
        const showBar = verificationPassword || password;
        const stateBar = isEqual ? 'equals-state-bar' : 'not-equals-state-bar';
        const panelState = showBar ? stateBar : 'default-state-bar';

        return (
            <div className="password-verify">
                <div className="background-bar">
                    <div className={panelState} />
                </div>
            </div>
        );
    }
}
