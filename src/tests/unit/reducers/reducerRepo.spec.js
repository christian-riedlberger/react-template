import reducerRepo from 'reducers/reducerRepo';

describe('reducerRepo.js', () => {
    describe('FETCH_FOLDERS_FULFILLED', () => {
        const state = {
            folders: [
                { nodeRef: '123', val: true },
                { nodeRef: '124', val: true },
                { nodeRef: '125' },
                { nodeRef: '126' },
                { nodeRef: '127' },
                { nodeRef: '128' }
            ]
        };
        const fetchFolders = (newFolders, meta) =>
            reducerRepo(state, {
                type: 'FETCH_FOLDERS_FULFILLED',
                payload: { data: { data: newFolders } },
                meta
            });

        it('should update folders & add newly fetched ones', () => {
            expect(
                fetchFolders([
                    { nodeRef: '123', val2: true },
                    { nodeRef: '124', val2: true },
                    { nodeRef: '130', val2: true }
                ])
            ).toEqual({
                folders: [
                    { nodeRef: '123', val: true, val2: true },
                    { nodeRef: '124', val: true, val2: true },
                    { nodeRef: '125' },
                    { nodeRef: '126' },
                    { nodeRef: '127' },
                    { nodeRef: '128' },
                    { nodeRef: '130', val2: true }
                ],
                isLoading: false
            });
        });

        it('should add newly fetched ones', () => {
            expect(
                fetchFolders([
                    { nodeRef: '131' },
                    { nodeRef: '132' },
                    { nodeRef: '133' }
                ])
            ).toEqual({
                folders: [
                    { nodeRef: '123', val: true },
                    { nodeRef: '124', val: true },
                    { nodeRef: '125' },
                    { nodeRef: '126' },
                    { nodeRef: '127' },
                    { nodeRef: '128' },
                    { nodeRef: '131' },
                    { nodeRef: '132' },
                    { nodeRef: '133' }
                ],
                isLoading: false
            });
        });

        it('should update newly fetched ones', () => {
            expect(
                fetchFolders([
                    { nodeRef: '124', val: false },
                    { nodeRef: '125', val: false },
                    { nodeRef: '126', val: false }
                ])
            ).toEqual({
                folders: [
                    { nodeRef: '123', val: true },
                    { nodeRef: '124', val: false },
                    { nodeRef: '125', val: false },
                    { nodeRef: '126', val: false },
                    { nodeRef: '127' },
                    { nodeRef: '128' }
                ],
                isLoading: false
            });
        });

        const stateMeta = {
            folders: [
                { nodeRef: '123', val: true },
                { nodeRef: '124', val: true },
                { nodeRef: '125' },
                { nodeRef: '126', ns: 'test' },
                { nodeRef: '127', ns: 'test' },
                { nodeRef: '128', ns: 'test' }
            ]
        };
        const fetchFoldersMeta = (newFolders, meta) =>
            reducerRepo(stateMeta, {
                type: 'FETCH_FOLDERS_FULFILLED',
                payload: { data: { data: newFolders } },
                meta
            });

        it('should only update namspaced ones', () => {
            expect(
                fetchFoldersMeta(
                    [
                        { nodeRef: '126', val: true, ns: 'test' },
                        { nodeRef: '127', val: true, ns: 'test' }
                    ],
                    { ns: 'test' }
                )
            ).toEqual({
                folders: [
                    { nodeRef: '123', val: true },
                    { nodeRef: '124', val: true },
                    { nodeRef: '125' },
                    { nodeRef: '126', val: true, ns: 'test' },
                    { nodeRef: '127', val: true, ns: 'test' },
                    { nodeRef: '128', ns: 'test' }
                ],
                isLoading: false
            });
        });

        it('should fetch namspaced duplicates', () => {
            expect(
                fetchFoldersMeta(
                    [
                        { nodeRef: '123', val: true, ns: 'test' },
                        { nodeRef: '124', val: true, ns: 'test' }
                    ],
                    { ns: 'test' }
                )
            ).toEqual({
                folders: [
                    { nodeRef: '123', val: true },
                    { nodeRef: '124', val: true },
                    { nodeRef: '125' },
                    { nodeRef: '126', ns: 'test' },
                    { nodeRef: '127', ns: 'test' },
                    { nodeRef: '128', ns: 'test' },
                    { nodeRef: '123', val: true, ns: 'test' },
                    { nodeRef: '124', val: true, ns: 'test' }
                ],
                isLoading: false
            });
        });
    });

    describe('CLEAR_FOLDERS', () => {
        const stateMeta = {
            folders: [
                { nodeRef: '123', val: true, ns: 'test' },
                { nodeRef: '124', val: true, ns: 'test' },
                { nodeRef: '125' },
                { nodeRef: '126', ns: 'test' },
                { nodeRef: '127', ns: 'test' },
                { nodeRef: '128', ns: 'test' }
            ]
        };

        const clearFolders = payload =>
            reducerRepo(stateMeta, { type: 'CLEAR_FOLDERS', payload });
        it('should remove matching folders ', () => {
            expect(clearFolders({ reject: { val: true, ns: 'test' } })).toEqual(
                {
                    folders: [
                        { nodeRef: '125' },
                        { nodeRef: '126', ns: 'test' },
                        { nodeRef: '127', ns: 'test' },
                        { nodeRef: '128', ns: 'test' }
                    ]
                }
            );
        });
    });
});
