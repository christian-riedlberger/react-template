import reducerBreadcrumb from 'reducers/reducerBreadcrumb';
import {
    PUSH_CRUMB,
    POP_CRUMB,
    CLEAR_CRUMBS,
    SET_CRUMB
} from 'constants/ActionTypes';

describe('reducerBreadcrumb.js', () => {
    describe(PUSH_CRUMB, () => {
        const state = { breadcrumbs: [] };
        const pushCrumb = (crumb, stateAlt, ns) =>
            reducerBreadcrumb(stateAlt || state, {
                type: PUSH_CRUMB,
                payload: { crumb },
                meta: {
                    ns
                }
            });

        it('should add crumb', () => {
            expect(pushCrumb({ value: 1 })).toEqual({
                breadcrumbs: [{ value: 1 }]
            });
        });

        it('should add crumb to existing list', () => {
            expect(
                pushCrumb({ value: 2 }, { breadcrumbs: [{ value: 1 }] })
            ).toEqual({ breadcrumbs: [{ value: 1 }, { value: 2 }] });
        });

        it('should add crumb to namespace', () => {
            const stateNonNS = { breadcrumbs: [{ value: 1 }] };
            expect(pushCrumb({ value: 44 }, stateNonNS, 'test')).toEqual({
                ...stateNonNS,
                test: {
                    breadcrumbs: [{ value: 44 }]
                }
            });
        });
    });

    describe(POP_CRUMB, () => {
        const state = { breadcrumbs: [{ value: 1 }] };
        const popCrumb = (stateAlt, ns) =>
            reducerBreadcrumb(stateAlt || state, {
                type: POP_CRUMB,
                meta: {
                    ns
                }
            });

        it('should remove last crumb', () => {
            expect(popCrumb()).toEqual({
                breadcrumbs: []
            });

            const stateLonger = {
                breadcrumbs: [{ value: 1 }, { value: 2 }]
            };
            expect(popCrumb(stateLonger)).toEqual({
                breadcrumbs: [{ value: 1 }]
            });
        });

        it('should remove crumb from namespace', () => {
            const stateNamespaced = {
                breadcrumbs: [{ value: 1 }, { value: 2 }],
                test: {
                    breadcrumbs: [{ value: 1 }, { value: 2 }]
                }
            };

            expect(popCrumb(stateNamespaced, 'test')).toEqual({
                breadcrumbs: [{ value: 1 }, { value: 2 }],
                test: {
                    breadcrumbs: [{ value: 1 }]
                }
            });
        });
    });

    describe(SET_CRUMB, () => {
        const state = { breadcrumbs: [{ value: 1 }] };
        const setCrumb = (crumb, index, stateAlt, ns) =>
            reducerBreadcrumb(stateAlt || state, {
                type: SET_CRUMB,
                payload: { crumb, index },
                meta: {
                    ns
                }
            });

        it('should set crumb', () => {
            expect(setCrumb({ value: 44 }, 0)).toEqual({
                breadcrumbs: [{ value: 44 }]
            });

            const stateLonger = {
                breadcrumbs: [
                    { value: 1 },
                    { value: 2 },
                    { value: 3 },
                    { value: 4 }
                ]
            };
            expect(setCrumb({ value: 44 }, 2, stateLonger)).toEqual({
                breadcrumbs: [{ value: 1 }, { value: 2 }, { value: 44 }]
            });
        });

        it('should init multiple crumbs', () => {
            const stateEmpty = {
                breadcrumbs: []
            };
            expect(
                setCrumb(
                    [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
                    undefined,
                    stateEmpty
                )
            ).toEqual({
                breadcrumbs: [
                    { value: 1 },
                    { value: 2 },
                    { value: 3 },
                    { value: 4 }
                ]
            });
        });

        it('should set crumb in namespace', () => {
            const stateNamespaced = {
                breadcrumbs: [{ value: 1 }, { value: 2 }],
                test: {
                    breadcrumbs: [{ value: 1 }, { value: 2 }]
                }
            };

            expect(setCrumb({ value: 44 }, 1, stateNamespaced, 'test')).toEqual(
                {
                    breadcrumbs: [{ value: 1 }, { value: 2 }],
                    test: {
                        breadcrumbs: [{ value: 1 }, { value: 44 }]
                    }
                }
            );
        });
    });

    describe(CLEAR_CRUMBS, () => {
        const state = { breadcrumbs: [{ value: 1 }] };
        const clearCrumbs = (stateAlt, ns) =>
            reducerBreadcrumb(stateAlt || state, {
                type: CLEAR_CRUMBS,
                meta: {
                    ns
                }
            });

        it('should clear crumbs', () => {
            expect(clearCrumbs()).toEqual({
                breadcrumbs: []
            });

            const stateLonger = {
                breadcrumbs: [
                    { value: 1 },
                    { value: 2 },
                    { value: 3 },
                    { value: 4 }
                ]
            };
            expect(clearCrumbs(stateLonger)).toEqual({
                breadcrumbs: []
            });
        });

        it('should clear namespaced crumbs', () => {
            const stateNamespaced = {
                breadcrumbs: [{ value: 1 }, { value: 2 }],
                test: {
                    breadcrumbs: [{ value: 1 }, { value: 2 }]
                }
            };
            expect(clearCrumbs(stateNamespaced, 'test')).toEqual({
                breadcrumbs: [{ value: 1 }, { value: 2 }],
                test: {
                    breadcrumbs: []
                }
            });
        });
    });
});
