// @flow
import React from 'react';
import type { Node } from 'react';

/**
 * @desc render either a react component or call the provided function with the given
 *     props
 * @arg children - React children or function
 * @arg props - props to be passed to children
 * @author bvincent1
 */
export const renderChildren = (
    children: Node | (Object => Node),
    props: Object
): any =>
    typeof children === 'function' && !React.isValidElement(children)
        ? children(props)
        : children;

const render = {
    renderChildren
};

export default render;
