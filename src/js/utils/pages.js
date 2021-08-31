// @flow
import React, { Component } from 'react';
import { ALFRESCO_AUTH_OPTS, IDLETIMER } from 'constants/Config';
import AlfrescoApi from 'alfresco-js-api';
import IdleTimer from 'react-idle-timer';

/**
 * Check if user is logged in
 * @param {*} WrappedComponent
 */
export const authCheck = (WrappedComponent: any) => {
    return (props: Object) => {
        const repository = new AlfrescoApi({
            ...ALFRESCO_AUTH_OPTS,
            ticketEcm: localStorage.getItem('auth:ticket')
        });

        if (!repository.isLoggedIn()) {
            window.location = '/';
            return false;
        }

        return <WrappedComponent {...props} />;
    };
};

/**
 * Get URL variables
 */
export const getUrlVars = () => {
    const vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        vars[key] = value;
    });
    return vars;
};

/**
 * Check if user is logged in
 * @param {*} WrappedComponent
 */
export const secretCheck = (WrappedComponent: any) => {
    return (props: Object) => {
        const { lds } = getUrlVars();
        if (lds) localStorage.setItem('auth:lds', lds);

        return <WrappedComponent {...props} />;
    };
};

/**
 *
 * @param {*} WrappedComponent
 */
export const verifiedCheck = (WrappedComponent: any) => {
    return (props: Object) => {
        const isVerified = localStorage.getItem('auth:verified');
        if (isVerified === 'unverified') {
            window.location = '/unverified';
            return false;
        }
        return <WrappedComponent {...props} />;
    };
};

export const adminCheck = (WrappedComponent: any) => {
    return (props: Object) => {
        const isAdmin = localStorage.getItem('auth:userIsAdmin');
        if (isAdmin !== 'true') {
            window.location = '/noaccess';
            return false;
        }
        return <WrappedComponent {...props} />;
    };
};

/**
 * Idle wrapper
 * @param {*} WrappedComponent
 * @param {*} selectData
 */
export const idler = (WrappedComponent: any) => {
    return class extends Component<null> {
        idleTimer: IdleTimer;

        onActive = () => {
            this.idleTimer.reset();
        };

        onIdle = () => {
            localStorage.removeItem('auth:ticket');
            localStorage.removeItem('auth:expires');
            window.location.href = '/';
        };

        render() {
            if (IDLETIMER === 0) return <WrappedComponent {...this.props} />;

            return (
                <IdleTimer
                    ref={ref => {
                        this.idleTimer = ref;
                    }}
                    element={document}
                    startOnMount
                    onActive={this.onActive}
                    onIdle={this.onIdle}
                    timeout={1000 * 60 * IDLETIMER}
                >
                    <WrappedComponent {...this.props} />
                </IdleTimer>
            );
        }
    };
};
