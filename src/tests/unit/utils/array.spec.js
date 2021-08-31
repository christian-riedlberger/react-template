import * as array from 'utils/array';

import { prefixer } from 'utils/logger';

const shd = msg => (prefixer('should', msg));

describe('array.js', () => {
    describe.skip('update', () => {
        it(shd('update 2 arrays by id'), () => {
            const arr1 = [{ a: 1, id: 0 }];
            const arr2 = [{ a: 2, id: 0 }];
            const results = array.update(arr1, arr2, 'id');

            expect(results).toEqual([{ a: 2, id: 0 }]);
        });

        it(shd('update 2 arrays with multiple objects'), () => {
            const arr1 = [{ a: 1, id: 0 }, { a: 2, id: 1 }, { a: 3, id: 2 }];
            const arr2 = [{ a: 2, id: 0 }];
            const results = array.update(arr1, arr2, 'id');

            expect(results).toEqual([{ a: 2, id: 0 }, { a: 2, id: 1 }, { a: 3, id: 2 }]);
        });

        it(shd('not include any object that arent present in the first array'), () => {
            const arr1 = [{ a: 1, id: 0 }];
            const arr2 = [{ a: 2, id: 0 }, { a: 3, id: 1 }];
            const results = array.update(arr1, arr2, 'id');

            expect(results).toEqual([{ a: 2, id: 0 }]);
        });

        it(shd('not include any object that arent present in the first array'), () => {
            const arr1 = [{ a: 1, id: 0 }];
            const arr2 = [{ a: 2, id: 0 }, { a: 3, id: 1 }];
            const results = array.update(arr1, arr2, 'id');

            expect(results).toEqual([{ a: 2, id: 0 }]);
        });

        it(shd('update 2 arrays with multiple objects and multiple mappings'), () => {
            const arr1 = [{ a: 1, id: 0 }, { a: 2, id: 1 }, { a: 3, id: 2 }];
            const arr2 = [{ a: 2, id: 0 }, { a: 4, id: 2 }];
            const results = array.update(arr1, arr2, 'id');

            expect(results).toEqual([{ a: 2, id: 0 }, { a: 2, id: 1 }, { a: 4, id: 2 }]);
        });

        it(shd('update non-array'), () => {
            const arr1 = [{ a: 2, id: 0 }, { a: 4, id: 2 }];
            const results = array.update(arr1, null, 'id');

            expect(results).toEqual([{ a: 2, id: 0 }, { a: 4, id: 2 }]);
        });

        it(shd('update non-array'), () => {
            const arr1 = [{ a: 2, id: 0 }, { a: 4, id: 2 }];
            const results = array.update(null, arr1, 'id');

            expect(results).toEqual([{ a: 2, id: 0 }, { a: 4, id: 2 }]);
        });
    });

    describe('move', () => {
        it(shd('move item "0" to position "1"'), () => {
            const arr1 = ['a', 'b'];
            const results = array.move(arr1, 0, 1);

            expect(results).toEqual(['b', 'a']);
        });

        it(shd('move item "1" to position "0"'), () => {
            const arr1 = ['a', 'b'];
            const results = array.move(arr1, 1, 0);

            expect(results).toEqual(['b', 'a']);
        });

        it(shd('move item "3" to position "0"'), () => {
            const arr1 = ['a', 'b', 'c', 'd'];
            const results = array.move(arr1, 3, 0);

            expect(results).toEqual(['d', 'a', 'b', 'c']);
        });

        it(shd('move item "3" to position "1"'), () => {
            const arr1 = ['a', 'b', 'c', 'd'];
            const results = array.move(arr1, 3, 1);

            expect(results).toEqual(['a', 'd', 'b', 'c']);
        });
    });
});
