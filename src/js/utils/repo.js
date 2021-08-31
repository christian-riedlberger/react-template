// @flow

import _ from 'lodash';

import type { Actions, Node } from 'types/repoTypes';

export const displayAction = (
    node: Node,
    actionName: Actions,
    actions?: Array<Actions>
): boolean => {
    // bail if possible actions are provided and action name isnt present
    if (_.isArray(actions) && _.indexOf(actions, actionName) === -1) {
        return false;
    }

    if (!node) return false;
    if (node.isOrgRoot) return false;

    if (
        actionName !== 'permissions' &&
        actionName !== 'new' &&
        node.isOrgFolder
    )
        return false;

    switch (actionName) {
        case 'new':
            return _.get(node, 'permission.create');
        case 'edit':
            return _.get(node, 'permission.write');
        case 'delete':
            return _.get(node, 'permission.destroy');
        case 'copy':
            return (
                _.get(node, 'permission.create') &&
                _.get(node, 'permission.clone')
            );
        case 'move':
            return (
                _.get(node, 'permission.create') &&
                _.get(node, 'permission.clone')
            );
        case 'permissions':
            return _.get(node, 'permission.destroy');
        case 'download':
            return _.get(node, 'permission.lockdown') === false;
        case 'view':
            return _.get(node, 'type') !== 'cm:folder';
        case 'open':
            return _.get(node, 'type') === 'cm:folder';

        default:
            break;
    }

    return false;
};

export default { displayAction };
