// @flow
import _ from 'lodash';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import {
    pushCrumb,
    popCrumb,
    setCrumb,
    clearCrumbs,
    pushCrumbNS,
    popCrumbNS,
    setCrumbNS,
    clearCrumbsNS,
    updateCrumb,
    updateCrumbNS
} from 'actions/ActionBreadcrumb';
import type { Crumb } from 'types/breadcrumbTypes';
import { applyArgument } from 'utils/container';

type Selector = Object => string;

export type Args = {
    init?: Array<Crumb> | Selector,
    ns?: string | Selector,
    pick?: Array<string>,
    omit?: Array<string>
};

export type ContainerProps = {
    pushCrumb: (Crumb, ?string) => Object,
    popCrumb: (?string) => Object,
    setCrumb: (Crumb, number, ?string) => Object,
    clearCrumbs: (?string) => Object,
    updateCrumb: (Crumb, number, ?string) => Object,
    breadcrumbs:
        | {
              breadcrumbs: {
                  [string]: { breadcrumbs: Array<Crumb> }
              }
          }
        | Array<Crumb>
};

const BreadcrumbContainer = (args?: Args) => {
    const selector = (store, parentProps) => {
        // default to root breadcrumbs value
        let props = { breadcrumbs: store.breadcrumbs };

        if (args && args.ns) {
            if (typeof args.ns === 'function') {
                const ns = args.ns({
                    ...parentProps,
                    ...store.breadcrumbs
                });
                if (ns) {
                    props = { breadcrumbs: store.breadcrumbs[ns] || {} };
                }
            } else {
                props = { breadcrumbs: store.breadcrumbs[args.ns] || {} };
            }
        }

        if (args && args.pick) return _.pick(props, args.pick);
        if (args && args.omit) return _.omit(props, args.omit);

        return props;
    };

    let actions = {
        pushCrumb,
        popCrumb,
        setCrumb,
        clearCrumbs,
        updateCrumb
    };

    // apply namespacing to actions
    if (args && args.ns) {
        actions = (dispatch, props) => {
            let ns = '';
            if (typeof args.ns === 'function') ns = args.ns(props);
            if (typeof args.ns === 'string') ({ ns } = args);

            return {
                pushCrumb: crumb => dispatch(pushCrumbNS(ns || '')(crumb)),
                popCrumb: () => dispatch(popCrumbNS(ns)()),
                setCrumb: (crumb: Crumb, index: number) =>
                    dispatch(setCrumbNS(ns)(crumb, index)),
                clearCrumbs: () => dispatch(clearCrumbsNS(ns)()),
                updateCrumb: (crumb: Crumb, index: number) =>
                    dispatch(updateCrumbNS(ns)(crumb, index))
            };
        };
    }
    return compose(
        connect(
            selector,
            actions
        ),
        lifecycle({
            componentDidMount() {
                if (args) {
                    applyArgument(this.props.setCrumb, args.init, this.props);
                }
            }
        })
    );
};

export default BreadcrumbContainer;
