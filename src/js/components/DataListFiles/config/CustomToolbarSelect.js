import _ from 'lodash';
import React, { PureComponent } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import SharedIcon from '@material-ui/icons/PeopleOutlineOutlined';
import { mapProps } from 'recompose';
import RepoContainer from 'containers/RepoContainer';
import DialogTreeLibrarySelect from 'components/DialogTreeLibrarySelect';
import messages from 'constants/Messages';
import { displayAction } from 'utils/repo';
import type { Actions, Node } from 'types/repoTypes';
import DialogFolderConfirm from 'components/DialogFolderConfirm';
import DialogProperties from 'components/DialogProperties';
import DialogPermissions from 'components/DialogPermissionsMulti';
import MessageContainer from 'containers/MessageContainer';
import type { ContainerProps as MessageProps } from 'containers/MessageContainer';
import type { ValidateArgs } from 'components/DialogTreeLibrarySelect';

import MoreMenu from './MoreMenu';

type DefaultProps = {} & RepoContainerProps & MessageProps;

type Props = {
    intl: intlShape,
    classes: Object,
    debouncedSearch: Function
} & DefaultProps;

const defaultToolbarSelectStyles = {
    iconButton: {
        padding: '0.3em',

        '& .MuiSvgIcon-root': {
            fontSize: '1.1em'
        }
    },
    iconContainer: {},
    inverseIcon: {
        transform: 'rotate(90deg)'
    }
};

const getSelectedDocs = (
    docs: Array<Object>,
    selected: { data: Array<{ index: number }> }
): Array<Node> => _.map(_.pick(docs, _.map(selected.data, 'index')));

const getNodesAction = (nodes: Array<Object>, action: Actions) =>
    _.every(_.map(nodes, node => displayAction(node, action)));

@MessageContainer()
@injectIntl
@RepoContainer({})
@mapProps(props => ({
    ...props,
    selectedDocuments: getSelectedDocs(props.documentList, props.selectedRows)
}))
@withStyles(defaultToolbarSelectStyles, { name: 'CustomToolbarSelect' })
class CustomToolbarSelect extends PureComponent<Props> {
    dialogDelete: DialogFolderConfirm;
    dialogMove: DialogTreeLibrarySelect;
    dialogCopy: DialogTreeLibrarySelect;
    dialogPermission: DialogPermissions;
    propertiesDialog: DialogProperties;

    // Reset delete state after close
    handleCloseDialog = (refresh: boolean) => {
        if (refresh) this.props.debouncedSearch();
    };

    deleteFiles = () => {
        this.dialogDelete.open();
    };

    moveFiles = () => {
        this.dialogMove.open();
    };

    copyFiles = () => {
        this.dialogCopy.open();
    };

    shareFiles = () => {
        this.dialogPermission.open();
    };

    handleClickProperties = () => {
        this.propertiesDialog.open();
    };

    handleFolderMove = (destinationFolder: Node) => {
        const { moveNode, selectedDocuments, showMessage } = this.props;
        this.dialogMove.close();
        showMessage({
            message: 'movePending',
            variant: 'pending'
        });
        moveNode(_.map(selectedDocuments, 'nodeRef'), destinationFolder.nodeRef)
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
                this.handleCloseDialog(true);
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

    handleFolderCopy = (destinationFolder: Node) => {
        const { copyNode, selectedDocuments, showMessage } = this.props;
        this.dialogCopy.close();

        showMessage({
            message: 'copyPending',
            variant: 'pending'
        });
        copyNode(_.map(selectedDocuments, 'nodeRef'), destinationFolder.nodeRef)
            .then(() => {
                showMessage({
                    message: 'copySuccess',
                    variant: 'success'
                });
                this.handleCloseDialog(true);
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

    handleConfirmDelete = () => {
        const { deleteNode, selectedDocuments, showMessage } = this.props;
        this.dialogDelete.close();
        showMessage({
            message: 'deletePending',
            variant: 'pending'
        });
        deleteNode(_.map(selectedDocuments, 'nodeRef'))
            .then(() => {
                showMessage({
                    message: 'messageFolderDeleteSuccess',
                    variant: 'success'
                });
                this.handleCloseDialog(true);
                return null;
            })
            .catch(e => {
                showMessage({
                    message: 'messageFolderDeleteError',
                    variant: 'error',
                    info: e
                });
            });
        this.dialogDelete.close();
    };

    handleSavePermissions = () => {
        this.dialogPermission.close();
        this.handleCloseDialog(true);
    };

    handleValidateMove = (args: ValidateArgs) => {
        const { targetFolder } = args;
        const { selectedDocuments, activeFolder } = this.props;
        const disallowedRefs = _.map(selectedDocuments, 'nodeRef');

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

    handleValidateCopy = (args: ValidateArgs) => {
        const { targetFolder } = args;
        const { selectedDocuments, activeFolder } = this.props;
        const disallowedRefs = _.map(selectedDocuments, 'nodeRef');

        // allow user to select current folder if copying / moving files
        const allowTargetSelf = _.every(
            selectedDocuments,
            d => d.type !== 'cm:folder'
        );

        if (!targetFolder) {
            return 'messageFolderNoTargetError';
        }

        if (
            targetFolder &&
            _.indexOf(disallowedRefs, (targetFolder || {}).nodeRef) > -1
        ) {
            return 'messageFolderInvalidTargetError';
        }
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

    render() {
        const { classes, intl, selectedDocuments } = this.props;
        const displayActionDelete = getNodesAction(selectedDocuments, 'delete');
        const displayActionCopy = getNodesAction(selectedDocuments, 'copy');
        const displayActionMove = getNodesAction(selectedDocuments, 'move');
        const displayActionPermissions = getNodesAction(
            selectedDocuments,
            'permissions'
        );

        return (
            <div className={classes.iconContainer}>
                {displayActionPermissions && (
                    <Tooltip title={intl.formatMessage(messages.share)}>
                        <IconButton
                            className={classes.iconButton}
                            onClick={this.shareFiles}
                        >
                            <SharedIcon className={classes.icon} />
                        </IconButton>
                    </Tooltip>
                )}

                {displayActionDelete && (
                    <Tooltip title={intl.formatMessage(messages.delete)}>
                        <IconButton
                            className={classes.iconButton}
                            onClick={this.deleteFiles}
                        >
                            <DeleteIcon className={classes.icon} />
                        </IconButton>
                    </Tooltip>
                )}

                {(selectedDocuments.length === 1 ||
                    displayActionCopy ||
                    displayActionMove) && (
                    <Tooltip title={intl.formatMessage(messages.share)}>
                        <MoreMenu
                            onCopy={this.copyFiles}
                            onMove={this.moveFiles}
                            onOpenProperties={this.onOpenProperties}
                            displayActionCopy={displayActionCopy}
                            displayActionMove={displayActionMove}
                            selectedDocuments={selectedDocuments}
                        />
                    </Tooltip>
                )}

                <DialogFolderConfirm
                    folders={_.map(selectedDocuments, 'name')}
                    onConfirm={this.handleConfirmDelete}
                    passRef={ref => {
                        this.dialogDelete = ref;
                    }}
                />
                <DialogTreeLibrarySelect
                    passRef={ref => {
                        this.dialogMove = ref;
                    }}
                    onSelect={this.handleFolderMove}
                    title={intl.formatMessage(
                        messages.selectMoveMultipleFolderDestination,
                        { count: selectedDocuments.length }
                    )}
                    validateTarget={this.handleValidateMove}
                />
                <DialogTreeLibrarySelect
                    passRef={ref => {
                        this.dialogCopy = ref;
                    }}
                    onSelect={this.handleFolderCopy}
                    title={intl.formatMessage(
                        messages.selectCopyMultipleFolderDestination,
                        { count: selectedDocuments.length }
                    )}
                    validateTarget={this.handleValidateCopy}
                />
                <DialogPermissions
                    passRef={ref => {
                        this.dialogPermission = ref;
                    }}
                    nodes={selectedDocuments}
                    onSave={this.handleSavePermissions}
                    onClose={() => this.handleCloseDialog(true)}
                />

                <DialogProperties
                    passRef={ref => {
                        this.propertiesDialog = ref;
                    }}
                    node={selectedDocuments ? selectedDocuments[0] : null}
                />
            </div>
        );
    }
}

export default CustomToolbarSelect;
