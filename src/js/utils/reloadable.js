// @flow
import React, { Component } from 'react';

type State = {
    reload: boolean
};
const reloadable = (WrappedComponent: any) => {
    class Reloadable extends Component<Object, State> {
        constructor(props: Object) {
            super(props);
            this.state = {
                reload: false
            };
        }

        componentWillReceiveProps(nextProps: Object) {
            const { location } = this.props;
            const { location: nextLocation } = nextProps;

            if (
                nextLocation.pathname === location.pathname &&
                nextLocation.search === location.search &&
                nextLocation.hash === location.hash &&
                nextLocation.key !== location.key
            ) {
                this.setState({ reload: true }, () =>
                    this.setState({ reload: false })
                );
            }
        }

        render() {
            return this.state.reload ? null : (
                <WrappedComponent {...this.props} />
            );
        }
    }

    return Reloadable;
};

export default reloadable;
