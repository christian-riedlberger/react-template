import reducerGroups from 'reducers/reducerGroups';

describe('reducerGroups.js', () => {
    const state = {
        groups: Array(100)
            .fill(null)
            .map((__, index) => ({ name: index.toString() }))
    };

    describe('CLEAR_FETCH_GROUP', () => {
        const clearFetchGroups = payload =>
            reducerGroups(state, { type: 'CLEAR_FETCH_GROUP', payload });

        it('should remove all groups', () => {
            expect(clearFetchGroups()).toEqual({ groups: [] });
        });

        it('should remove groups with name: "0" ', () => {
            expect(clearFetchGroups({ reject: { name: '0' } })).toEqual({
                groups: state.groups.slice(1)
            });
        });

        it('should filter groups with name: "0" ', () => {
            expect(clearFetchGroups({ filter: { name: '0' } })).toEqual({
                groups: [{ name: '0' }]
            });
        });
    });
});
