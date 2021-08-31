// @flow
import _ from 'lodash';

import {
    PUSH_CRUMB,
    POP_CRUMB,
    CLEAR_CRUMBS,
    SET_CRUMB,
    UPDATE_CRUMB
} from 'constants/ActionTypes';

import type { Crumb } from 'types/breadcrumbTypes';

export type State = {
    breadcrumbs: Array<Crumb>
};
export default function(
    state: State = {
        breadcrumbs: []
    },
    action: {
        type: string,
        payload?: {
            crumb: Crumb | Array<Crumb>,
            index?: number
        },
        meta: {
            ns: string
        }
    }
) {
    switch (action.type) {
        case PUSH_CRUMB:
            return {
                ...state,
                [action.meta.ns || 'breadcrumbs']: action.meta.ns
                    ? {
                        breadcrumbs: _.concat(
                            _.get(state[action.meta.ns], 'breadcrumbs', []),

                            // $FlowFixMe
                            action.payload.crumb
                        )
                    }
                    : // $FlowFixMe
                    _.concat(state.breadcrumbs, action.payload.crumb)
            };

        case POP_CRUMB:
            return {
                ...state,

                [action.meta.ns || 'breadcrumbs']: action.meta.ns
                    ? {
                        breadcrumbs: _.get(
                            state[action.meta.ns],
                            'breadcrumbs',
                            []
                        ).slice(0, -1)
                    }
                    : // $FlowFixMe
                    state.breadcrumbs.slice(0, -1)
            };

        case CLEAR_CRUMBS:
            return {
                ...state,
                [action.meta.ns || 'breadcrumbs']: action.meta.ns
                    ? {
                        breadcrumbs: []
                    }
                    : []
            };

        case SET_CRUMB:
            return {
                ...state,
                [action.meta.ns || 'breadcrumbs']: action.meta.ns
                    ? {
                        breadcrumbs: _.concat(
                            _.get(state[action.meta.ns], 'breadcrumbs', [])
                            // $FlowFixMe
                                .slice(0, action.payload.index || 0),
                            // $FlowFixMe
                            action.payload.crumb
                        )
                    }
                    : _.concat(
                        state.breadcrumbs
                        // $FlowFixMe
                            .slice(0, action.payload.index || 0),
                        // $FlowFixMe
                        action.payload.crumb
                    )
            };

        case UPDATE_CRUMB:
            return {
                ...state,
                [action.meta.ns || 'breadcrumbs']: action.meta.ns
                    ? {
                        breadcrumbs: _.map(
                            _.get(state[action.meta.ns], 'breadcrumbs', []),
                            (crumb, index) =>
                            // $FlowFixMe
                                index === action.payload.index
                                    ? // $FlowFixMe
                                    { ...crumb, ...action.payload.crumb }
                                    : crumb
                        )
                    }
                    : _.map(state.breadcrumbs, (crumb, index) =>
                    // $FlowFixMe
                        index === action.payload.index
                            ? // $FlowFixMe
                            { ...crumb, ...action.payload.crumb }
                            : crumb
                    )
            };

        default:
            return state;
    }
}
