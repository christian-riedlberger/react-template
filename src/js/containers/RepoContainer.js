// @flow
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';
import _ from 'lodash';

import {
    fetchNode,
    fetchFolders,
    fetchDocuments,
    fetchDocumentsUsers,
    fetchDocument,
    clearActiveFile,
    clearActiveFolder,
    clearFolders,
    toggleOpenFolder,
    setActiveFolder,
    setActiveFile,
    createFolder,
    updateFolder,
    deleteNode,
    copyNode,
    moveNode,
    uploadFile,
    uploadFileFinish,
    uploadFileAdd,
    uploadFileRemove,
    uploadFileError,
    uploadFileCancel,
    uploadFileClear,
    refreshFileFinish,
    fetchFolder,
    fetchDocumentNodes,
    fetchSharedDocuments,
    updateNode,
    uploadFileRequest,
    copyFileRequest,
    setActiveRepo,
    refreshTreeNodes,
    clearTreeNodes,
    fetchDataListDocuments,
    clearDataListDocuments
} from 'actions/ActionRepo';
import {
    getRecentDocuments,
    pushRecentDocument,
    clearRecentDocuments
} from 'actions/ActionRecents';
import { fetchPermission, updatePermission } from 'actions/ActionPermission';
import {
    FETCH_NODE,
    FETCH_DOCUMENTS,
    FETCH_DOCUMENTS_USERS,
    UPDATE_FOLDER,
    MOVE_FOLDER,
    FETCH_PERMISSION,
    FETCH_FOLDERS,
    FETCH_DOCUMENT_NODES,
    UPLOAD_FILE_REQUEST,
    COPY_FILE_REQUEST
} from 'constants/ActionTypes';
import type { Node as NodeType } from 'types/repoTypes';

/**
 * Selector function that returns a value from the component's own props
 * @arg Object - component's own props
 */
type PropsSelector = Object => string;

export type ContainerArgs = {
    nodeRef?: string | PropsSelector,
    folderRef?: string | PropsSelector,
    permissionRef?: string | PropsSelector,
    parentRef?: string | PropsSelector,
    ns?: string | PropsSelector,
    documentRef?: string | PropsSelector,
    pick?: Array<string>,
    omit?: Array<string>,
    fetchDocumentsUsers?: string | PropsSelector
};

export type ContainerProps = {
    activeFolder: NodeType,
    fetchNode: (nodeRef: string) => Promise<NodeType>,
    fetchFolder: ({ nodeRef: string }) => Promise<NodeType>,
    fetchPermission: (nodeRef: string, name: string) => Promise<NodeType>,
    fetchFolders: (
        parentRef?: string
    ) => Promise<
        Array<NodeType> | { value: { data: { data: Array<NodeType> } } }
    >,
    clearFolders: () => Array<NodeType>,
    clearActiveFolder: Function,
    isLoadingPermission: boolean,
    clearActiveFile: Function,
    toggleOpenFolder: Function,
    setActiveFolder: Function,
    setActiveFile: Function,
    createFolder: (node: NodeType) => Promise<NodeType>,
    updateFolder: (node: NodeType) => Promise<NodeType>,
    updateNode: (node: NodeType) => Promise<NodeType>,
    deleteNode: Function,
    copyNode: (nodeRef: string, parentRef: string) => Promise<Object>,
    moveNode: (nodeRef: string, parentRef: string) => Promise<Object>,
    files: Array<Object>,
    totalItems: Number,
    uploadFiles: Object,
    uploadSelectedFiles: Array<File>,
    uploadDialogShow: boolean,
    activeFile: Object,
    activeFileIsLoading: boolean,
    fetchDocuments: Function,
    fetchDocumentsUsers: Function,
    updatePermission: Function,
    uploadFile: Function,
    uploadFileFinish: Function,
    uploadFileAdd: Function,
    uploadFileClear: Function,
    uploadFileRemove: Function,
    uploadFileError: Function,
    uploadFileCancel: Function,
    refreshFileFinish: Function,
    fetchDocuments: Function,
    fetchDocument: Function,
    fetchDocumentNodes: Function,
    fetchSharedDocuments: Function,
    businessRefs: Array<string>,
    personalRef: string,
    sharedRef: string,
    uploadFileRequest: Function,
    isRootPath: boolean,
    copyFileRequest: Function,
    requestFiles: Array<{ nodeRef: string, fileName: string }>,
    activeRepo: 'business' | 'personal' | 'shared',
    setIsSharedRepo: Function,
    repoModifiers: Array<any>,
    treeNodes: Array<string>,
    refreshTreeNodes: (Array<string>) => void,
    clearTreeNodes: () => void,
    fetchDataListDocuments: Object => Promise<Object>,
    clearDataListDocuments: () => void,
    needsFilesRefresh: boolean,
    documentsIsLoading: boolean,
    fetchDocumentsUsersisLoading: boolean,
    documentsUsersIsLoading: boolean,
    documentsError: Array<string>,
    documents: Array<Object>,
    getRecentDocuments: Function,
    pushRecentDocument: Function,
    clearRecentDocuments: Function
};

const RepoContainer = (args?: ContainerArgs) => {
    const selector = (store): Object => {
        const props = {
            activeOrg: store.access.activeOrg,
            forceVersionUpdate: store.versionHistory.forceVersionUpdate,
            activeNode: store.repo.activeNode,
            activePermission: store.repo.activePermission,
            isLoadingPermission: store.repo.isLoadingPermission,
            folders: store.repo.folders,
            activeFolder: store.repo.activeFolder,
            activeFile: store.repo.activeFile,
            files: store.repo.files,
            pagination: store.repo.pagination,
            uploadFiles: store.repo.uploadFiles,
            uploadSelectedFiles: store.repo.uploadSelectedFiles,
            uploadDialogShow: store.repo.uploadDialogShow,
            value: store.repo.uploadFiles.value,
            selectedItems: store.repo.selectedItems,
            needsFilesRefresh: store.repo.needsFilesRefresh,
            businessRefs: store.repo.businessRefs,
            personalRef: store.repo.personalRef,
            sharedRef: store.repo.sharedRef,
            requestFiles: store.repo.requestFiles,
            activeRepo: store.repo.activeRepo,
            isRootPath: store.repo.isRootPath,
            activeFileIsLoading: store.repo.activeFileIsLoading,
            repoModifiers: store.repo.modifiers,
            treeNodes: store.repo.treeNodes,
            documents: store.repo.documents,
            documentsError: store.repo.documentsError,
            documentsIsLoading: store.repo.documentsIsLoading,
            recentDocuments: store.repo.recentDocuments,
            fetchDocumentsUsersIsLoading:
                store.repo.fetchDocumentsUsersIsLoading,
            [`${_.camelCase(FETCH_NODE)}IsLoading`]: store.repo[
                `${_.camelCase(FETCH_NODE)}IsLoading`
            ],
            [`${_.camelCase(FETCH_DOCUMENTS)}IsLoading`]: store.repo[
                `${_.camelCase(FETCH_DOCUMENTS)}IsLoading`
            ],
            [`${_.camelCase(FETCH_DOCUMENTS_USERS)}IsLoading`]: store.repo[
                `${_.camelCase(FETCH_DOCUMENTS_USERS)}IsLoading`
            ],
            [`${_.camelCase(UPDATE_FOLDER)}IsLoading`]: store.repo[
                `${_.camelCase(UPDATE_FOLDER)}IsLoading`
            ],
            [`${_.camelCase(MOVE_FOLDER)}IsLoading`]: store.repo[
                `${_.camelCase(MOVE_FOLDER)}IsLoading`
            ],
            [`${_.camelCase(FETCH_PERMISSION)}IsLoading`]: store.repo[
                `${_.camelCase(FETCH_PERMISSION)}IsLoading`
            ],
            [`${_.camelCase(FETCH_FOLDERS)}IsLoading`]: store.repo[
                `${_.camelCase(FETCH_FOLDERS)}IsLoading`
            ],
            [`${_.camelCase(FETCH_DOCUMENT_NODES)}IsLoading`]: store.repo[
                `${_.camelCase(FETCH_DOCUMENT_NODES)}IsLoading`
            ],
            [`${_.camelCase(UPLOAD_FILE_REQUEST)}IsLoading`]: store.repo[
                `${_.camelCase(UPLOAD_FILE_REQUEST)}IsLoading`
            ],
            [`${_.camelCase(COPY_FILE_REQUEST)}IsLoading`]: store.repo[
                `${_.camelCase(COPY_FILE_REQUEST)}IsLoading`
            ]
        };

        // $FlowFixMe
        if (args && args.pick) return _.pick(props, args.pick);
        // $FlowFixMe
        if (args && args.omit) return _.omit(props, args.omit);

        return props;
    };

    let actions = {
        fetchNode,
        fetchPermission,
        fetchFolders,
        fetchFolder,
        fetchDocuments,
        fetchDocumentsUsers,
        fetchDocument,
        clearActiveFolder,
        clearActiveFile,
        clearFolders,
        toggleOpenFolder,
        setActiveFolder,
        setActiveFile,
        createFolder,
        updateFolder,
        deleteNode,
        copyNode,
        moveNode,
        updatePermission,
        uploadFile,
        uploadFileFinish,
        uploadFileAdd,
        uploadFileRemove,
        uploadFileCancel,
        uploadFileError,
        uploadFileClear,
        refreshFileFinish,
        fetchDocumentNodes,
        fetchSharedDocuments,
        updateNode,
        uploadFileRequest,
        copyFileRequest,
        setActiveRepo,
        refreshTreeNodes,
        clearTreeNodes,
        fetchDataListDocuments,
        clearDataListDocuments,
        getRecentDocuments,
        pushRecentDocument,
        clearRecentDocuments
    };

    // $FlowFixMe
    if (args && args.pick) actions = _.pick(actions, args.pick);
    // $FlowFixMe
    if (args && args.omit) actions = _.omit(actions, args.omit);

    return compose(
        connect(
            selector,
            actions
        ),
        lifecycle({
            componentDidMount() {
                let nsProps = null;
                if (args && args.ns) {
                    // $FlowFixMe
                    if (_.isFunction(args.ns)) nsProps = args.ns(this.props);
                    else nsProps = { ns: args.ns };
                }
                if (args && args.nodeRef) {
                    // $FlowFixMe
                    const nodeRef = args.nodeRef(this.props);
                    if (nodeRef) this.props.fetchNode({ nodeRef, ...nsProps });
                }
                if (args && args.folderRef) {
                    // $FlowFixMe
                    const nodeRef = args.folderRef(this.props);
                    if (nodeRef)
                        this.props.fetchFolder({ nodeRef, ...nsProps });
                }
                if (args && args.permissionRef) {
                    // $FlowFixMe
                    const nodeRef = args.permissionRef(this.props);
                    if (nodeRef) this.props.fetchPermission(nodeRef);
                }
                if (args && args.documentRef) {
                    // $FlowFixMe
                    const nodeRef = args.documentRef(this.props);
                    if (nodeRef) this.props.fetchDocument(nodeRef);
                }
                if (args && !_.isUndefined(args.parentRef)) {
                    let nodeRef = '';
                    if (_.isFunction(args.parentRef)) {
                        // $FlowFixMe
                        nodeRef = args.parentRef(this.props);
                    } else {
                        nodeRef = args.parentRef;
                    }
                    this.props.fetchFolders(nodeRef, nsProps);
                }

                // $FlowFixMe
                if (args && args.initDocumentNodes) {
                    this.props.fetchDocumentNodes();
                }
                // $FlowFixMe
                if (args && args.fetchDocumentsUsers) {
                    let nodeRef = '';
                    if (_.isFunction(args.fetchDocumentsUsers)) {
                        // $FlowFixMe
                        nodeRef = args.fetchDocumentsUsers(this.props);
                    } else {
                        nodeRef = args.fetchDocumentsUsers;
                    }
                    if (nodeRef) this.props.fetchDocumentsUsers(nodeRef);
                }
            }
        })
    );
};

export default RepoContainer;
