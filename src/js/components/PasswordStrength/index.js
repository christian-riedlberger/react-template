// @flow
import React, { PureComponent } from 'react';

type Props = {
    strength: any
};

export default class PasswordStrength extends PureComponent<Props, void> {
    render() {
        const { strength } = this.props;
        const barState = ` s${strength}`;
        const showBar = strength > 0;

        const panelState = showBar ? 'active-bar' : '';

        return (
            <div className="password-strength">
                <div className={`background-bar ${panelState}`}>
                    <div className={`state-bar ${barState}`} />
                </div>
            </div>
        );
    }
}
