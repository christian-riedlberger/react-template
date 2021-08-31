// @flow
import _ from 'lodash';

export function replaceChildren(obj: Array<Object>, replace: Object) {
    return _.transform(obj, (r, value, key) => {
        const result = r;
        if (key === 'nodeRef' && value === replace.nodeRef) {
            result.children = replace.children;
        }
        result[key] =
            _.isArray(value) || _.isObject(value)
                ? replaceChildren(value, replace)
                : value;
    });
}

/**
 * Recurviely check parent obj array and add any matching children objects,
 * merging on ids (nodeRef).
 * @container collections/document library
 * @author benjamin.vincent
 */
export function addChildren(
    parents: Array<Object> | Object,
    children: Array<Object> | Object
): Array<Object> | Object {
    const resp = _.map(_.castArray(parents), p => ({
        ...p,
        children: [
            ...(_.isEmpty(p.children) ? [] : addChildren(p.children, children)),
            ..._.sortBy(
                _.filter(_.castArray(children), c => c.parentId === p.nodeRef),
                'name'
            )
        ]
    }));
    return _.isArray(parents) ? resp : _.head(resp);
}

export function updateChildren(obj: Object, children: Object) {
    return _.transform(obj, (result, value, key) => {
        if (
            (key === 'name' || key === 'description') &&
            obj.nodeRef === children.nodeRef
        ) {
            _.set(
                result,
                key,
                key === 'name' ? children.name : children.description
            );
        } else {
            _.set(
                result,
                key,
                _.isArray(value) || _.isObject(value)
                    ? updateChildren(value, children)
                    : value
            );
        }

        // Sort children
        if (key === 'nodeRef' && value === children.parentId) {
            _.set(result, 'children', _.sortBy(result.children, 'name'));
        }
    });
}

export function deleteChildren(obj: Object, children: Object) {
    return _.transform(obj, (r, value, key) => {
        const result = r;

        if (key === 'children' && obj.nodeRef === children.parentId) {
            result[key] = _.remove(value, n => n.nodeRef !== children.nodeRef);
        } else {
            result[key] =
                _.isArray(value) || _.isObject(value)
                    ? deleteChildren(value, children)
                    : value;
        }
    });
}

export function selectedItems(
    items: Object,
    isSelected: boolean,
    nodeRef: string
) {
    let clonedItems = _.clone(items);
    if (isSelected) {
        // Add
        if (clonedItems.indexOf(nodeRef) === -1) {
            clonedItems.push(nodeRef);
        }
    } else {
        // remove
        // $FlowFixMe
        clonedItems = _.remove(items, n => n !== nodeRef);
    }
    return clonedItems;
}

/**
 * Replace element at provided index in array
 * creates new array
 * @container collections/syllabus
 * @author mike.priest
 * @author benjamin.vincent
 */
export function replaceAt(array: Array<any>, index: number, replacement: any) {
    return _.concat(
        _.slice(array, 0, index),
        replacement,
        _.slice(array, index + 1)
    );
}
