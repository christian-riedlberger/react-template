// @flow
import React, { useRef, Fragment, useState } from 'react';
import { withRouter } from 'react-router';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShareIcon from '@material-ui/icons/PersonAddOutlined';
import AddIcon from '@material-ui/icons/Add';
import { compose } from 'recompose';

import messages from 'constants/Messages';
import MessageContainer from 'containers/MessageContainer';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import DialogFolderConfirm from 'components/DialogFolderConfirm';
import DialogFolder from 'components/DialogFolder';
import DialogTreeLibrarySelect from 'components/DialogTreeLibrarySelect';
import DialogPermissions from 'components/DialogPermissions';
import type { Node, Actions } from 'types/repoTypes';
import { DOWNLOAD_URL } from 'constants/ServiceURI';
import DialogNode from 'components/DialogNode';
import DialogProperties from 'components/DialogProperties';
import { REPO_BUSINESS, REPO_PERSONAL } from 'constants/Config';
import { getHashPaths, createHashPath } from 'utils/location';
import { displayAction } from 'utils/repo';
import type { ValidateArgs } from 'components/DialogTreeLibrarySelect';

export type HandlerArgs = {
    target: Node,
    destination?: Node,
    action: Actions
};

type DefaultProps = {
    intl: intlShape.nodeRef,
    router: Object,
    showMessage: Function
} & RepoContainerProps;

type Props = {
    folder: any,
    file: any,
    onClose: Function, // close self

    // needs one of the following props
    passRef?: HTMLButtonElement,
    coords?: {
        mouseX: number | null,
        mouseY: number | null
    },

    onSave?: Function, // form success callback
    actions?: Array<Actions>,
    activeFolder: Object
} & DefaultProps;

const useStyles = makeStyles({
    root: {}
});

const MenuActionsRepo = (props: Props) => {
    const {
        intl,
        coords,
        onClose,
        folder,
        file,
        deleteNode,
        showMessage,
        activeFolder, // $FlowFixMe
        moveNode, // $FlowFixMe
        copyNode,
        passRef,
        onSave,
        actions,
        setActiveFile,
        router,
        activeRepo,
        businessRefs,
        personalRef,
        setActiveFolder
    } = props;

    // Exit if given `passRef` and `coords` props
    if (passRef && coords) {
        throw new Error(
            'Cannot pass both `passRef` and `coords` props, use one or the other'
        );
    }

    const classes = useStyles();
    const dialogFolderConfirm = useRef({});
    const newDialogForm = useRef({});
    const editDialogForm = useRef({});
    const moveDialog = useRef({});
    const copyDialog = useRef({});
    const permissionsDialog = useRef({});
    const propertiesDialog = useRef({});

    const node = folder || file;

    const [selectedFolder, setSelectedFolder]: [
        null | Node,
        Function
    ] = useState(null);

    /**
     * New Folder handlers
     */
    const handleClickNew = () => {
        newDialogForm.current.open();
        onClose(); // close menu
    };

    const handleFolderNew = (newFolder: Node) => {
        newDialogForm.current.close();
        showMessage({
            messages: 'messageFolderCreateSuccess',
            variant: 'success'
        });
        if (onSave) onSave({ target: newFolder, action: 'new' });
    };

    /**
     * Edit Folder handlers
     */
    const handleClickEdit = () => {
        editDialogForm.current.open();
        onClose(); // close menu
    };

    /**
     * Properties handlers
     */
    const handleClickProperties = () => {
        propertiesDialog.current.open();
        onClose(); // close menu
    };

    const handleFolderEdit = (editedFolder: Node) => {
        editDialogForm.current.close();
        showMessage({
            messages: folder
                ? 'messageFolderUpdateSuccess'
                : 'messageFileUpdateSuccess',
            variant: 'success'
        });
        if (onSave) onSave({ target: editedFolder, action: 'edit' });
    };

    /**
     * Copy Folder handlers
     */
    const handleClickCopy = () => {
        setSelectedFolder(activeFolder);
        copyDialog.current.open();
        onClose();
    };

    const handleFolderCopy = (destinationFolder: Node) => {
        copyDialog.current.close();
        const target =
            _.get(node, 'nodeRef') || _.get(selectedFolder, 'nodeRef');

        showMessage({
            message: 'copyPending',
            variant: 'pending'
        });
        copyNode(target, destinationFolder.nodeRef)
            .then(() => {
                showMessage({
                    message: 'copySuccess',
                    variant: 'success'
                });
                setSelectedFolder(null);
                if (onSave) {
                    onSave({
                        action: 'copy',
                        destination: destinationFolder,
                        target: selectedFolder
                    });
                } else onClose();
                return null;
            })
            .catch(e => {
                throw e;
            });
    };

    /**
     * Move Folder handlers
     */
    const handleClickMove = () => {
        setSelectedFolder(activeFolder);
        moveDialog.current.open();
        onClose();
    };

    /**
     * Move Folder handlers
     */
    const handleClickDownload = () => {
        window.open(DOWNLOAD_URL(node.nodeRef, node.name), '_blank');
    };

    const handleFolderMove = (destinationFolder: Node) => {
        moveDialog.current.close();
        const target =
            _.get(node, 'nodeRef') || _.get(selectedFolder, 'nodeRef');
        showMessage({
            message: 'movePending',
            variant: 'pending'
        });
        moveNode(target, destinationFolder.nodeRef)
            .then(response => {
                if (response.value.data.status !== 200) {
                    showMessage({
                        message: response.value.data.error[0],
                        variant: 'error'
                    });
                } else {
                    showMessage({
                        message: 'moveSuccess',
                        variant: 'success'
                    });
                }
                setSelectedFolder(null);
                if (onSave) {
                    onSave({
                        action: 'move',
                        destination: destinationFolder,
                        target: selectedFolder
                    });
                } else onClose();
                return null;
            })
            .catch(e => {
                showMessage({
                    message: 'messageFolderCopyError',
                    variant: 'error',
                    info: e
                });
                throw e;
            });
    };

    /**
     * Delete Folder handlers
     */
    const handleClickDelete = () => {
        dialogFolderConfirm.current.open();
        onClose(); // close menu
    };

    const handleConfirmDelete = () => {
        if (node)
            showMessage({
                message: 'deletePending',
                variant: 'pending'
            });

        deleteNode(node.nodeRef)
            .then(() => {
                showMessage({
                    message: 'messageFolderDeleteSuccess',
                    variant: 'success'
                });
                if (onSave) {
                    onSave({ action: 'delete', target: folder });
                } else onClose();
                return null;
            })
            .catch(e => {
                showMessage({
                    message: 'messageFolderDeleteError',
                    variant: 'error',
                    info: e
                });
            });
        dialogFolderConfirm.current.close();
    };

    /**
     * View file handlers
     */

    const handleClickViewFile = () => {
        if (node) {
            setActiveFile(node);
            router.push(`/documents/details/${node.nodeRef.split('/').pop()}`);
        }
    };

    const handleClickViewFolder = () => {
        if (node) {
            setActiveFolder(node);
            router.push(
                createHashPath(
                    _.concat(getHashPaths(), node.shortName || node.name)
                )
            );
        }
        onClose(); // close menu
    };

    /**
     * Permissions Folders handlers
     */
    const handleClickPermissions = () => {
        permissionsDialog.current.open();
        onClose();
    };

    const handleSavePermissions = () => {
        if (onSave) onSave({ action: 'permissions', target: node });
    };

    const handleValidateMove = (args: ValidateArgs) => {
        const { targetFolder } = args;
        const disallowedRefs = [node.nodeRef];

        if (!targetFolder) {
            return 'messageFolderNoTargetError';
        }

        if (
            targetFolder &&
            _.indexOf(disallowedRefs, (targetFolder || {}).nodeRef) > -1
        ) {
            return 'messageFolderInvalidTargetError';
        }

        // Cannot select the folder you are trying to move / copy
        if (
            targetFolder &&
            activeFolder &&
            targetFolder.nodeRef === activeFolder.nodeRef
        ) {
            return 'messageFolderSameTargetError';
        }

        // Cannot select org folder
        if (
            targetFolder &&
            (targetFolder.isOrgRoot || targetFolder.isOrgFolder)
        ) {
            return 'messageFolderNoOrgError';
        }

        // cannot select readonly folder
        if (targetFolder && !targetFolder.permission.create) {
            return 'messageFolderNoWriteAccess';
        }

        return null;
    };

    const handleValidateCopy = (args: ValidateArgs) => {
        const { targetFolder } = args;
        const disallowedRefs = [node.nodeRef];

        if (!targetFolder) {
            return 'messageFolderNoTargetError';
        }

        if (
            targetFolder &&
            _.indexOf(disallowedRefs, (targetFolder || {}).nodeRef) > -1
        ) {
            return 'messageFolderInvalidTargetError';
        }

        // Cannot select the folder you are trying to move / copy
        const allowTargetSelf = node.type !== 'cm:folder';
        if (
            targetFolder &&
            activeFolder &&
            targetFolder.nodeRef === activeFolder.nodeRef &&
            !allowTargetSelf
        ) {
            return 'messageFolderSameTargetError';
        }

        // Cannot select org folder
        if (
            targetFolder &&
            (targetFolder.isOrgRoot || targetFolder.isOrgFolder)
        ) {
            return 'messageFolderNoOrgError';
        }

        // cannot select readonly folder
        if (targetFolder && !targetFolder.permission.create) {
            return 'messageFolderNoWriteAccess';
        }

        return null;
    };

    if (!node) return null;

    /**
     * Render logic
     */
    const isOpen =
        (file || folder) && (passRef || (coords && coords.mouseY !== null));

    // show / hide actions if given `actions` array
    const displayActionNew = displayAction(node, 'new', actions);
    const displayActionEdit = displayAction(node, 'edit', actions);
    const displayActionDelete = displayAction(node, 'delete', actions);
    const displayActionCopy = displayAction(node, 'copy', actions);
    const displayActionMove = displayAction(node, 'move', actions);
    const displayActionPermissions = displayAction(
        node,
        'permissions',
        actions
    );
    const displayActionDownload = displayAction(node, 'download', actions);

    let menuProps = {};
    // menu props specific to folders
    if (coords) {
        menuProps = {
            anchorReference: 'anchorPosition',
            anchorPosition: { top: coords.mouseY, left: coords.mouseX }
        };
        // menu props specific to files
    } else {
        menuProps = {
            getContentAnchorEl: null,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
            },
            anchorEl: passRef
        };
    }

    let diaglogRef;
    if (activeRepo === REPO_BUSINESS && businessRefs)
        diaglogRef = businessRefs[0];
    if (activeRepo === REPO_PERSONAL && personalRef) diaglogRef = personalRef;

    return (
        <Fragment>
            <Menu
                keepMounted
                open={isOpen}
                className={classes.root}
                onClose={onClose}
                {...menuProps}
            >
                <MenuItem
                    data-cy="view"
                    onClick={
                        node.type === 'cm:content'
                            ? handleClickViewFile
                            : handleClickViewFolder
                    }
                >
                    <ListItemIcon>
                        <OpenInNewIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            node.type === 'cm:content'
                                ? intl.formatMessage(messages.view)
                                : intl.formatMessage(messages.openFolder)
                        }
                    />
                </MenuItem>

                {node.type !== 'cm:folder' && displayActionDownload && (
                    <MenuItem data-cy="download" onClick={handleClickDownload}>
                        <ListItemIcon>
                            <GetAppIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.download)}
                        />
                    </MenuItem>
                )}

                <MenuItem data-cy="properties" onClick={handleClickProperties}>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary={intl.formatMessage(messages.info)} />
                </MenuItem>

                {displayActionNew && (
                    <MenuItem data-cy="new" onClick={handleClickNew}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.new)}
                        />
                    </MenuItem>
                )}
                {displayActionEdit && (
                    <MenuItem data-cy="edit" onClick={handleClickEdit}>
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.edit)}
                        />
                    </MenuItem>
                )}
                <Divider />

                {displayActionCopy && (
                    <MenuItem data-cy="copy" onClick={handleClickCopy}>
                        <ListItemIcon>
                            <FileCopyIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.copy)}
                        />
                    </MenuItem>
                )}
                {displayActionMove && (
                    <MenuItem data-cy="move" onClick={handleClickMove}>
                        <ListItemIcon>
                            <ArrowForwardIosIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.move)}
                        />
                    </MenuItem>
                )}
                {displayActionDelete && (
                    <MenuItem data-cy="delete" onClick={handleClickDelete}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.delete)}
                        />
                    </MenuItem>
                )}

                {(displayActionCopy ||
                    displayActionMove ||
                    displayActionDelete) && <Divider />}
                {displayActionPermissions && (
                    <MenuItem
                        data-cy="permissions"
                        onClick={handleClickPermissions}
                    >
                        <ListItemIcon>
                            <ShareIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={intl.formatMessage(messages.permissions)}
                        />
                    </MenuItem>
                )}
            </Menu>
            <DialogFolderConfirm
                folder={node}
                onConfirm={handleConfirmDelete}
                passRef={dialogFolderConfirm}
            />
            <DialogFolder
                passRef={newDialogForm}
                onSave={handleFolderNew}
                parentFolder={node}
            />
            <DialogNode
                passRef={editDialogForm}
                node={node}
                onSave={handleFolderEdit}
            />
            <DialogTreeLibrarySelect
                passRef={moveDialog}
                onSelect={handleFolderMove}
                title={intl.formatMessage(messages.selectMoveFolder)}
                parentRef={diaglogRef}
                validateTarget={handleValidateMove}
            />
            <DialogTreeLibrarySelect
                passRef={copyDialog}
                onSelect={handleFolderCopy}
                title={intl.formatMessage(messages.selectCopyFolder)}
                parentRef={diaglogRef}
                validateTarget={handleValidateCopy}
            />
            <DialogPermissions
                passRef={permissionsDialog}
                title={node.name}
                nodeRef={node.nodeRef}
                onSave={handleSavePermissions}
            />
            <DialogProperties passRef={propertiesDialog} node={node} />
        </Fragment>
    );
};

export default compose(
    withRouter,
    RepoContainer(),
    MessageContainer(),
    injectIntl
)(MenuActionsRepo);
