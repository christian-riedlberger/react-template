// @flow
import _ from 'lodash';

/**
 * Apply containter arguments to provided function, with optional <props>
 */
export const applyArgument = (func: Function, arg?: any, props?: Object) => {
    if (_.isUndefined(arg)) return null;

    let functionArg = arg;
    if (_.isFunction(functionArg)) {
        functionArg = functionArg ? functionArg(props) : () => {};
    }

    if (_.isArray(functionArg)) {
        func(...functionArg);
    } else {
        func(functionArg);
    }
    return null;
};

export default { applyArgument };
