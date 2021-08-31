// @flow

import {
    PUSH_CRUMB,
    POP_CRUMB,
    CLEAR_CRUMBS,
    SET_CRUMB,
    UPDATE_CRUMB
} from 'constants/ActionTypes';
import type { Crumb } from 'types/breadcrumbTypes';

export function pushCrumb(crumb: Crumb, ns?: string) {
    return {
        type: PUSH_CRUMB,
        payload: {
            crumb
        },
        meta: {
            ns
        }
    };
}

export function pushCrumbNS(ns: string) {
    return (crumb: Crumb) => pushCrumb(crumb, ns);
}

export function popCrumb(ns?: string) {
    return {
        type: POP_CRUMB,
        meta: {
            ns
        }
    };
}
export function popCrumbNS(ns: string) {
    return () => popCrumb(ns);
}

export function setCrumb(crumb: Crumb, index: number, ns?: string) {
    return {
        type: SET_CRUMB,
        payload: {
            crumb,
            index
        },
        meta: {
            ns
        }
    };
}

export function setCrumbNS(ns: string) {
    return (crumb: Crumb, index: number) => setCrumb(crumb, index, ns);
}

export function clearCrumbs(ns?: string) {
    return {
        type: CLEAR_CRUMBS,
        meta: {
            ns
        }
    };
}

export function clearCrumbsNS(ns: string) {
    return () => clearCrumbs(ns);
}

export function updateCrumb(crumb: Crumb, index: number, ns?: string) {
    return {
        type: UPDATE_CRUMB,
        payload: {
            crumb,
            index
        },
        meta: {
            ns
        }
    };
}

export function updateCrumbNS(ns: string) {
    return (crumb: Crumb, index: number) => updateCrumb(crumb, index, ns);
}
