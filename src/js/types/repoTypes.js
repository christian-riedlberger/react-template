// @flow

/**
 * Version prop Types
 */
export type Version = {
    nodeRef: string,
    version: string,
    description?: string,
    majorVersion: boolean
};

/**
 * Node prop Types
 */
export type Node = {
    nodeName?: string,
    nodeRef: string,
    name: string,
    description?: string,
    createFolder?: boolean,
    creator: string,
    modifier: string,
    created: string,
    modified: string,
    shortName: string,
    parentRef: string,
    size?: string,
    isOrgRoot: boolean,
    isOrgFolder: boolean,
    permission: {
        clone: boolean,
        comment: boolean,
        create: boolean,
        destroy: boolean,
        lockdown: boolean,
        write: boolean
    },
    type: string
};

/**
 * File prop Types
 */
export type File = {
    nodeRef: string,
    file: Array<Object>
};

export type Actions =
    | 'view'
    | 'new'
    | 'edit'
    | 'move'
    | 'copy'
    | 'delete'
    | 'permissions'
    | 'download'
    | 'properties'
    | 'open';
