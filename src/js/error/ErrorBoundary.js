// @flow
import React, { Component } from 'react';
import ApplicationError from './ApplicationError';

type Props = {
    children: Object
};

type State = {
    error: boolean,
    uuid: string
};

/**
 * Error handler for the application
 */
class ErrorBoundary extends Component<Props, State> {
    // eslint-disable-next-line react/sort-comp
    constructor(props: Props) {
        super(props);
        this.state = {
            error: false,
            uuid: ''
        };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return { error: true };
    }

    componentDidCatch(e: Error) {
        if (window.Rollbar) {
            window.Rollbar.error(e, (__, data) =>
                this.setState({
                    error: true,
                    uuid: data.result.uuid
                })
            );
        } else {
            this.setState({
                error: true,
                uuid: 'xxxxx_xxxxyx_xxxxx_xxxxx'
            });
        }
    }

    render() {
        const { error, uuid } = this.state;
        if (error) {
            return <ApplicationError uuid={uuid} />;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
