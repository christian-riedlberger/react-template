// @flow
import React, { useRef, Fragment, useState } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { injectIntl, intlShape } from 'react-intl';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShareIcon from '@material-ui/icons/PersonAddOutlined';
import { compose } from 'recompose';

import messages from 'constants/Messages';
import MessageContainer from 'containers/MessageContainer';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import DialogFolderConfirm from 'components/DialogFolderConfirm';
import DialogTreeLibrarySelect from 'components/DialogTreeLibrarySelect';
import DialogPermissions from 'components/DialogPermissions';
import type { Node, Actions } from 'types/repoTypes';
import { DOWNLOAD_URL } from 'constants/ServiceURI';
import DialogNode from 'components/DialogNode';
import DialogProperties from 'components/DialogProperties';
import { REPO_BUSINESS, REPO_PERSONAL } from 'constants/Config';
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
    onSave?: Function, // form success callback
    actions?: Array<Actions>,
    activeFolder: Object
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        marginTop: '-1em',
        marginRight: '1em'
    }
});

const MenuActionsRepoFlat = (props: Props) => {
    const {
        intl,
        folder,
        file,
        deleteNode,
        showMessage,
        activeFolder, // $FlowFixMe
        moveNode, // $FlowFixMe
        copyNode,
        onSave,
        actions,
        activeRepo,
        router,
        businessRefs,
        personalRef
    } = props;

    const classes = useStyles();
    const dialogFolderConfirm = useRef({});

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
     * Edit Folder handlers
     */
    const handleClickEdit = () => {
        editDialogForm.current.open();
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
                    messages: 'copySuccess',
                    variant: 'success'
                });
                setSelectedFolder(null);
                if (onSave) {
                    onSave({
                        action: 'copy',
                        destination: destinationFolder,
                        target: selectedFolder
                    });
                }
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
                }
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
    };

    const handleGoBack = () => {
        if (window.history.length > 1) {
            return browserHistory.goBack();
        }

        return router.push('/documents#/business');
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

                handleGoBack();

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
     * Permissions Folders handlers
     */
    const handleClickPermissions = () => {
        permissionsDialog.current.open();
    };

    const handleSavePermissions = () => {};

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
     * show / hide actions if given `actions` array
     */
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

    let diaglogRef;
    if (activeRepo === REPO_BUSINESS && businessRefs)
        diaglogRef = businessRefs[0];
    if (activeRepo === REPO_PERSONAL && personalRef) diaglogRef = personalRef;

    return (
        <div className={classes.root}>
            <Fragment>
                <MenuList>
                    {node.type !== 'cm:folder' && displayActionDownload && (
                        <MenuItem
                            data-cy="download"
                            onClick={handleClickDownload}
                        >
                            <ListItemIcon>
                                <GetAppIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={intl.formatMessage(messages.download)}
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

                    {displayActionPermissions && (
                        <MenuItem
                            data-cy="permissions"
                            onClick={handleClickPermissions}
                        >
                            <ListItemIcon>
                                <ShareIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={intl.formatMessage(
                                    messages.permissions
                                )}
                            />
                        </MenuItem>
                    )}
                </MenuList>
                <DialogFolderConfirm
                    folder={node}
                    onConfirm={handleConfirmDelete}
                    passRef={dialogFolderConfirm}
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
        </div>
    );
};

export default compose(
    withRouter,
    RepoContainer(),
    MessageContainer(),
    injectIntl
)(MenuActionsRepoFlat);
