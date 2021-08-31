// @flow
import _ from 'lodash';
import {
    FETCH_NODE,
    FETCH_DOCUMENTS,
    FETCH_DOCUMENTS_USERS,
    CREATE_FOLDER,
    UPDATE_FOLDER,
    DELETE_NODE,
    CLEAR_ACTIVE_FOLDER,
    CLEAR_ACTIVE_FILE,
    COPY_NODE,
    MOVE_NODE,
    FETCH_PERMISSION,
    TOGGLE_DOC_ITEM,
    MOVE_FOLDER,
    UPLOAD_FILE_ADD,
    UPLOAD_FILE_REMOVE,
    UPLOAD_FILE_CANCEL,
    UPLOAD_FILE_ERROR,
    UPLOAD_FILE_CLEAR,
    UPLOAD_FILE_PROGRESS,
    UPLOAD_FILE_FINISH,
    REFRESH_FILE_FINISH,
    LOADING,
    CHANGE_ACTIVE_FOLDER,
    RESET_REPO_FILES,
    FETCH_FOLDERS,
    CLEAR_FOLDERS,
    TOGGLE_OPEN_FOLDER,
    SET_ACTIVE_FOLDER,
    SET_ACTIVE_FILE,
    SET_ACTIVE_REPO,
    FETCH_DOCUMENT_NODES,
    FETCH_FOLDER,
    UPDATE_NODE,
    UPLOAD_FILE_REQUEST,
    COPY_FILE_REQUEST,
    TREE_NEEDS_REFRESH,
    CLEAR_TREE_NODES,
    FETCH_DATALIST_DOCUMENTS,
    CLEAR_DATALIST_DOCUMENTS,
    GET_RECENT_DOCUMENTS,
    CLEAR_RECENT_DOCUMENTS,
    DELETE_RECENT_DOCUMENTS
} from 'constants/ActionTypes';
import { selectedItems } from 'utils/tree';
import { mergeBy } from 'utils/array';
import { REPO_BUSINESS } from 'constants/Config';

/**
 * Folder reducer
 * Maps actions to state
 * @param state default state
 * @param action
 * @return {*}
 */
export default function(
    state: Object = {
        isLoading: false,
        isLoadingDocs: false,
        needsRepoReset: false,
        needsFilesRefresh: false,
        folders: [],
        files: [],
        modifiers: [],
        activeFolder: {},
        activeFileIsLoading: false,
        isRootPath: false,
        activeFile: {},
        createFolder: false,
        selectedItems: [],
        uploadSelectedFiles: [],
        uploadPromises: [],
        uploadDialogShow: false,
        uploadFiles: { value: 0, promises: [], files: [] },
        activePermission: null,
        isLoadingPermission: false,
        permission: null,
        activeNode: null,
        requestFiles: [],
        documentsError: null,
        requestFilesIsLoading: false,
        pagination: {
            totalItems: 0,
            maxItems: 0,
            skipCount: 0,
            page: 0
        },
        activeRepo: REPO_BUSINESS, // default to business repo in sidebar
        treeNodes: [],
        documentsIsLoading: false,
        documents: [],
        recentDocuments: []
    },
    action: Object
) {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                ...action.payload
            };

        /**
         *  Map fetch action creator
         *  to our folders state
         */
        case `${FETCH_NODE}_PENDING`:
            return {
                ...state,
                [`${_.camelCase(FETCH_NODE)}IsLoading`]: true,
                needsRepoReset: false,
                activeNode: {}
            };

        /**
         *  Map fetch action creator
         *  to our folders state
         */
        case `${FETCH_NODE}_FULFILLED`:
            return {
                ...state,
                [`${_.camelCase(FETCH_NODE)}IsLoading`]: false,
                activeNode: action.payload.data
            };
        /**
         *  Map fetch action creator
         *  to our folders state
         */
        case `${FETCH_FOLDER}_PENDING`:
            return {
                ...state,
                [`${_.camelCase(FETCH_NODE)}IsLoading`]: true,
                needsRepoReset: false,
                activeFolder: {}
            };

        /**
         *  Map fetch action creator
         *  to our folders state
         */
        case `${FETCH_FOLDER}_FULFILLED`:
            return {
                ...state,
                [`${_.camelCase(FETCH_NODE)}IsLoading`]: false,
                activeFolder: action.payload.data
            };

        /**
         *  Map fetch action creator
         *  to our activeFolder state
         */
        case `${FETCH_DOCUMENTS}_PENDING`:
            return {
                ...state,
                files: [],
                [`${_.camelCase(FETCH_DOCUMENTS)}IsLoading`]: true
            };

        /**
         *  Map fetch action creator
         *  to our activeFolder state
         */
        case `${FETCH_DOCUMENTS}_FULFILLED`: {
            return {
                ...state,
                files: _.isArray(action.payload.data)
                    ? action.payload.data
                    : action.payload.data.data,
                [`${_.camelCase(FETCH_DOCUMENTS)}IsLoading`]: false,
                isRootPath: action.payload.isRootPath,
                activeFolder: action.payload.data.parent,
                pagination: action.payload.paging
            };
        }

        case `${FETCH_DOCUMENTS_USERS}_PENDING`:
            return {
                ...state,
                [`${_.camelCase(FETCH_DOCUMENTS_USERS)}IsLoading`]: true
            };

        case `${FETCH_DOCUMENTS_USERS}_FULFILLED`: {
            return {
                ...state,
                modifiers: action.payload.data.data,
                [`${_.camelCase(FETCH_DOCUMENTS_USERS)}IsLoading`]: false
            };
        }

        /**
         *  Copy node
         */
        case `${COPY_NODE}_FULFILLED`: {
            return {
                ...state,
                selectedItems: [],
                needsRepoReset: true
            };
        }

        /**
         *  Move node
         */
        case `${MOVE_NODE}_FULFILLED`: {
            return {
                ...state,
                selectedItems: [],
                needsRepoReset: true
            };
        }

        /**
         *  Move node
         */
        case RESET_REPO_FILES: {
            return {
                ...state,
                selectedItems: [],
                needsRepoReset: true
            };
        }

        /**
         *  Map create action creator
         *  to add new folders to our state
         */
        case `${CREATE_FOLDER}_FULFILLED`:
            return {
                ...state,
                ...action.payload,
                needsFilesRefresh: true
            };

        /**
         *  Update a folder by
         *  a given nodeRef
         */
        case `${UPDATE_FOLDER}_PENDING`:
            return {
                ...state,
                [`${_.camelCase(UPDATE_FOLDER)}IsLoading`]: true
            };

        /**
         *  Update a folder by
         *  a given nodeRef
         */
        case `${UPDATE_FOLDER}_FULFILLED`:
            return {
                ...state,
                [`${_.camelCase(UPDATE_FOLDER)}IsLoading`]: false,
                activeFolder: action.payload.data.data
            };

        /**
         *  Update a folder by
         *  a given nodeRef
         */
        case `${UPDATE_NODE}_PENDING`:
            return {
                ...state,
                [`${_.camelCase(UPDATE_FOLDER)}IsLoading`]: true
            };

        /**
         *  Update a folder by
         *  a given nodeRef
         */
        case `${UPDATE_NODE}_FULFILLED`:
            return {
                ...state,
                [`${_.camelCase(UPDATE_FOLDER)}IsLoading`]: false,
                activeNode: action.payload.data.data
            };

        /** F
         *  Map delete action creator
         *  to remove nodes from our state
         */
        case DELETE_NODE: {
            return {
                ...state,
                selectedItems: [],
                ...action.payload
            };
        }

        /**
         *  Clear Repository
         */
        case CLEAR_ACTIVE_FOLDER:
            return {
                ...state,
                documentsError: null,
                isLoading: false,
                activeFolder: {}
            };

        /** *
         * Clear file preview
         */
        case CLEAR_ACTIVE_FILE:
            return {
                ...state,
                isLoading: false,
                activeFile: {}
            };
        /**
         *  Clear active folder
         *  used for editing and viewing
         */
        case CHANGE_ACTIVE_FOLDER:
            return {
                ...state,
                ...action.payload
            };

        /**
         *  Toggle selection of an item
         *  in the DocLibList
         */
        case TOGGLE_DOC_ITEM: {
            const { isSelected, nodeRef } = action.payload;

            return {
                ...state,
                selectedItems: selectedItems(
                    state.selectedItems,
                    isSelected,
                    nodeRef
                )
            };
        }

        /**
         *  Move folder
         *  DocLibTree feature
         */
        case `${MOVE_FOLDER}_PENDING`:
            return {
                ...state,
                isLoading: true
            };

        /**
         * Move folder
         * DocLibTree feature
         */
        // case `${MOVE_FOLDER}_FULFILLED`: {
        //     const { srcFolder, targetFolder } = action.payload;

        //     return {
        //         ...state,
        //         isLoading: false,
        //         folders: moveFolder(
        //             _.clone(state.folders),
        //             _.clone(srcFolder),
        //             _.clone(targetFolder)
        //         )
        //     };
        // }

        /**
         *  Move folder
         *  DocLibTree feature
         */
        case UPLOAD_FILE_PROGRESS: {
            const { id, percentCompleted } = action.payload;
            const { uploadSelectedFiles } = state;
            const temp = [...uploadSelectedFiles];
            const index = _.findIndex(uploadSelectedFiles, fileObject => {
                return _.get(fileObject, 'id') === id;
            });
            if (
                temp[index].percentCompleted !== -1 &&
                percentCompleted > temp[index].percentCompleted
            ) {
                const status = percentCompleted === 100 ? 'success' : 'pending';
                temp.splice(index, 1, {
                    ...temp[index],
                    percentCompleted,
                    status
                });
            }
            return {
                ...state,
                uploadSelectedFiles: temp
            };
        }

        case UPLOAD_FILE_FINISH: {
            const currentFolderId = _.get(state, 'activeFolder.nodeRef');
            const fileParentId = action.payload.parentId;
            if (currentFolderId === fileParentId || action.payload.refresh) {
                return {
                    ...state,
                    needsFilesRefresh: true
                };
            }
            return {
                ...state
            };
        }

        case UPLOAD_FILE_ADD: {
            const { uploadSelectedFiles } = state;
            const { files } = action.payload;
            return {
                ...state,
                uploadSelectedFiles: _.concat(uploadSelectedFiles, files),
                uploadDialogShow: true
            };
        }

        case UPLOAD_FILE_REMOVE: {
            const { uploadSelectedFiles } = state;
            const { id } = action.payload;
            const temp = [...uploadSelectedFiles];
            const index = _.findIndex(uploadSelectedFiles, fileObject => {
                return _.get(fileObject, 'id') === id;
            });
            temp.splice(index, 1, { ...temp[index], status: 'removed' });
            return {
                ...state,
                uploadSelectedFiles: temp
            };
        }

        case UPLOAD_FILE_CANCEL: {
            const { uploadSelectedFiles } = state;
            let temp = [...uploadSelectedFiles];
            if (action.payload.all) {
                temp = _.map(uploadSelectedFiles, file => {
                    if (file.status !== 'success' || file.status !== 'error') {
                        return {
                            ...file,
                            status: 'abort'
                        };
                    }
                    return file;
                });
            } else {
                const index = _.findIndex(uploadSelectedFiles, {
                    id: action.payload.id
                });
                temp.splice(index, 1, {
                    ...temp[index],
                    percentCompleted: -1,
                    status: 'cancel'
                });
            }
            return {
                ...state,
                uploadSelectedFiles: temp
            };
        }

        case UPLOAD_FILE_ERROR: {
            const { uploadSelectedFiles } = state;
            const temp = [...uploadSelectedFiles];
            const index = _.findIndex(uploadSelectedFiles, action.payload);
            temp.splice(index, 1, {
                ...temp[index],
                percentCompleted: -1,
                status: 'error'
            });
            return {
                ...state,
                uploadSelectedFiles: temp
            };
        }

        case UPLOAD_FILE_CLEAR:
            return {
                ...state,
                uploadSelectedFiles: [],
                uploadDialogShow: false
            };

        case REFRESH_FILE_FINISH:
            return {
                ...state,
                needsFilesRefresh: false
            };

        /**
         *  Get permission for a node
         */
        case `${FETCH_PERMISSION}_PENDING`:
            return {
                ...state,
                activePermission: {},
                isLoadingPermission: true
            };

        case `${FETCH_PERMISSION}_FULFILLED`:
            return {
                ...state,
                isLoadingPermission: false,
                activePermission: {
                    ...action.payload.data,
                    nodeRef: action.meta.nodeRef
                }
            };

        case `${FETCH_FOLDERS}_PENDING`:
            return {
                ...state,
                isLoading: true
            };

        case `${FETCH_FOLDERS}_FULFILLED`: {
            if (action.meta && !_.isUndefined(action.meta.ns)) {
                const nsFodlers = _.map(action.payload.data.data, f => ({
                    ...f,
                    ns: action.meta.ns
                }));
                const otherFolders = _.reject(state.folders, {
                    ns: action.meta.ns
                });
                const prevFolders = _.filter(state.folders, {
                    ns: action.meta.ns
                });

                return {
                    ...state,
                    folders: _.concat(
                        otherFolders,
                        mergeBy(prevFolders, nsFodlers, 'nodeRef')
                    ),
                    isLoading: false
                };
            }

            return {
                ...state,
                folders: mergeBy(
                    state.folders,
                    action.payload.data.data,
                    'nodeRef'
                ),
                isLoading: false
            };
        }

        case CLEAR_FOLDERS: {
            const { folders } = state;
            let newFolders = [];
            if (action.payload) {
                const keys = _.keys(action.payload);
                let output = _.cloneDeep(folders);
                _.forEach(keys, k => {
                    output = _[k](folders, action.payload[k]);
                });
                newFolders = output;
            }

            return {
                ...state,
                folders: newFolders
            };
        }

        case TOGGLE_OPEN_FOLDER:
            return {
                ...state,
                folders: _.map(state.folders, f =>
                    f.nodeRef === action.payload.nodeRef
                        ? { ...f, isOpen: !f.isOpen }
                        : f
                )
            };

        case SET_ACTIVE_FOLDER: {
            if (action.payload.ns) {
                return {
                    ...state,
                    activeFolder: {
                        ...state.activeFolder,
                        [action.payload.ns]: action.payload.folder
                    }
                };
            }
            return {
                ...state,
                activeFolder: action.payload.folder
            };
        }

        case `${SET_ACTIVE_FILE}_PENDING`:
            return {
                ...state,
                documentsError: null,
                activeFileIsLoading: true,
                activeFile: null
            };

        case `${SET_ACTIVE_FILE}_FULFILLED`: {
            const { error } = action.payload;
            if (error && error.length > 0) {
                return {
                    ...state,
                    activeFileIsLoading: false,
                    documentsError: error
                };
            }

            const file = action.payload.data;
            if (!_.isEmpty(file)) {
                file.type = file.name.slice(
                    (Math.max(0, file.name.lastIndexOf('.')) || Infinity) + 1
                );
            }
            return {
                ...state,
                activeFileIsLoading: false,
                activeFile: file
            };
        }

        case `${FETCH_DOCUMENT_NODES}_PENDING`:
            return {
                ...state,
                [`${_.camelCase(FETCH_DOCUMENT_NODES)}IsLoading`]: true,
                businessRefs: [],
                personalRef: null,
                sharedRef: null
            };

        case `${FETCH_DOCUMENT_NODES}_FULFILLED`:
            return {
                ...state,
                [`${_.camelCase(FETCH_DOCUMENT_NODES)}IsLoading`]: false,
                businessRefs: _.get(action, 'payload.data.data.businessRefs'),
                personalRef: _.get(action, 'payload.data.data.personalRef'),
                sharedRef: _.get(action, 'payload.data.data.sharedRef')
            };

        case `${UPLOAD_FILE_REQUEST}_PENDING`:
            return {
                ...state,
                requestFiles: [],
                requestFilesIsLoading: true
            };

        case `${UPLOAD_FILE_REQUEST}_FULFILLED`:
            return {
                ...state,
                requestFiles: action.payload,
                requestFilesIsLoading: false
            };

        case `${COPY_FILE_REQUEST}_PENDING`:
            return {
                ...state,
                copyRequestFiles: [],
                copyRequestFilesIsLoading: true
            };

        case `${COPY_FILE_REQUEST}_FULFILLED`:
            return {
                ...state,
                copyRequestFiles: action.payload,
                copyRequestFilesIsLoading: false
            };

        case SET_ACTIVE_REPO:
            return {
                ...state,
                activeRepo: action.payload
            };

        case TREE_NEEDS_REFRESH:
            return {
                ...state,
                treeNodes: action.payload.nodes || []
            };

        case CLEAR_TREE_NODES:
            return {
                ...state,
                treeNodes: []
            };

        case `${FETCH_DATALIST_DOCUMENTS}_PENDING`:
            return {
                ...state,
                documents: [],
                activeFolder: {},
                documentsIsLoading: true
            };

        case `${FETCH_DATALIST_DOCUMENTS}_FULFILLED`: {
            const { error } = action.payload.data;
            if (error && error.length > 0) {
                return {
                    ...state,
                    documentsIsLoading: false,
                    documentsError: error
                };
            }

            return {
                ...state,
                documents: action.payload.data.data,
                activeFolder: action.payload.data.parent,
                pagination: action.payload.data.paging,
                isRootPath: action.payload.data.isRootPath,
                documentsIsLoading: false
            };
        }
        case CLEAR_DATALIST_DOCUMENTS:
            return {
                ...state,
                documentsError: null,
                documents: []
            };

        case `${GET_RECENT_DOCUMENTS}_FULFILLED`:
            return {
                ...state,
                recentDocuments: action.payload.data.data
            };

        case CLEAR_RECENT_DOCUMENTS:
            return {
                ...state,
                recentDocuments: []
            };

        case DELETE_RECENT_DOCUMENTS: {
            const { recentDocuments } = state;
            const nodeRefs = action.payload;
            let temp = [];
            if (!_.isArray(nodeRefs)) {
                temp = _.filter(recentDocuments, ['doc.nodeRef', nodeRefs]);
            } else {
                temp = _.filter(recentDocuments, doc => {
                    return (
                        _.findIndex(nodeRefs, ref => doc.nodeRef === ref) === -1
                    );
                });
            }

            return {
                ...state,
                recentDocuments: temp
            };
        }

        default:
            return state;
    }
}
