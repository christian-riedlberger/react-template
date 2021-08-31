// @flow
import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { injectIntl, intlShape } from 'react-intl';
import { compose } from 'recompose';
import _ from 'lodash';
import { usePreviousValue } from 'beautiful-react-hooks';

import IconButton from '@material-ui/core/IconButton';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolderOutlined';
import Tooltip from '@material-ui/core/Tooltip';

import Dialog from 'components/Dialog';
import DialogFolder from 'components/DialogFolder';
import messages from 'constants/Messages';
import TreeLibrary from 'components/TreeLibrary';
import RepoContainer from 'containers/RepoContainer';
import type { ContainerProps as RepoContainerProps } from 'containers/RepoContainer';
import { fetchDataListDocuments } from 'actions/ActionRepo';
import { REPO_PERSONAL, REPO_BUSINESS } from 'constants/Config';
import type { Node as NodeType } from 'types/repoTypes';

import MultiActionTabs from './MultiActionTabs';

type DefaultProps = {
    ...RepoContainerProps,
    intl: intlShape
};

export type ValidateArgs = { targetFolder: NodeType | null };

type Props = {
    activeFolder: Object,
    passRef: Function, // handles `ref={r => { this.dial = r; }}`
    intl: Function,
    onSelect: Function,
    parentRef?: string,
    title: string,
    validateTarget?: Function // returns string on validation error, null on success
} & DefaultProps;

const useStyles = makeStyles({
    root: {
        width: '500px',
        minHeight: '300px',
        maxHeight: '400px',
        overflowX: 'auto',
        overflowY: 'inherit'
    },
    tree: {}
});

const DialogTreeLibrarySelect = (props: Props) => {
    const {
        activeFolder,
        intl,
        passRef,
        title,
        onSelect,
        validateTarget
    } = props;
    const dialogFolderNew = useRef(DialogFolder);
    const classes = useStyles();
    const [targetFolder, setFolder] = useState(null);
    const prevFolder = usePreviousValue(targetFolder);
    const [errorMessage, setErrorMessage] = useState(null);
    const [personalRef, setPersonalRef] = useState(null);

    useEffect(() => {
        if (!personalRef) {
            fetchDataListDocuments({
                path: `/${localStorage.getItem('auth:username') || ''}`,
                pathContext: REPO_PERSONAL,
                includeFolders: true
            })
                .payload.then(resp => {
                    setPersonalRef(resp.data.parent.nodeRef);
                    return null;
                })
                .catch(err => {
                    throw new Error(err);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Remove error message if user selects a new folder
    const hasChanged =
        _.get(prevFolder, 'folder.nodeRef', null) !==
        _.get(targetFolder, 'folder.nodeRef', null);
    useEffect(() => {
        if (targetFolder && errorMessage && hasChanged) {
            setErrorMessage(null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasChanged, targetFolder]);

    const handleSelect = () => {
        if (validateTarget) {
            const err = validateTarget({
                targetFolder: _.get(targetFolder, 'folder')
            });
            if (!_.isNull(err)) {
                setErrorMessage(err);
            } else {
                setErrorMessage(null);
                if (onSelect) {
                    onSelect(_.get(targetFolder, 'folder'));
                }
            }
        }
    };

    // Reset error message if user uses cancel action
    const handleClose = () => {
        if (errorMessage !== null) {
            setErrorMessage(null);
        }
    };

    const handleChange = () => {
        setFolder(null);
    };

    const handleNewFolder = () => {
        dialogFolderNew.current.open();
    };

    const handleNewSaveFolder = () => {
        if (targetFolder) targetFolder.refresh();
    };

    const tabs = [REPO_BUSINESS, REPO_PERSONAL];
    const panes = [
        <TreeLibrary
            ignorePath
            hideContext
            activeFolder={activeFolder}
            setActiveFolder={setFolder}
            parentRef="root"
            className={classes.tree}
        />,
        <TreeLibrary
            ignorePath
            hideContext
            includeParent
            activeFolder={activeFolder}
            setActiveFolder={setFolder}
            parentRef={personalRef}
            className={classes.tree}
        />
    ];

    const customActionsLeft = [
        targetFolder && !_.get(targetFolder, 'folder.isOrgRoot') && (
            <Tooltip
                title={intl.formatMessage(messages.newFolder)}
                placement="top"
            >
                <IconButton
                    aria-label="new folder"
                    component="span"
                    onClick={handleNewFolder}
                >
                    <CreateNewFolderIcon />
                </IconButton>
            </Tooltip>
        )
    ];

    return (
        <React.Fragment>
            <Dialog
                intl={intl}
                ref={passRef}
                title={
                    targetFolder && _.get(targetFolder, 'folder.name')
                        ? `${title} ${_.get(targetFolder, 'folder.name')} `
                        : `${title} ${intl.formatMessage(
                              messages.selectDefaultFolderDestination
                          )}`
                }
                onSave={handleSelect}
                onClose={handleClose}
                primaryActionMessage={intl.formatMessage(messages.select)}
                errorMessage={errorMessage}
                customActionsLeft={customActionsLeft}
            >
                <div className={classes.root}>
                    <MultiActionTabs
                        tabs={tabs}
                        panes={panes}
                        onChange={handleChange}
                    />
                </div>
            </Dialog>
            <DialogFolder
                passRef={dialogFolderNew}
                parentFolder={_.get(targetFolder, 'folder')}
                onSave={handleNewSaveFolder}
            />
        </React.Fragment>
    );
};

export default compose(
    RepoContainer(),
    injectIntl
)(DialogTreeLibrarySelect);
