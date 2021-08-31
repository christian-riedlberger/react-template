// @flow
import * as React from 'react';
import type { PermissionLevels } from 'types/permissionTypes';

type Props = {
    access: string,
    permission: PermissionLevels,
    children: React.Node
};

/**
 * Wrapper for permissions
 */
const Permission = (props: Props) => {
    const { permission, access, children } = props;

    if (
        permission &&
        access === 'all' &&
        permission.create &&
        permission.write &&
        permission.destroy
    ) {
        return children;
    } else if (permission && permission[access]) {
        return children;
    }
    return null;
};

export default Permission;
