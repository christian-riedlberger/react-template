/* eslint-disable promise/always-return */
/* eslint-disable promise/param-names */
// @flow
import _ from 'lodash';
import {
    REPO_API,
    VERSION_API,
    REVERT_API,
    MOVE_NODE_API,
    COPY_NODE_API,
    DOCUMENTS_API,
    REPO_FILES_API,
    REPO_API_USERS,
    REPO_SHARED_FILES_API,
    UPLOAD_REQUEST_API,
    COPY_REQUEST_API,
    UPLOAD_FILE_API,
    WORKFLOW_CANCEL_API
} from 'constants/ServiceURI';
import {
    FETCH_NODE,
    FETCH_DOCUMENTS,
    FETCH_DOCUMENTS_USERS,
    FETCH_NODE_VERSIONS,
    CREATE_FOLDER,
    UPDATE_FOLDER,
    CHANGE_ACTIVE_FOLDER,
    DELETE_NODE,
    CLEAR_ACTIVE_FOLDER,
    CLEAR_ACTIVE_FILE,
    TOGGLE_DOC_ITEM,
    UPLOAD_FILE_ADD,
    UPLOAD_FILE_REMOVE,
    UPLOAD_FILE_CANCEL,
    UPLOAD_FILE_ERROR,
    UPLOAD_FILE_CLEAR,
    UPLOAD_FILE_PROGRESS,
    UPLOAD_FILE_FINISH,
    REFRESH_FILE_FINISH,
    COPY_NODE,
    MOVE_NODE,
    FETCH_FOLDERS,
    CLEAR_FOLDERS,
    TOGGLE_OPEN_FOLDER,
    SET_ACTIVE_REPO,
    SET_ACTIVE_FOLDER,
    SET_ACTIVE_FILE,
    FETCH_DOCUMENT_NODES,
    UPDATE_NODE,
    FETCH_FOLDER,
    UPLOAD_FILE_REQUEST,
    COPY_FILE_REQUEST,
    TREE_NEEDS_REFRESH,
    CLEAR_TREE_NODES,
    FETCH_DATALIST_DOCUMENTS,
    CLEAR_DATALIST_DOCUMENTS
} from 'constants/ActionTypes';

import type { Action, ThunkAction } from 'types/actionTypes';
import type { Node, Version } from 'types/repoTypes';
import type { Flux } from 'types/reduxTypes';
import {
    pushRecentDocument,
    removeRecentDocuments
} from 'actions/ActionRecents';
import { deleteChildren } from 'utils/tree';

import { xhr } from './xhr';

/**
 * Fetch a node and its children
 * @function fetchNode
 * @method GET
 * @param  {object} node {nodeRef, name}
 * @return {object} {type, payload}
 */
export function fetchNode(params: Object) {
    const request = xhr.jsonp(REPO_API, {
        ...params,
        folder: params.folderOnly
    });

    return {
        type: FETCH_NODE,
        payload: request
    };
}

/**
 * Fetch a node and its children
 * @function fetchNode
 * @method GET
 * @param  {object} node {nodeRef, name}
 * @return {object} {type, payload}
 */
export function fetchFolder(params: Object) {
    const request = xhr.jsonp(REPO_API, {
        ...params,
        folder: params.folderOnly
    });

    return {
        type: FETCH_FOLDER,
        payload: request
    };
}

/**
 * Fetch a node and its children
 * @function fetchDocuments
 * @method GET
 * @param  {object} node {nodeRef, nodeName}
 * @return {object} {type, payload}
 */
export function fetchDocuments(params: Object) {
    const {
        nodeRef,
        sort,
        desc,
        term,
        maxItems,
        skipCount,
        file,
        includeFolders
    } = params;
    const config = {};

    if (sort) config.sort = sort;
    if (desc === 'descending') config.desc = desc;
    if (term) config.term = term;
    if (maxItems) config.maxItems = maxItems;
    if (skipCount) config.skipCount = skipCount;
    if (file) {
        config.fileModifiedDateStart = file.modifiedStart;
        config.fileModifiedDateEnd = file.modifiedEnd;
        config.fileModifiedBy = file.modifiedBy;
    }
    const request = xhr.jsonp(REPO_FILES_API, {
        parentRef: nodeRef,
        documents: !includeFolders,
        ...config
    });

    return {
        type: FETCH_DOCUMENTS,
        payload: request
    };
}

/**
 * Fetch a node and its children
 * @function fetchDocumentsUsers
 * @method GET
 * @param  {object} node {nodeRef, nodeName}
 * @return {object} {type, payload}
 */
export function fetchDocumentsUsers(parentRef: string) {
    const request = xhr.get(REPO_API_USERS, { parentRef });

    return {
        type: FETCH_DOCUMENTS_USERS,
        payload: request
    };
}

/**
 * Fetch a node and its children
 * @function fetchDocuments
 * @method GET
 * @param  {object} node {nodeRef, nodeName}
 * @return {object} {type, payload}
 */
export function fetchSharedDocuments(params: Object) {
    const {
        sort,
        desc,
        term,
        maxItems,
        skipCount,
        file,
        includeChildren,
        type,
        parentRef,
        modifiedBy,
        modifiedEnd,
        modifiedStart
    } = params;

    const config: Object = {
        includeChildren: includeChildren || false
    };

    if (sort) config.sort = sort;
    if (desc === 'descending') config.desc = desc;
    if (term) config.term = term;
    if (maxItems) config.maxItems = maxItems;
    if (skipCount) config.skipCount = skipCount;

    // read filters from File<Object> or from params Object
    if (file) {
        config.fileModifiedDateStart = file.modifiedStart || modifiedStart;
        config.fileModifiedDateEnd = file.modifiedEnd || modifiedEnd;
        config.fileModifiedBy = file.modifiedBy || modifiedBy;
    } else {
        if (modifiedStart) config.fileModifiedDateStart = modifiedStart;
        if (modifiedEnd) config.fileModifiedDateEnd = modifiedEnd;
        if (modifiedBy) config.fileModifiedBy = modifiedBy;
    }

    if (parentRef) config.parentRef = parentRef;

    const request = xhr.get(REPO_SHARED_FILES_API, {
        type,
        ...config
    });

    return {
        type: FETCH_DOCUMENTS,
        payload: request
    };
}

/**
 * Document details for viewing
 * @param {string} nodeRef
 */
export function fetchDocument(nodeRef: string) {
    const config = {};
    config.preview = true;
    config.nodeRef = nodeRef;

    const lds = localStorage.getItem('auth:lds');
    if (lds) config.lds = lds;

    const request = xhr.jsonp(REPO_API, config);
    return {
        type: SET_ACTIVE_FILE,
        payload: request
    };
}

/**
 * Fetch versions for a exam
 * @function fetchVersions
 * @method GET
 * @param  {string} nodeRef
 * @return {object} {type, payload}
 */
export function fetchVersions(nodeRef: string) {
    const request = xhr.get(VERSION_API, { nodeRef });

    return {
        type: FETCH_NODE_VERSIONS,
        payload: request
    };
}

/**
 * Revert versions for a exam
 * @function revertVersion
 * @method POST
 * @param  {object} version
 * @return {object} {type, payload}
 */
export function revertVersion(version: Version) {
    // Send revert
    const request = xhr.post(REVERT_API, version);

    return {
        type: 'FETCH_NODE_VERSIONS',
        payload: request
    };
}

/**
 * Create a new Document Library folder
 * @function createFolder
 * @method POST
 * @param  {type} folder {nodeRef: string, name: string, description: string}
 * @return {object} {type, payload}
 */
export function createFolder(node: Node, parentRef: string): ThunkAction {
    const params = { ...node, nodeRef: parentRef };
    // $FlowFixMe
    return {
        type: CREATE_FOLDER,
        payload: xhr.post(REPO_API, params)
    };
}

/**
 * Update an Document Library folder
 * @function updateFolder
 * @method PUT
 * @param  {type} folder {nodeRef: string, name: string, description: string}
 * @return {object} {type, payload}
 */
export function updateFolder(folder: Node) {
    return {
        type: UPDATE_FOLDER,
        payload: xhr.put(REPO_API, folder)
    };
}

/**
 * Update an Document Library folder
 * @function updateNode
 * @method PUT
 * @param  {type} folder {nodeRef: string, name: string, description: string}
 * @return {object} {type, payload}
 */
export function updateNode(node: Node) {
    return {
        type: UPDATE_NODE,
        payload: xhr.put(REPO_API, node)
    };
}

export function dispatchDeleteFolder(): ThunkAction {
    return (dispatch: Function, getState: Function) => {
        const { folders, activeFolder } = getState().repo;

        dispatch({
            type: DELETE_NODE,
            payload: {
                folders: deleteChildren(folders, activeFolder)
            }
        });
    };
}

export function dispatchDeleteNode(nodeRefs: Array<Object>): ThunkAction {
    return (dispatch: Function, getState: Function) => {
        const activeFolder = { ...getState().repo.activeFolder };

        activeFolder.files = activeFolder.files.filter(
            file => _.indexOf(nodeRefs, file.nodeRef) === -1
        );

        dispatch({
            type: DELETE_NODE,
            payload: {
                activeFolder
            }
        });
    };
}

/**
 * Deletes the node with identifier nodeId.
 * If the nodeId is a folder, then its children are also deleted.
 * Deleted nodes move to the trashcan unless the permanent query parameter is true,
 * and the current user is the owner or an admin.
 * @function deleteNode
 * @param  nodeRefs: string {description}
 * @param  nodeRefs: Array<String> {description}
 * @return {object} {type, payload}
 */
export function deleteNode(nodeRefs: Array<String> | string): ThunkAction {
    return (dispatch, __, repo) => {
        const opts = { permanent: false };
        if (_.isArray(nodeRefs)) {
            return xhr
                .put(WORKFLOW_CANCEL_API, {
                    packageRefs: nodeRefs,
                    isDocument: true
                })
                .then(() => {
                    // $FlowFixMe
                    return dispatch({
                        type: DELETE_NODE,
                        // eslint-disable-next-line compat/compat
                        payload: Promise.all(
                            _.map(nodeRefs, nodeRef => {
                                const nodeId = nodeRef.split('/').pop();

                                // $FlowFixMe
                                repo.core.childAssociationsApi.deleteNode(
                                    nodeId,
                                    opts
                                );
                            })
                        ).then(() => {
                            // $FlowFixMe
                            dispatch(removeRecentDocuments(nodeRefs));
                            return { status: 200 };
                        })
                    });
                });
        }

        return xhr
            .put(WORKFLOW_CANCEL_API, {
                packageRefs: [nodeRefs]
            })
            .then(() => {
                const nodeId = nodeRefs.split('/').pop();
                // $FlowFixMe
                return dispatch({
                    type: DELETE_NODE,

                    // $FlowFixMe
                    payload: repo.core.childAssociationsApi.deleteNode(
                        nodeId,
                        opts
                    )
                }).then(() => {
                    // $FlowFixMe
                    dispatch(removeRecentDocuments(nodeRefs));
                    return { status: 200 };
                });
            });
    };
}

/**
 * Clear active folder
 * @function clearActiveFolder
 * @return {type} {description}
 */
export function clearActiveFolder(): Action {
    // $FlowFixMe
    return {
        type: CLEAR_ACTIVE_FOLDER,
        payload: {}
    };
}

export function clearActiveFile(): Action {
    // $FlowFixMe
    return {
        type: CLEAR_ACTIVE_FILE,
        payload: {}
    };
}

/**
 * Change active folder and set createFolder state flag.
 * @function changeActiveFolder
 * @return {object}
 */
export function changeActiveFolder(node: Node): ThunkAction {
    const { nodeRef, createFolder: newCreateFolder } = node;

    return (dispatch: Function, getState: Function, repo: Object) => {
        if (!repo.isLoggedIn())
            return dispatch({
                type: 'LOGGED_IN',
                payload: { isLoggedIn: false, message: '' }
            });

        return xhr.jsonp(REPO_API, { nodeRef }).then(payload =>
            dispatch({
                type: CHANGE_ACTIVE_FOLDER,
                payload: {
                    activeFolder: payload.data,
                    createFolder: newCreateFolder
                }
            })
        );
    };
}

/**
 * Toggle the items in the DocLibList
 * @param {string} nodeRef
 * @param {boolean} isSelected
 * @return {{type, payload}}
 */
export function toggleDocItem(nodeRef: string, isSelected: boolean): Action {
    // $FlowFixMe
    return {
        type: TOGGLE_DOC_ITEM,
        payload: { nodeRef, isSelected }
    };
}

export function resetUploadFile(): ThunkAction {
    return (dispatch: Function, getState: Function, repo: Object) => {
        if (!repo.isLoggedIn())
            return dispatch({
                type: 'LOGGED_IN',
                payload: { isLoggedIn: false, message: '' }
            });

        dispatch({
            type: UPLOAD_FILE_PROGRESS,
            payload: {
                uploadFiles: {
                    promises: [],
                    value: 0,
                    files: []
                }
            }
        });
    };
}

/**
 * Upload file
 * @function uploadFile
 * @method POST
 * @param  {type} acceptedFiles: Array<Object> {description}
 * @param  {type} rejectedFiles: Array<Object> {description}
 * @return {type} {description}
 */
export function uploadFile(
    acceptedFile: Object,
    nodeRef: string,
    cancelToken: any,
    id: string
): ThunkAction {
    return (dispatch: Function) => {
        // eslint-disable-next-line compat/compat
        if (!acceptedFile) return Promise.reject(new Error('unexpectError'));
        // $FlowFixMe
        const formData = new FormData();
        formData.append('destination', nodeRef);
        formData.append('filedata', acceptedFile);
        formData.append('filename', acceptedFile.name);
        formData.append('overwrite', 'false');
        formData.append('thumbnails', 'doclib');
        if (acceptedFile.relativePath) {
            formData.append('uploaddirectory', acceptedFile.relativePath);
            formData.append('createdirectory', 'true');
        }

        const config = {
            onUploadProgress(progressEvent) {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                dispatch({
                    type: UPLOAD_FILE_PROGRESS,
                    payload: {
                        id,
                        percentCompleted
                    }
                });
            },
            cancelToken
        };
        return xhr.multipart(UPLOAD_FILE_API, formData, config);
    };
}

export function uploadFileFinish(data: Object) {
    return {
        type: UPLOAD_FILE_FINISH,
        payload: {
            parentId: data
        }
    };
}

export function uploadFileAdd(files: Array<Object>) {
    return {
        type: UPLOAD_FILE_ADD,
        payload: { files }
    };
}

export function uploadFileRemove(id: string) {
    return {
        type: UPLOAD_FILE_REMOVE,
        payload: { id }
    };
}

export function uploadFileCancel(id: string, all: boolean) {
    return {
        type: UPLOAD_FILE_CANCEL,
        payload: { id, all }
    };
}

export function uploadFileError(id: string, error: any) {
    return {
        type: UPLOAD_FILE_ERROR,
        payload: { id, error }
    };
}

export function uploadFileClear() {
    return {
        type: UPLOAD_FILE_CLEAR
    };
}

export function refreshFileFinish() {
    return {
        type: REFRESH_FILE_FINISH
    };
}

/**
 * Copy item
 * @method PUT
 */
export function copyNode(nodeRef: Array<string> | string, parentRef: string) {
    const nodeRefs = typeof nodeRef === 'string' ? [nodeRef] : nodeRef;

    const request = xhr.post(COPY_NODE_API, {
        nodeRefs,
        parentId: parentRef,
        deepCopy: true
    });

    return {
        type: COPY_NODE,
        payload: request
    };
}

/**
 * Move item
 * @method PUT
 */
export function moveNode(nodeRef: Array<string> | string, parentRef: string) {
    const nodeRefs = typeof nodeRef === 'string' ? [nodeRef] : nodeRef;

    const request = xhr.post(MOVE_NODE_API, {
        nodeRefs,
        parentId: parentRef
    });

    return {
        type: MOVE_NODE,
        payload: request
    };
}

export function fetchFolders(parentRef: string, options?: { ns: string }) {
    const request = xhr.get(REPO_API, { parentRef });

    return {
        type: FETCH_FOLDERS,
        payload: request,
        meta: options
    };
}

export function clearFolders(option: Object) {
    return {
        type: CLEAR_FOLDERS,
        payload: option
    };
}

export function toggleOpenFolder(nodeRef: string) {
    return {
        type: TOGGLE_OPEN_FOLDER,
        payload: { nodeRef }
    };
}

export function setActiveRepo(value: 'shared' | 'business' | 'personal') {
    return {
        type: SET_ACTIVE_REPO,
        payload: value
    };
}

export function setActiveFolder(folder: Node, ns?: string) {
    return {
        type: SET_ACTIVE_FOLDER,
        payload: { folder, ns }
    };
}

export function setActiveFile(file: Object) {
    pushRecentDocument(file.nodeRef);
    return {
        type: SET_ACTIVE_FILE,
        payload: file
    };
}

export function fetchDocumentNodes() {
    const request = xhr.get(DOCUMENTS_API);
    return {
        type: FETCH_DOCUMENT_NODES,
        payload: request
    };
}

export function uploadFileRequest(
    orgName: string,
    recipients: Array<string>,
    files: Array<File>
) {
    // eslint-disable-next-line compat/compat
    const request = Promise.all(
        _.map(files, (file, index) => {
            const formData = new FormData();
            formData.append('orgName', orgName);
            formData.append('recipients', JSON.stringify(recipients));
            formData.append('filedata', file);

            // return xhr.multipart(UPLOAD_REQUEST_API, formData);
            // eslint-disable-next-line compat/compat
            return new Promise((acc, rej) => {
                setTimeout(() => {
                    xhr.multipart(UPLOAD_REQUEST_API, formData)
                        // $FlowFixMe
                        .then(resp => acc(resp))
                        .catch(e => rej(e));
                }, 500 * index);
            });
        })
    );

    return {
        type: UPLOAD_FILE_REQUEST,
        payload: request
    };
}

export function copyFileRequest(
    orgName: string,
    recipients: Array<string>,
    nodeRefs: Array<string>
) {
    // eslint-disable-next-line compat/compat
    const request = xhr.post(COPY_REQUEST_API, {
        orgName,
        recipients,
        nodeRefs
    });

    return {
        type: COPY_FILE_REQUEST,
        payload: request
    };
}

export function refreshTreeNodes(nodes: Array<string>) {
    return {
        type: TREE_NEEDS_REFRESH,
        payload: { nodes }
    };
}

export function clearTreeNodes() {
    return {
        type: CLEAR_TREE_NODES
    };
}

export function fetchDataListDocuments(
    params: Object
): { payload: Promise<Object> } & Flux {
    const request = xhr.get(REPO_FILES_API, {
        path: '/',
        pathContext: 'business',
        ...params
    });

    return {
        type: FETCH_DATALIST_DOCUMENTS,
        payload: request
    };
}

export function clearDataListDocuments(): Flux {
    return {
        type: CLEAR_DATALIST_DOCUMENTS
    };
}
