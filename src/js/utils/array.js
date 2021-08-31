// @flow
import _ from 'lodash';

/**
 * Moves an array item from one position in an array to another.
 * Note: This is a pure function so a new array will be returned, instead
 * of altering the array argument.
 * @param {array} array  : Array in which to move an item.         (required)
 * @param {int} moveIndex : The index of the item to move.          (required)
 * @param {int} toIndex : The index to move item at moveIndex to. (required)
 */
export function move (array: Array<Object | string | number>, moveIndex: number, toIndex: number) {
    const itemRemovedArray = [
        ...array.slice(0, moveIndex),
        ...array.slice(moveIndex + 1, array.length)
    ];

    return [
        ...itemRemovedArray.slice(0, toIndex),
        array[moveIndex],
        ...itemRemovedArray.slice(toIndex, itemRemovedArray.length)
    ];
}

/**
 * Updates first array with values from second array. If either array is falsy,
 * returns the other array.
 */
export function updateBy(arr1: Array<any>, arr2: Array<any>, mergeProperty: string): Array<any> {
    if (_.isEmpty(arr1)) return arr2;
    if (_.isEmpty(arr2)) return arr1;
    return _.map(arr1, a => (_.assign(a, (arr2[_.indexOf(_.map(arr2, mergeProperty), a[mergeProperty])] || {}))));
}

/**
 * Update first array with matching object from seconds, and concat remaining object from second
 * @arg arr1 - first array to be updated / concated against
 * @arg arr2 - array to update / concat with
 * @arg mergeProperty - object propery to merge arrays by
 */
export function mergeBy(arr1: Array<Object>, arr2: Array<Object>, mergeProperty: string) {
    return _.uniqBy(
        _.concat(
            updateBy(
                _.cloneDeep(arr1),
                arr2,
                mergeProperty
            ),
            arr2
        ),
        mergeProperty
    )
}
